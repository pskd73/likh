import classNames from "classnames";
import { ComponentProps, PropsWithChildren } from "react";
import { Courier } from "../font";
import { SiMarkdown } from "react-icons/si";
import {
  BiAlarm,
  BiBriefcase,
  BiBrush,
  BiCalendar,
  BiCodeAlt,
  BiDevices,
  BiHash,
  BiImages,
  BiRightArrow,
  BiSearch,
  BiShapePolygon,
  BiShareAlt,
  BiSpreadsheet,
} from "react-icons/bi";
import { TbZip } from "react-icons/tb";
import { BsKeyboard } from "react-icons/bs";

export function Highlight({ children }: PropsWithChildren) {
  return (
    <span
      className={classNames(Courier.className)}
      style={{ fontStyle: "italic" }}
    >
      {children}
    </span>
  );
}

function FeatureItem({ children }: ComponentProps<"li">) {
  return (
    <div
      className={classNames(
        "p-4 border border-primary-700 border-opacity-30 rounded-lg",
        "flex flex-col justify-center bg-white",
        "w-44 h-44 relative"
      )}
    >
      {children}
    </div>
  );
}

FeatureItem.Icon = function Icon({ children }: PropsWithChildren) {
  return (
    <div className="text-5xl flex justify-center items-center h-1/2">
      {children}
    </div>
  );
};

FeatureItem.Body = function Body({ children }: PropsWithChildren) {
  return <p className="text-center h-1/2">{children}</p>;
};

FeatureItem.Title = function Title({ children }: PropsWithChildren) {
  return <h2 className="text-center font-semibold">{children}</h2>;
};

FeatureItem.Description = function Description({
  children,
}: PropsWithChildren) {
  return <div className="text-center h-1/2 text-xs py-1 opacity-70">{children}</div>;
};

FeatureItem.Soon = function Soon() {
  return (
    <span
      className={classNames(
        "bg-primary-700 px-1 rounded-full text-xs text-white",
        "absolute top-4 right-4"
      )}
    >
      Soon
    </span>
  );
};

function AllFeatures() {
  return (
    <>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <SiMarkdown />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Markdown</FeatureItem.Title>
            <FeatureItem.Description>
              Decorate your notes with full markdown support
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiHash />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Organise</FeatureItem.Title>
            <FeatureItem.Description>
              Categorise and group your notes by hashtags
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiSearch />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Search</FeatureItem.Title>
            <FeatureItem.Description>
              Quickly search what you want across the notes
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiRightArrow />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Journaling</FeatureItem.Title>
            <FeatureItem.Description>
              Write your dairies or any chronological notes
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiSpreadsheet />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Outline</FeatureItem.Title>
            <FeatureItem.Description>
              Always have an highlevel structure of your note
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiImages />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Images</FeatureItem.Title>
            <FeatureItem.Description>
              Drag and drop images from your system
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiCodeAlt />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Code blocks</FeatureItem.Title>
            <FeatureItem.Description>
              Write down the code inside note with syntax highlighting
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiShapePolygon />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Linked notes</FeatureItem.Title>
            <FeatureItem.Description>
              Embed notes in another note to create the connections
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <TbZip />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Export</FeatureItem.Title>
            <FeatureItem.Description>
              Quickly export all of your notes. No lock in
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiCalendar />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Calendar</FeatureItem.Title>
            <FeatureItem.Description>
              Navigate through the time with a calendar view
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiBriefcase />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Local first</FeatureItem.Title>
            <FeatureItem.Description>
              Your data stays on your device. Full privacy
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BsKeyboard />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Shortcuts</FeatureItem.Title>
            <FeatureItem.Description>
              Use shortcuts for all actions. Fingers on keys alway
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiAlarm />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Reminders</FeatureItem.Title>
            <FeatureItem.Description>
              Keep track of your future plans by setting reminders
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiBrush />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Themes</FeatureItem.Title>
            <FeatureItem.Description>
              Change look and feel that matches your taste
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Soon />
          <FeatureItem.Icon>
            <BiShareAlt />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Share</FeatureItem.Title>
            <FeatureItem.Description>
              Share your notes to your friends privately
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiDevices />
          </FeatureItem.Icon>
          <FeatureItem.Body>
            <FeatureItem.Title>Multi-device</FeatureItem.Title>
            <FeatureItem.Description>
              Switch between mobile and system to continue your work
            </FeatureItem.Description>
          </FeatureItem.Body>
        </FeatureItem>
      </li>
    </>
  );
}

export default function Hero() {
  return (
    <div className="flex justify-center flex-col items-center">
      <div className="text-lg text-center px-6 md:px-0">
        A simple, powerful, minimalistic, markdown based note taking and
        journaling app all that you need!
      </div>
      <h1
        className={classNames(
          Courier.className,
          "text-3xl md:text-5xl font-bold mt-10 mb-6"
        )}
      >
        Retro Note
      </h1>
      <a
        href="https://app.retronote.app/write"
        className={classNames(
          Courier.className,
          "bg-primary-700 text-white italic px-6 py-2 rounded-full text-3xl"
        )}
      >
        Start writing &rarr;
      </a>

      <div className="relative flex mt-10 w-full md:w-3/4 py-4 overflow-hidden">
        <ul id="marquee" className="flex flex-wrap justify-center gap-4">
          <AllFeatures />
        </ul>
      </div>

      <div className="flex flex-col items-center space-y-10 max-w-[900px] mt-16 px-6 md:px-0">
        <img src="/one.png" className={"shadow-2xl rounded-lg w-full"} alt="A sample note on Retro Note" />
      </div>
    </div>
  );
}
