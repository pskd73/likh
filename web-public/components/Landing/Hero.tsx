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

FeatureItem.Text = function Text({ children }: PropsWithChildren) {
  return <div className="text-center h-1/2">{children}</div>;
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
          <FeatureItem.Text>Full markdown support for styling</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiHash />
          </FeatureItem.Icon>
          <FeatureItem.Text>Organise notes by hashtags</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiSearch />
          </FeatureItem.Icon>
          <FeatureItem.Text>Easy search across notes</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiRightArrow />
          </FeatureItem.Icon>
          <FeatureItem.Text>Chronological journaling</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiSpreadsheet />
          </FeatureItem.Icon>
          <FeatureItem.Text>Easy outline of the note</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiImages />
          </FeatureItem.Icon>
          <FeatureItem.Text>Drag and drop images</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiCodeAlt />
          </FeatureItem.Icon>
          <FeatureItem.Text>
            Code blocks with syntax highlighting
          </FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiShapePolygon />
          </FeatureItem.Icon>
          <FeatureItem.Text>Link notes to build a brain dump</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <TbZip />
          </FeatureItem.Icon>
          <FeatureItem.Text>Quick export. No lock in</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiCalendar />
          </FeatureItem.Icon>
          <FeatureItem.Text>
            Calendar view for quick navigation
          </FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiBriefcase />
          </FeatureItem.Icon>
          <FeatureItem.Text>Local only. Full privacy</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BsKeyboard />
          </FeatureItem.Icon>
          <FeatureItem.Text>All actions by keyboard shortcuts</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiAlarm />
          </FeatureItem.Icon>
          <FeatureItem.Text>Reminders to follow up sessions</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Icon>
            <BiBrush />
          </FeatureItem.Icon>
          <FeatureItem.Text>Themes for all sort of tastes</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Soon />
          <FeatureItem.Icon>
            <BiShareAlt />
          </FeatureItem.Icon>
          <FeatureItem.Text>Quick sharing privately</FeatureItem.Text>
        </FeatureItem>
      </li>
      <li>
        <FeatureItem>
          <FeatureItem.Soon />
          <FeatureItem.Icon>
            <BiDevices />
          </FeatureItem.Icon>
          <FeatureItem.Text>Sync multi device seamlessly</FeatureItem.Text>
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
        <img src="/one.png" className={"shadow-2xl rounded-lg w-full"} />
      </div>
    </div>
  );
}
