import { BiFile, BiPlus } from "react-icons/bi";
import List from "./List";
import { useContext } from "react";
import { EditorContext } from "./Context";
import { INTRO_TEXT } from "./Intro";
import classNames from "classnames";

const HomeScreen = () => {
  const { newNote } = useContext(EditorContext);

  return (
    <div className="h-full">
      <div className="text-7xl md:text-center w-full py-20">
        Hello, <span className="italic">there!</span>
      </div>
      <div className="flex flex-col md:flex-row justify-center">
        <div className="w-52 md:flex flex-col items-end hidden">
          <div className="pt-1 font-bold">Start</div>
        </div>
        <div
          className={classNames(
            "md:border-l-2 border-primary-700",
            "border-opacity-30 md:pl-4 md:ml-4 md:w-52"
          )}
        >
          <div className="bg-primary-700 bg-opacity-10 p-2 rounded">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
