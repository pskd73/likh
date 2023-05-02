import * as React from "react";
import MyNotes from "./MyNotes";
import Select from "../Select";
import Clickable from "../Clickable";
import { useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import { twMerge } from "tailwind-merge";
import useFetch from "../../useFetch";
import { API_HOST } from "../../config";
import { Note } from "../../type";

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

  return note ? (
    <div className="max-h-[90vh] overflow-y-scroll scrollbar-hide p-4 space-y-6">
      <div>
        <ul>
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
                <Clickable lite>copy &rarr;</Clickable>
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
