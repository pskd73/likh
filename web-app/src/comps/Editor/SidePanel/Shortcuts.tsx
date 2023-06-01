import { PropsWithChildren } from "react";
import List from "../List";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardCommandKey,
  MdKeyboardControlKey,
  MdKeyboardOptionKey,
} from "react-icons/md";
import classNames from "classnames";
import Collapsible from "../Collapsible";

const Key = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-center items-center">
      <span
        className={classNames(
          "text-sm font-CourierPrime bg-primary-700 bg-opacity-20 rounded",
          "flex justify-center items-center w-6 h-6"
        )}
      >
        {children}
      </span>
    </div>
  );
};

const DefaultComboKeys = () => {
  return (
    <>
      <Key>
        <MdKeyboardControlKey />
      </Key>
      <Key>
        <MdKeyboardOptionKey />
      </Key>
      <Key>
        <MdKeyboardCommandKey />
      </Key>
    </>
  );
};

const Shortcuts = () => {
  return (
    <div>
      <Collapsible>
        <Collapsible.Item active title="Shortcuts" onToggle={() => {}}>
          <List>
            <List.Item className="flex justify-between hover:bg-none">
              <span>New note</span>
              <div className="flex space-x-1">
                <DefaultComboKeys />
                <span>+</span>
                <Key>N</Key>
              </div>
            </List.Item>
            <List.Item className="flex justify-between hover:bg-none">
              <span>Previous note</span>
              <div className="flex space-x-1">
                <DefaultComboKeys />
                <span>+</span>
                <Key>
                  <MdKeyboardArrowLeft />
                </Key>
              </div>
            </List.Item>
            <List.Item className="flex justify-between hover:bg-none">
              <span>Next note</span>
              <div className="flex space-x-1">
                <DefaultComboKeys />
                <span>+</span>
                <Key>
                  <MdKeyboardArrowRight />
                </Key>
              </div>
            </List.Item>
            <List.Item className="flex justify-between hover:bg-none">
              <span>Save markdown</span>
              <div className="flex space-x-1">
                <DefaultComboKeys />
                <span>+</span>
                <Key>S</Key>
              </div>
            </List.Item>
            <List.Item className="flex justify-between hover:bg-none">
              <span>Open markdown</span>
              <div className="flex space-x-1">
                <DefaultComboKeys />
                <span>+</span>
                <Key>O</Key>
              </div>
            </List.Item>
            <List.Item className="flex justify-between hover:bg-none">
              <span>Explorer</span>
              <div className="flex space-x-1">
                <DefaultComboKeys />
                <span>+</span>
                <Key>L</Key>
              </div>
            </List.Item>
            <List.Item className="flex justify-between hover:bg-none">
              <span>Index</span>
              <div className="flex space-x-1">
                <DefaultComboKeys />
                <span>+</span>
                <Key>I</Key>
              </div>
            </List.Item>
          </List>
        </Collapsible.Item>
      </Collapsible>
    </div>
  );
};

export default Shortcuts;
