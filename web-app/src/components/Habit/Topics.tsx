import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useContext,
  useMemo,
  useState,
} from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";

const Topics = () => {
  const { addTopic, topicCollection, deleteTopic } = useContext(AppContext);
  const [newTopic, setNewTopic] = useState("");
  const topics = useMemo(
    () => Object.values(topicCollection || {}),
    [topicCollection]
  );

  const handleNewTopicChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewTopic(e.target.value);
  };

  const handleNewTopicKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === "Enter") {
      addTopic({ title: newTopic, createdAt: new Date().getTime() });
      setNewTopic("");
    }
  };

  const handleDeleteTopic = (name: string) => {
    deleteTopic(name);
  };

  return (
    <div>
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
                <span onClick={() => handleDeleteTopic(topic.title)}>
                  delete
                </span>
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
              className="outline-none py-1 dark:bg-iblack"
              onChange={handleNewTopicChange}
              onKeyUp={handleNewTopicKeyUp}
              value={newTopic}
            />
            <div className="-mt-3">
              <span className="opacity-50">-----</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Topics;
