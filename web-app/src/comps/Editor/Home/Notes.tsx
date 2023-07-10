import { cloneElement, useContext, useState } from "react";
import { EditorContext } from "../Context";
import { ListContainer, Title } from "./Common";
import List from "../List";
import {
  BiArrowFromBottom,
  BiArrowFromTop,
  BiFile,
  BiInfoCircle,
} from "react-icons/bi";
import { textToTitle } from "../../../Note";
import { highlight, makeExtractor } from "../Marker";
import { escape } from "../../../util";
import { useNavigate } from "react-router-dom";

const Highligher = (word: string) =>
  makeExtractor(
    () => RegExp(escape(word), "i"),
    (text: string) => ({
      type: "element",
      content: <span className="bg-primary text-base text-xs">{text}</span>,
    })
  );

const Notes = ({
  toggleSeeAll,
  seeAll,
  noToggle,
  noTitle,
}: {
  toggleSeeAll: () => void;
  seeAll: boolean;
  noToggle?: boolean;
  noTitle?: boolean;
}) => {
  const navigate = useNavigate();
  const { notesToShow, searchTerm } = useContext(EditorContext);

  return (
    <div>
      {!noTitle && <Title>Notes</Title>}
      <ListContainer>
        {Object.keys(notesToShow).length === 0 && (
          <div className="text-sm p-2 flex items-center space-x-2">
            <span className="opacity-50">
              <BiInfoCircle />
            </span>
            <span>No notes!</span>
          </div>
        )}
        <List>
          {notesToShow
            .slice(0, searchTerm || seeAll ? notesToShow.length : 5)
            .map((summary) => (
              <List.Item
                key={summary.note.id}
                withIcon
                onClick={() => navigate(`/write/note/${summary.note.id}`)}
                className="flex-col"
              >
                <div className="flex">
                  <span className="opacity-50 mt-1 min-w-5 w-5">
                    <BiFile />
                  </span>
                  <span>{textToTitle(summary.note.text, 20)}</span>
                </div>
                {summary.summary &&
                  (!searchTerm || !searchTerm.startsWith("#")) && (
                    <List.Item.Description>
                      {highlight(summary.summary, [
                        Highligher(summary.highlight || ""),
                      ])
                        .map((it, i) => {
                          if (typeof it === "string") {
                            return <span>{it}</span>;
                          }
                          return it;
                        })
                        .map((it, i) => cloneElement(it, { key: i }))}
                    </List.Item.Description>
                  )}
              </List.Item>
            ))}
          {!noToggle && (
            <List.Item
              withIcon
              noHover
              className="last:mb-0 opacity-30 hover:underline cursor-pointer"
              onClick={toggleSeeAll}
            >
              <List.Item.Icon>
                {seeAll ? <BiArrowFromBottom /> : <BiArrowFromTop />}
              </List.Item.Icon>
              <span>[{seeAll ? "Collapse" : "See all"}]</span>
            </List.Item>
          )}
        </List>
      </ListContainer>
    </div>
  );
};

export default Notes;
