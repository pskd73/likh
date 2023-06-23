import { BiFile, BiHash, BiPlus, BiSearch, BiX } from "react-icons/bi";
import { BsCursorText } from "react-icons/bs";
import List from "./List";
import { PropsWithChildren, cloneElement, useContext, useMemo } from "react";
import { EditorContext, NoteSummary } from "./Context";
import { INTRO_TEXT } from "./Intro";
import { textToTitle } from "../../Note";
import { SavedNote } from "./type";
import LinkSuggestions from "./LinkSuggestions";
import useMemoAsync from "./useMemoAsync";
import classNames from "classnames";
import { highlight, makeExtractor } from "./Marker";

const Title = ({ children }: PropsWithChildren) => {
  return <div className="mb-2 font-bold opacity-50">{children}</div>;
};

const ListContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-primary-700 bg-opacity-5 p-2 rounded">{children}</div>
  );
};

const Highligher = (word: string) =>
  makeExtractor(
    () => RegExp(word, "i"),
    (text: string) => ({
      type: "element",
      content: <span className="bg-primary-700 text-white">{text}</span>,
    })
  );

const HomeScreen = () => {
  const {
    newNote,
    notesToShow,
    note,
    setNote,
    getHashtags,
    setRollHashTag,
    getLinkSuggestions,
    setSearchTerm,
    searchTerm,
    storage,
  } = useContext(EditorContext);
  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);

  const suggestions = useMemoAsync(async () => {
    let links = await getLinkSuggestions();
    links = links.sort((a, b) => b.occurances - a.occurances);
    return links.splice(0, 5);
  }, [storage.notes, note?.id]);

  const handleNoteClick = (note: SavedNote) => {
    setNote(note);
  };

  const handleHashtagClick = (hashtag: string) => {
    setRollHashTag(hashtag);
  };

  return (
    <div className="pb-20 flex flex-col items-center">
      <div className="space-y-4 w-full md:w-1/3">
        <div className="text-5xl md:text-center w-full py-20 flex md:justify-center">
          <span>Hello there</span>
          <span className="mt-1">
            <BsCursorText />
          </span>
        </div>
        <div
          className={classNames(
            "flex justify-between items-center text-2xl",
            "border rounded border-primary-700 border-opacity-20",
            "overflow-hidden p-2 px-4 shadow"
          )}
        >
          <input
            type="text"
            placeholder="Search here"
            className={classNames(
              "placeholder-primary-700 placeholder-opacity-60",
              "outline-none bg-base font-semibold w-full"
            )}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <div className="ml-2 opacity-50 flex space-x-2">
            {searchTerm && (
              <BiX
                onClick={() => setSearchTerm("")}
                className="cursor-pointer"
              />
            )}
            <BiSearch />
          </div>
        </div>
        {!searchTerm && (
          <div>
            <Title>Quick start</Title>
            <ListContainer>
              <List>
                <List.Item
                  withIcon
                  onClick={() =>
                    newNote({
                      text: `# A title for the note\nWrite your mind here ...`,
                    })
                  }
                >
                  <List.Item.Icon>
                    <BiPlus />
                  </List.Item.Icon>
                  <span>New note</span>
                </List.Item>
                <List.Item
                  withIcon
                  className="last:mb-0"
                  onClick={() => {
                    newNote({
                      text: INTRO_TEXT,
                    });
                  }}
                >
                  <List.Item.Icon>
                    <BiFile />
                  </List.Item.Icon>
                  <span>Create sample note</span>
                </List.Item>
              </List>
            </ListContainer>
          </div>
        )}
        {!searchTerm && Object.keys(hashtags).length > 0 && (
          <div>
            <Title>Journals</Title>
            <ListContainer>
              {Object.keys(hashtags).map((hashtag, i) => (
                <List.Item
                  key={i}
                  withIcon
                  onClick={() => handleHashtagClick(hashtag)}
                  className="last:mb-0"
                >
                  <List.Item.Icon>
                    <BiHash />
                  </List.Item.Icon>
                  <span>{hashtag.replaceAll("#", "")}</span>
                </List.Item>
              ))}
            </ListContainer>
          </div>
        )}
        {notesToShow.length > 0 && (
          <div>
            {!searchTerm && <Title>Latest</Title>}
            <ListContainer>
              <List>
                {notesToShow
                  .slice(0, searchTerm ? notesToShow.length : 5)
                  .map((summary) => (
                    <List.Item
                      key={summary.note.id}
                      withIcon
                      onClick={() => handleNoteClick(summary.note)}
                      className="last:mb-0 flex-col"
                    >
                      <div className="flex">
                        <span className="opacity-50 mt-1 min-w-5 w-5">
                          <BiFile />
                        </span>
                        <span>{textToTitle(summary.note.text, 20)}</span>
                      </div>
                      {summary.summary && (
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
              </List>
            </ListContainer>
          </div>
        )}
        {!searchTerm && suggestions && (suggestions.length || 0) > 0 && (
          <div>
            <Title>Your topics</Title>
            <LinkSuggestions suggestions={suggestions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
