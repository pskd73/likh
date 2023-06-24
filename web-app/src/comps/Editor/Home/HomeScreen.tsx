import { BiSearch, BiX } from "react-icons/bi";
import { BsCursorText } from "react-icons/bs";
import { useContext, useMemo, useState } from "react";
import { EditorContext, NoteSummary } from "../Context";
import LinkSuggestions from "./LinkSuggestions";
import useMemoAsync from "../useMemoAsync";
import classNames from "classnames";
import QuickStart from "./QuickStart";
import Journals from "./Journals";
import Notes from "./Notes";
import { Title } from "./Common";

const HomeScreen = () => {
  const {
    notesToShow,
    note,
    getHashtags,
    getLinkSuggestions,
    setSearchTerm,
    searchTerm,
    storage,
  } = useContext(EditorContext);
  const [seeAll, setSeeAll] = useState(false);
  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);

  const suggestions = useMemoAsync(async () => {
    let links = await getLinkSuggestions();
    links = links.sort((a, b) => b.occurances - a.occurances);
    return links.splice(0, 5);
  }, [storage.notes, note?.id]);

  return (
    <div className="pb-20 flex flex-col items-center">
      <div className="space-y-4 w-full md:w-1/3">
        <div className="text-5xl md:text-center w-full py-4 md:py-20 flex md:justify-center">
          <span>Hello there</span>
          <span className="mt-1">
            <BsCursorText />
          </span>
        </div>
        <div
          className={classNames(
            "flex justify-between items-center text-2xl",
            "border rounded border-primary-700 border-opacity-20",
            "overflow-hidden p-2 px-4 shadow"
          )}
        >
          <input
            type="text"
            placeholder="Search here"
            className={classNames(
              "placeholder-primary-700 placeholder-opacity-60",
              "outline-none bg-base font-semibold w-full"
            )}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <div className="ml-2 opacity-50 flex space-x-2">
            {searchTerm && (
              <BiX
                onClick={() => setSearchTerm("")}
                className="cursor-pointer"
              />
            )}
            <BiSearch />
          </div>
        </div>
        {!searchTerm && !seeAll && <QuickStart />}
        {!searchTerm && !seeAll && Object.keys(hashtags).length > 0 && (
          <Journals />
        )}
        {notesToShow.length > 0 && (
          <Notes seeAll={seeAll} toggleSeeAll={() => setSeeAll((s) => !s)} />
        )}
        {!searchTerm &&
          !seeAll &&
          suggestions &&
          (suggestions.length || 0) > 0 && (
            <div>
              <Title>Your topics</Title>
              <LinkSuggestions suggestions={suggestions} />
            </div>
          )}
      </div>
    </div>
  );
};

export default HomeScreen;
