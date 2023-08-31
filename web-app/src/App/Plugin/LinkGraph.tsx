import { useContext, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { EditorContext } from "../Context";
import { textToTitle } from "src/Note";
import useMemoAsync from "../useMemoAsync";
import { useNavigate, useParams } from "react-router-dom";
import { PluginContext } from "./Context";
import List from "../List";
import { BiGitRepoForked } from "react-icons/bi";
import Event from "src/components/Event";
import { Select } from "src/comps/Form";
import classNames from "classnames";
import { FolderItem } from "../Folders";

// https://observablehq.com/@d3/disjoint-force-directed-graph/2?intent=fork

type Node = { id: string; title: string };
type Link = { source: string; target: string };

const Page = () => {
  const { setFullPage, getHashtags } = useContext(EditorContext);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { allNotes, getNoteByTitle, newNote } = useContext(EditorContext);
  const tags = useMemo(() => {
    const _tags: Record<string, boolean> = {};
    for (const tag of Object.keys(getHashtags())) {
      if (!tag) continue;
      _tags[tag.split("/")[0]] = true;
    }
    return Object.keys(_tags);
  }, [allNotes]);
  const [tag, setTag] = useState("all");
  const [excludeMentions, setExcludeMentions] = useState(false);

  const data = useMemoAsync(async () => {
    if (allNotes) {
      const nonExistingNodes: Record<string, boolean> = {};
      let notes = Object.values(allNotes);
      if (tag !== "all") {
        const hashtags = getHashtags();
        const keys = Object.keys(hashtags).filter((t) => t.startsWith(tag));
        notes = [];
        for (const key of keys) {
          notes = [...notes, ...hashtags[key]];
        }
      }

      const links: Link[] = [];
      const nodes: Record<
        string,
        { id: string; title: string; existing: boolean }
      > = {};

      for (const note of notes) {
        nodes[note.id] = {
          id: note.id,
          title: textToTitle(note.text, 20),
          existing: true,
        };

        const matches = Array.from(note.text.matchAll(/\[\[([^\[\]]+)\]\]/g));
        for (const match of matches) {
          const title = match[1];
          const linkedNote = await getNoteByTitle(title);
          if (linkedNote) {
            links.push({
              source: note.id,
              target: linkedNote.id,
            });
            nodes[linkedNote.id] = {
              id: linkedNote.id,
              title: textToTitle(linkedNote.text, 20),
              existing: true,
            };
          } else if (!excludeMentions) {
            links.push({
              source: note.id,
              target: title,
            });
            nonExistingNodes[title] = true;
          }
        }
      }

      return {
        nodes: [
          ...Object.values(nodes),
          ...Object.keys(nonExistingNodes).map((title) => ({
            id: title,
            title,
            existing: false,
          })),
        ],
        links,
      };
    }
  }, [allNotes, tag, excludeMentions]);

  useEffect(() => {
    if (!data) return;

    setFullPage(true);
    const rect = document
      .getElementById("page-container")
      ?.getBoundingClientRect();

    // Specify the dimensions of the chart.
    const width = rect?.width || 300;
    const height = window.innerHeight;

    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({ ...d }));

    // Create a simulation with several forces.
    const forceMany = d3.forceManyBody().strength(-150);
    const forceLink = d3
      .forceLink(links)
      .id((d) => (d as Node).id)
      .distance(60);
    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", forceLink)
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

    svg.call(d3.zoom().on("zoom", handleZoom) as any);

    const g = svg.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5);

    const node = g
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("cursor", "pointer")
      .attr("fill", (d: any) => color(d.existing));

    // node.append("title").text((d) => d.title);

    const text = g
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
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

    node.on("click", (_, d) => {
      if (d.existing) {
        navigate(`/write/note/${d.id}`);
      } else {
        const note = newNote({ text: `# ${d.title}` });
        if (note) {
          navigate(`/write/note/${note.id}`);
        }
      }
    });

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      text.attr("transform", (d: any, i) => {
        const _node: any = d3
          .selectAll(".label")
          .filter((d, _i) => i === _i)
          .node();
        const offset = _node?.getBBox().width / 2 || 0;
        return "translate(" + (d.x - offset) + "," + (d.y + 18) + ")";
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

    function handleZoom(event: any) {
      svg.selectAll("g").attr("transform", event.transform);
    }

    if (ref.current) {
      ref.current.replaceChildren(svg.node() as any);
    }

    return () => setFullPage(false);
  }, [ref.current, data]);

  useEffect(() => {
    Event.track("link-graph");
  }, []);

  return (
    <div className="relative">
      <div
        className={classNames(
          "absolute top-0 left-0",
          "md:flex items-center md:space-x-2",
          "space-y-1 md:space-y-0"
        )}
      >
        <Select
          className="h-auto px-2 py-1"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value={"all"}>All</option>
          {tags.map((tag, i) => (
            <option value={tag} key={i}>
              {tag}
            </option>
          ))}
        </Select>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={excludeMentions}
            onChange={(e) => setExcludeMentions(e.target.checked)}
          />
          <span>Exclude mentions</span>
        </label>
      </div>
      <div className="flex justify-center items-center w-full">
        <div ref={ref} />
      </div>
    </div>
  );
};

const MobileNavItem = () => {
  const navigate = useNavigate();
  return (
    <List.Item withIcon onClick={() => navigate("/write/plugin/link-graph")}>
      <List.Item.Icon>
        <BiGitRepoForked />
      </List.Item.Icon>
      <span>Link graph</span>
    </List.Item>
  );
};

const NavItem = () => {
  const navigate = useNavigate();
  const {pluginUrl} = useParams();

  return (
    <FolderItem
      level={0}
      label={"Link graph"}
      icon={<BiGitRepoForked />}
      onClickKind={() => navigate("/write/plugin/link-graph")}
      active={pluginUrl === "link-graph"}
    />
  );
};

export const LinkGraphPlugin = () => {
  const { register } = useContext(PluginContext);

  useEffect(() => {
    register("link-graph", {
      name: "Link Graph",
      version: 1,
      pages: { "link-graph": { page: <Page /> } },
      navigationItems: [<NavItem />],
      mobileSettingItems: [<MobileNavItem />],
    });
  }, []);

  return null;
};
