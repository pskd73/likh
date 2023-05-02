import { useContext, useEffect, useState } from "react";
import { Note, Suggestion } from "../../type";
import Clickable from "../Clickable";
import { AppContext } from "../AppContext";
import Event from "../Event";
import useFetch from "../../useFetch";
import { API_HOST } from "../../config";

const Suggestions = () => {
  const {
    setActiveTray,
    topicCollection,
    suggestions,
    setSuggestions,
    user,
  } = useContext(AppContext);
  const newFetch = useFetch<Note>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (newFetch.response) {
      setActiveTray("write");
      Event.track("new_note");
    }
  }, [newFetch.response]);

  const handleWrite = async (suggestion: Suggestion) => {
    newFetch.handle(
      fetch(`${API_HOST}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user!.token}`,
        },
        body: JSON.stringify({
          title: suggestion.title,
          text: `This is an article from ${suggestion.topic} topic.`,
        }),
      })
    );
  };

  const handleRefresh = async () => {
    if (topicCollection) {
      setLoading(true);
      const topicNames = Object.values(topicCollection).map(
        (topic) => topic.title
      );
      const res = await fetch(
        `https://api.retronote.app/suggestions?topics=${topicNames.join(",")}`
      );
      const suggestions: Suggestion[] = await res.json();
      setSuggestions(suggestions);
      setLoading(false);
      Event.track("fetch_suggestions");
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
        <Clickable lite onClick={handleRefresh} disabled={loading}>
          {loading ? "loading" : "refresh"}
        </Clickable>
      </div>
      {!suggestions.length && (
        <div>
          Add the topics you are interested in and refresh to get suggestions to
          write on!
        </div>
      )}
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
