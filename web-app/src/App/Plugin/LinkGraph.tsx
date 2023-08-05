import { useContext, useEffect, useRef } from "react";
import { RNPluginCreator } from "./type";
import * as d3 from "d3";
import { EditorContext } from "../Context";
import { textToTitle } from "src/Note";
import useMemoAsync from "../useMemoAsync";

// https://observablehq.com/@d3/disjoint-force-directed-graph/2?intent=fork

type Node = { id: string; title: string };
type Link = { source: string; target: string };

const Page = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { allNotes, getNoteByTitle } = useContext(EditorContext);

  const data = useMemoAsync(async () => {
    if (allNotes) {
      const nodes = Object.keys(allNotes).map((id) => ({
        id: id,
        title: textToTitle(allNotes[id].text, 20),
      }));

      const links: Link[] = [];
      for (const note of Object.values(allNotes)) {
        const matches = Array.from(note.text.matchAll(/\[\[([^\[\]]+)\]\]/g));
        for (const match of matches) {
          const title = match[1];
          const linkedNote = await getNoteByTitle(title);
          if (linkedNote) {
            links.push({
              source: note.id,
              target: linkedNote.id,
            });
          }
        }
      }
      return { nodes, links };
    }
  }, [allNotes]);

  useEffect(() => {
    if (!data) return;

    // Specify the dimensions of the chart.
    const width = 600;
    const height = 600;

    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({ ...d }));

    // Create a simulation with several forces.
    const forceMany = d3.forceManyBody().strength(-150);
    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3.forceLink(links).id((d) => (d as Node).id)
      )
      .force("charge", forceMany)
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // Create the SVG container.
    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Add a line for each link, and a circle for each node.
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const g = svg.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5);

    const node = g
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("fill", "red");

    node.append("title").text((d) => d.title);

    const text = g
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.title)
      .style("stroke-width", 0)
      .style("fill", "gray")
      .style("font-size", "8px");

    // Add a drag behavior.
    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
    );

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      text.attr("transform", (d: any) => {
        return "translate(" + (d.x - 10) + "," + (d.y + 14) + ")";
      });
    });

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    if (ref.current) {
      ref.current.replaceChildren(svg.node() as any);
    }
  }, [ref.current, data]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div ref={ref} />
    </div>
  );
};

export const LinkGraphPlugin: RNPluginCreator = () => {
  return {
    name: "Link Graph",
    version: 1,
    page: {
      url: "link-graph",
      element: <Page />,
    },
  };
};
