import { Link } from "react-router-dom";
import { Header } from "../comps/Typo";

export const Hashtag = ({ hashtag }: { hashtag: string }) => {
  return (
    <Link
      className="bg-primary-700 bg-opacity-20 rounded-full px-3 py-1 hover:bg-opacity-25"
      to={`/app/notes?hashtag=${hashtag.replaceAll("#", "")}`}
    >
      {hashtag}
    </Link>
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
