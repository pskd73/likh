import { useContext } from "react";
import { Suggestion } from "../../type";
import Clickable from "../Clickable";
import { AppContext } from "../AppContext";
import { getNextId } from "../localStorage";

// const suggestions: Suggestion[] = [
//   {
//     title: "Functions in Python",
//     createdAt: new Date().getTime(),
//     topicName: "Python Programming",
//   },
//   {
//     title: "The Concept of Free Will in Philosophy",
//     createdAt: new Date().getTime(),
//     topicName: "Philosophy",
//   },
//   {
//     title: "Agile Product Development Methodology",
//     createdAt: new Date().getTime(),
//     topicName: "Product Development",
//   },
//   {
//     title: "Racial and Social Inequality in America",
//     createdAt: new Date().getTime(),
//     topicName: "Social Problems",
//   },
//   {
//     title: "Cloud Computing and SaaS",
//     createdAt: new Date().getTime(),
//     topicName: "SaaS",
//   },
//   {
//     title: "Benefits of Building in Public",
//     createdAt: new Date().getTime(),
//     topicName: "Build in Public",
//   },
// ];

const Suggestions = () => {
  const {
    saveNote,
    setActiveTray,
    topicCollection,
    suggestions,
    setSuggestions,
  } = useContext(AppContext);

  const handleWrite = (suggestion: Suggestion) => {
    saveNote({
      id: getNextId("note"),
      title: suggestion.title,
      text: `This is an article from ${suggestion.topic} topic.`,
      createdAt: new Date().getTime(),
      hashtags: [],
    });
    setActiveTray("write");
  };

  const handleRefresh = async () => {
    if (topicCollection) {
      const topicNames = Object.values(topicCollection).map(
        (topic) => topic.title
      );
      const res = await fetch(
        `https://api.retronote.app/suggestions?topics=${topicNames.join(",")}`
      );
      const suggestions: Suggestion[] = await res.json();
      setSuggestions(suggestions);
    }
  };

  return (
    <div>
      <div className="flex space-x-5">
        <div>
          Suggestions
          <br />
          ~~~~~~~~~~~
        </div>
        <Clickable lite>
          <span onClick={handleRefresh}>refresh</span>
        </Clickable>
      </div>
      <ul className="space-y-2">
        {suggestions.map((suggestion, i) => (
          <li key={i} className="flex">
            <div className="mr-1">{i + 1}.</div>
            <div>
              <div>
                {suggestion.title}{" "}
                <span className="opacity-20">[{suggestion.topic}]</span>
              </div>
              <div>
                <Clickable lite>
                  <span onClick={() => handleWrite(suggestion)}>write</span>
                </Clickable>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
