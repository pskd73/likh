import { useContext, useMemo } from "react";
import List from "../List";
import { ListContainer, Title } from "./Common";
import { EditorContext, NoteSummary } from "../Context";
import { BiHash, BiSearch } from "react-icons/bi";
import Button from "../../Button";

const Journals = () => {
  const { notesToShow, note, getHashtags, setRollHashTag, setSearchTerm } =
    useContext(EditorContext);
  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);

  return (
    <div>
      <Title>Journals</Title>
      <ListContainer>
        {Object.keys(hashtags).map((hashtag, i) => (
          <List.Item
            key={i}
            withIcon
            onClick={() => setRollHashTag(hashtag)}
            className="last:mb-0"
          >
            <List.Item.Icon>
              <BiHash />
            </List.Item.Icon>
            <div className="flex items-center space-x-1">
              <span>{hashtag.replaceAll("#", "")}</span>
              <Button
                lite
                className="hover:bg-opacity-30"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSearchTerm(hashtag);
                }}
              >
                <BiSearch />
              </Button>
            </div>
          </List.Item>
        ))}
      </ListContainer>
    </div>
  );
};

export default Journals;
