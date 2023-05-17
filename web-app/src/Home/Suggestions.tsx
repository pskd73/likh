import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { Note, Suggestion } from "../type";
import Clickable from "../components/Clickable";
import { AppContext } from "../components/AppContext";
import Event from "../components/Event";
import useFetch from "../useFetch";
import { API_HOST } from "../config";
import { useNavigate } from "react-router-dom";
import { Header } from "../comps/Typo";

const Suggestions = () => {
  const { topicCollection, suggestions, setSuggestions, user } =
    useContext(AppContext);
  const newFetch = useFetch<Note>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (newFetch.response) {
      Event.track("new_note");
      navigate(`/write/${newFetch.response.id}`);
    }
  }, [newFetch.response]);

  const handleWrite = async (suggestion: Suggestion) => {
    const topicHashtag = suggestion.topic.toLowerCase().replaceAll(" ", "_");
    newFetch.handle(
      fetch(`${API_HOST}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user!.token}`,
        },
        body: JSON.stringify({
          title: "",
          text: `# ${suggestion.title}\nThis is an article from ${suggestion.topic} topic.\n\n#${topicHashtag}`,
        }),
      })
    );
  };

  const handleRefresh = async () => {
    if (topicCollection) {
      setLoading(true);
      let topicNames = Object.values(topicCollection).map(
        (topic) => topic.title
      );
      if (!topicNames.length) {
        topicNames = [
          "Writing",
          "Humanity",
          "Space exploration",
          "Personality development",
          "Global warming",
        ];
      }
      const res = await fetch(
        `${API_HOST}/suggestions?topics=${topicNames.join(",")}`
      );
      const suggestions: Suggestion[] = await res.json();
      setSuggestions(suggestions);
      setLoading(false);
      Event.track("fetch_suggestions");
    }
  };

  return (
    <div>
      <div className="flex space-x-2 mb-3 items-center">
        <Header className="mb-0">Write about</Header>
        <Clickable lite onClick={handleRefresh} disabled={loading}>
          [{loading ? "loading" : "refresh"}]
        </Clickable>
      </div>
      {!suggestions.length && (
        <div>
          Add the topics you are interested in and refresh to get suggestions to
          write on!
        </div>
      )}
      <ul className="space-y-6">
        {suggestions.map((suggestion, i) => (
          <li key={i} className="flex">
            <div className="w-6">{i + 1}.</div>
            <div>
              <div>{suggestion.title}</div>
              <div className="text-sm">
                <span className="opacity-50">{suggestion.topic} •&nbsp;</span>
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
