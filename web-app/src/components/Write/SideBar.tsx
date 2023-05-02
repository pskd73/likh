import * as React from "react";
import MyNotes from "./MyNotes";
import Select from "../Select";
import Clickable from "../Clickable";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { twMerge } from "tailwind-merge";
import useFetch from "../../useFetch";
import { API_HOST } from "../../config";
import { Note } from "../../type";

function copy(text: string) {
  var input = document.createElement("textarea");
  input.innerHTML = text;
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand("copy");
  document.body.removeChild(input);
  return result;
}

const Label = ({
  children,
  className,
  ...restProps
}: React.ComponentProps<"div">) => {
  return (
    <div className={twMerge(className, "w-44 underline")} {...restProps}>
      {children}
    </div>
  );
};

const Item = ({ children }: React.PropsWithChildren) => {
  return <li className="flex">{children}</li>;
};

const SideBar = () => {
  const { note, user, notes, setNote, setNotes } = useContext(AppContext);
  const visibilityApi = useFetch<Note>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visibilityApi.response) {
      setNote(visibilityApi.response);
      setNotes({
        ...notes,
        [visibilityApi.response.id]: visibilityApi.response,
      });
    }
  }, [visibilityApi.response]);

  const handleVisibilityChange = (visibility: string) => {
    visibilityApi.handle(
      fetch(`${API_HOST}/note/visibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user!.token}`,
        },
        body: JSON.stringify({
          note_id: note!.id,
          visibility,
        }),
      })
    );
  };

  const handleCopy = () => {
    copy(`https://retronote.app/note/${note!.id}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return note ? (
    <div className="max-h-[90vh] overflow-y-scroll scrollbar-hide p-4 space-y-6">
      <div>
        <ul className="space-y-2">
          <Item>
            <Label>Visibility</Label>
            <div>
              <Select
                value={note.visibility}
                onValueChange={handleVisibilityChange}
              >
                <Select.Option value={"private"}>private</Select.Option>
                <Select.Option value={"public"}>public</Select.Option>
              </Select>
            </div>
          </Item>
          {note.visibility === "public" && (
            <Item>
              <Label>Link</Label>
              <div>
                <Clickable lite onClick={handleCopy}>
                  {copied ? <span>copied!</span> : <span>copy &rarr;</span>}
                </Clickable>
              </div>
            </Item>
          )}
        </ul>
      </div>
      <MyNotes />
    </div>
  ) : null;
};

export default SideBar;
