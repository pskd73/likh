import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useContext,
  useMemo,
  useState,
} from "react";
import { AppContext } from "../components/AppContext";
import Clickable from "../components/Clickable";

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
      <h3 className="text-lg mb-1">Interested topics</h3>
      <ul className="space-y-3">
        {topics.map((topic, i) => (
          <li className="flex" key={i}>
            <div className="pr-2">{i + 1}.</div>
            <div>
              <div>{topic.title}</div>
              <Clickable
                lite
                onClick={() => handleDeleteTopic(topic.title)}
                className="text-sm"
              >
                delete
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
              className="outline-none p-1 bg-primary-700 rounded bg-opacity-30 placeholder-primary-700"
              onChange={handleNewTopicChange}
              onKeyUp={handleNewTopicKeyUp}
              value={newTopic}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Topics;
