import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useContext,
  useMemo,
  useState,
} from "react";
import { AppContext } from "../components/AppContext";
import Clickable from "../components/Clickable";
import { Input } from "../comps/Form";

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
              <div className="text-sm">
                <Clickable lite onClick={() => handleDeleteTopic(topic.title)}>
                  delete
                </Clickable>
              </div>
            </div>
          </li>
        ))}
        <li className="flex">
          <div className="pr-2">{topics.length + 1}.</div>
          <div>
            <Input
              type="text"
              placeholder="Add topic"
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
