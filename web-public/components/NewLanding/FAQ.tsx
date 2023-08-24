import classNames from "classnames";
import { ComponentProps, PropsWithChildren, useState } from "react";
import { BiChevronDown } from "react-icons/bi";

const FAQContainer = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={classNames(
        "w-full",
        "border-4 border-primary-700 border-opacity-10",
        "rounded-2xl group overflow-hidden"
      )}
    >
      {children}
    </div>
  );
};

const Question = ({ children, ...restProps }: ComponentProps<"div">) => {
  return (
    <div
      className={classNames(
        "text-xl font-semibold flex justify-between items-center",
        "p-4 bg-primary-700 bg-opacity-5 hover:bg-opacity-10",
        "transition-all cursor-pointer"
      )}
      {...restProps}
    >
      <span>{children}</span>
      <span>
        <BiChevronDown />
      </span>
    </div>
  );
};

const Answer = ({
  children,
  active,
}: PropsWithChildren & { active: boolean }) => {
  return (
    <div
      className={classNames(
        "transition-all",
        "border-t border-primary-700 border-opacity-10",
        {
          "max-h-[1000px]": active,
          "max-h-0": !active,
        }
      )}
    >
      <div className="p-4">{children}</div>
    </div>
  );
};

const FAQ = ({ question, answer }: { question: string; answer: string }) => {
  const [active, setActive] = useState(false);

  return (
    <FAQContainer>
      <Question onClick={() => setActive((a) => !a)}>{question}</Question>
      <Answer active={active}>{answer}</Answer>
    </FAQContainer>
  );
};

export default FAQ;
