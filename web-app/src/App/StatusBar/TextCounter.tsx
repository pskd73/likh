import classNames from "classnames";
import { getNWords } from "src/util";
import Button from "src/comps/Button";
import { useContext } from "react";
import { EditorContext } from "src/App/Context";
import { VscWholeWord } from "react-icons/vsc";
import { BiTimeFive } from "react-icons/bi";
import Tooltip from "src/comps/Tooltip";

const READ_WORDS_PER_MIN = 245;

const Count = ({ text }: { text: string }) => {
  const { countStatType, setCountStatType } = useContext(EditorContext);

  const words = getNWords(text);
  const readTime = (words * 60) / READ_WORDS_PER_MIN;

  const pad = (n: number) => {
    return Math.abs(n) < 10 ? `0${n}` : String(n);
  };

  if (countStatType === "words") {
    return <span>{words}</span>;
  }
  if (countStatType === "readTime") {
    return (
      <span>
        {pad(Math.floor(readTime / 60))}:{pad(Math.ceil(readTime % 60))}
      </span>
    );
  }
  return <span />;
};

const TextCounter = ({ text }: { text: string }) => {
  const { countStatType, setCountStatType } = useContext(EditorContext);
  return (
    <Tooltip tip={countStatType === "words" ? "Word count" : "Read time"}>
      <Button
        lite
        className={classNames(
          "flex items-center space-x-2 justify-center rounded-none"
        )}
        onClick={() =>
          setCountStatType((old) => (old === "words" ? "readTime" : "words"))
        }
      >
        {countStatType === "words" ? <VscWholeWord /> : <BiTimeFive />}{" "}
        <span className="text-xs">
          <Count text={text} />
        </span>
      </Button>
    </Tooltip>
  );
};

export default TextCounter;
