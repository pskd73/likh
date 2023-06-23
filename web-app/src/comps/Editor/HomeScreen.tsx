import { BiFile, BiHash, BiPlus } from "react-icons/bi";
import { BsCursorText } from "react-icons/bs";
import List from "./List";
import { PropsWithChildren, useContext, useMemo } from "react";
import { EditorContext, NoteSummary } from "./Context";
import { INTRO_TEXT } from "./Intro";
import classNames from "classnames";
import { textToTitle } from "../../Note";
import { SavedNote } from "./type";

const Title = ({ children }: PropsWithChildren) => {
  return <div className="mb-2 font-bold opacity-50">{children}</div>;
};

const ListContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-primary-700 bg-opacity-10 p-2 rounded">{children}</div>
  );
};

const HomeScreen = () => {
  const { newNote, notesToShow, note, setNote, getHashtags, setRollHashTag } =
    useContext(EditorContext);
  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);

  const handleNoteClick = (note: SavedNote) => {
    setNote(note);
  };

  const handleHashtagClick = (hashtag: string) => {
    setRollHashTag(hashtag);
  };

  return (
    <div className="h-full">
      <div className="text-5xl md:text-center w-full py-20 flex md:justify-center">
        <span>Hello there</span>
        <span className="mt-1"><BsCursorText /></span>
      </div>
      <div className="flex flex-col md:flex-row justify-center">
        <div
          className={classNames(
            "md:flex md:space-x-4 w-full justify-center",
            "border-opacity-30 space-y-2 md:space-y-0"
          )}
        >
          <div className="space-y-2">
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
            {Object.keys(hashtags).length > 0 && (
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
          </div>
          {notesToShow.length > 0 && (
            <div>
              <Title>Latest</Title>
              <ListContainer>
                <List>
                  {notesToShow.slice(0, 10).map((note) => (
                    <List.Item
                      key={note.note.id}
                      withIcon
                      onClick={() => handleNoteClick(note.note)}
                      className="last:mb-0"
                    >
                      <List.Item.Icon>
                        <BiFile />
                      </List.Item.Icon>
                      <span>{textToTitle(note.note.text)}</span>
                    </List.Item>
                  ))}
                </List>
              </ListContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
