import { BiBulb, BiX } from "react-icons/bi";
import classNames from "classnames";
import { PropsWithChildren, ReactElement, useMemo } from "react";
import Button from "src/comps/Button";
import Event from "src/components/Event";

const Card = ({
  icon,
  title,
  children,
  onClose,
}: PropsWithChildren & {
  icon: ReactElement;
  title: string;
  onClose: () => void;
}) => {
  return (
    <div
      className={classNames(
        "bg-primary bg-opacity-5 rounded-xl p-4",
        "border-primary border-opacity-10"
      )}
    >
      <div
        className={classNames(
          "flex items-center font-bold justify-between",
          "text-primary text-opacity-50"
        )}
      >
        <div className="flex space-x-2 items-center">
          {icon}
          <span>{title}</span>
        </div>
        <div>
          <Button className="rounded-full" onClick={onClose}>
            <BiX />
          </Button>
        </div>
      </div>
      <div className="text-sm mt-1">{children}</div>
    </div>
  );
};

const cards: Record<
  string,
  { icon: ReactElement; title: string; content: ReactElement }
> = {
  intro: {
    icon: <BiBulb />,
    title: "Welcome!",
    content: (
      <p>
        It is a place where you can write your mind. You can write your
        research, dairies, project notes, todos, and more.
      </p>
    ),
  },
  notes: {
    icon: <BiBulb />,
    title: "Notes!",
    content: (
      <p>
        Everything is a note here. Just click <strong>New note</strong> and
        write what you want.
      </p>
    ),
  },
  markdown: {
    icon: <BiBulb />,
    title: "Markdown",
    content: (
      <p>
        You can make full use of markdown to style your document for example
        titles, bold, lists, images, links etc.
      </p>
    ),
  },
  organize: {
    icon: <BiBulb />,
    title: "Organize",
    content: (
      <p>
        Organize your notes by <strong>hashtags</strong>. You can even use{" "}
        <strong>slash/</strong> to create nested folders.
      </p>
    ),
  },
  search: {
    icon: <BiBulb />,
    title: "Search",
    content: <p>Search your notes quickly with highlights.</p>,
  },
  outline: {
    icon: <BiBulb />,
    title: "Outline",
    content: (
      <p>
        Writing long form content or research? You can open the outline menu to
        keep track of the structure of the note at high level!
      </p>
    ),
  },
  images: {
    icon: <BiBulb />,
    title: "Images",
    content: (
      <p>You can insert images just by copy and paste or drag and drop!</p>
    ),
  },
  codeBlocks: {
    icon: <BiBulb />,
    title: "Code blocks",
    content: (
      <p>
        You can insert code blocks out of the box with syntax highlighting for
        all major programming languages
      </p>
    ),
  },
  notLinks: {
    icon: <BiBulb />,
    title: "Link notes",
    content: (
      <p>
        Thoughts are always interconnected. You can link one note from other
        just by typing <strong>[[</strong>
      </p>
    ),
  },
  save: {
    icon: <BiBulb />,
    title: "Save",
    content: (
      <p>
        You can quickly save your notes in <strong>.md</strong> (markdown)
        format using bottom left save button. No lock-in!
      </p>
    ),
  },
  themes: {
    icon: <BiBulb />,
    title: "Themes",
    content: (
      <p>
        There are four themes available for your choise including the dark mode!
        Separately, chose your style of fonts for your notes!
      </p>
    ),
  },
  e2eEncryption: {
    icon: <BiBulb />,
    title: "E2E encryption",
    content: (
      <p>
        All your notes are stored on your device and fully end to end encrypted
        which means no one has access to your notes!
      </p>
    ),
  },
  slash: {
    icon: <BiBulb />,
    title: 'Slash - "/" all',
    content: (
      <p>
        Just hit "/" while writing the note to get all the suggestions like
        Headings, Lists, Timestamps, Checkboxes, etc. and hit Enter!
      </p>
    ),
  },
};

const WhatsNew = ({
  viewed,
  setViewed,
}: {
  viewed: string[];
  setViewed: (viewed: string[]) => void;
}) => {
  const cardToShow = useMemo(() => {
    const key = Object.keys(cards).filter((key) => !viewed.includes(key))[0];
    return { key, card: cards[key] };
  }, [viewed]);

  const handleClose = (key: string) => {
    Event.track("close_whats_new", { key });
    if (!viewed.includes(key)) {
      setViewed([...viewed, key]);
    }
  };

  return (
    cardToShow.card && (
      <div className="relative">
        <Card
          icon={cardToShow.card.icon}
          title={cardToShow.card.title}
          onClose={() => handleClose(cardToShow.key)}
        >
          {cardToShow.card.content}
        </Card>
      </div>
    )
  );
};

export default WhatsNew;
