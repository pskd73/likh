import { useContext } from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";
import Toolbar from "../Toolbar";
import { Topic } from "../../type";

const topics: Topic[] = [
  { title: "Python", createdAt: new Date().getTime() },
  { title: "Philosophy", createdAt: new Date().getTime() },
];

const Habit = () => {
  const { trayOpen, setActiveTray, setTrayOpen } = useContext(AppContext);

  const handleTitleClick = () => {
    setActiveTray("habit");
    setTrayOpen(!trayOpen);
  };

  return (
    <div>
      <div className="p-4">
        Interested topics
        <br />
        ~~~~~~~~~~~~~~~~
        <ul className="space-y-3">
          {topics.map((topic, i) => (
            <li className="flex" key={i}>
              <div className="pr-2">{i + 1}.</div>
              <div>
                <div>{topic.title}</div>
                <Clickable lite>
                  <span>delete</span>
                </Clickable>
              </div>
            </li>
          ))}

          <li className="flex">
            <div className="pr-2">{topics.length + 1}.</div>
            <div className="-mt-1">
              <input
                type="text"
                placeholder="Add topic"
                className="outline-none py-1"
              />
              <div className="-mt-3">
                <span className="opacity-50">-----</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <Toolbar className="bg-white">
        <Toolbar.Title>
          <Clickable>
            <span onClick={handleTitleClick}>Habit</span>
          </Clickable>
        </Toolbar.Title>
      </Toolbar>
    </div>
  );
};

export default Habit;
