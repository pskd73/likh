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
import { Header } from "../comps/Typo";

const Topics = () => {
  const { addTopic, topicCollection, deleteTopic } = useContext(AppContext);
  const [newTopic, setNewTopic] = useState("");
  const [showNew, setShowNew] = useState(false);
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
      setShowNew(false);
    }
  };

  const handleDeleteTopic = (name: string) => {
    deleteTopic(name);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Header>Interested topics</Header>
        <Clickable onClick={() => setShowNew((n) => !n)}>
          {showNew ? "[-]" : "[+]"}
        </Clickable>
      </div>
      <ul className="space-y-3">
        {showNew && (
          <li>
            <Input
              type="text"
              className="w-10/12"
              placeholder="Enter the topic"
              onChange={handleNewTopicChange}
              onKeyUp={handleNewTopicKeyUp}
              value={newTopic}
            />
          </li>
        )}

        {topics.map((topic, i) => (
          <li className="flex" key={i}>
            <div className="w-6">{i + 1}.</div>
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
      </ul>
    </div>
  );
};

export default Topics;
