import { Link } from "react-router-dom";
import { Header } from "../comps/Typo";
import { BiFilm } from "react-icons/bi";

export const Hashtag = ({ hashtag }: { hashtag: string }) => {
  const hashWord = hashtag.replaceAll("#", "");
  return (
    <div className="flex bg-primary-700 bg-opacity-20 rounded-full">
      <Link
        className="px-3 py-1 rounded-l-full hover:bg-primary-700 hover:bg-opacity-25"
        to={`/notes?hashtag=${hashWord}`}
      >
        {hashtag}
      </Link>
      <Link
        className="px-2 pr-3 py-1 flex justify-center rounded-r-full items-center bg-primary-700 bg-opacity-20 hover:bg-opacity-30"
        to={`/roll?hashtag=${hashWord}`}
      >
        <BiFilm />
      </Link>
    </div>
  );
};

const Hashtags = ({ hashtags }: { hashtags: string[] }) => {
  return (
    <div>
      <Header>Hashtags</Header>
      <ul className="flex gap-2 flex-wrap">
        {hashtags.map((hashtag, i) => (
          <li key={i}>
            <Hashtag hashtag={hashtag} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Hashtags;
