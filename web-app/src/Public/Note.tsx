import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { Note } from "../type.d";
import { useEffect } from "react";
import { API_HOST } from "../config";
import Clickable from "../components/Clickable";
import Event from "../components/Event";

const PublicNote = () => {
  const { noteId } = useParams();
  const noteApi = useFetch<{ note: Note; user: { email: string } }>();

  useEffect(() => {
    Event.track("public_note", { note_id: noteId });
    noteApi.handle(fetch(`${API_HOST}/public/note?note_id=${noteId}`));
  }, []);

  return (
    <div className="font-SpecialElite flex justify-center">
      <div className="w-full max-w-[900px]">
        <div className="min-h-[90vh] p-4 flex flex-col">
          {noteApi.hits < 1 && (
            <div className="w-full h-full flex justify-center items-center flex-1">
              loading
            </div>
          )}
          {noteApi.response && (
            <div>
              <div className="mb-4">
                <h1 className="text-4xl">{noteApi.response.note.title}</h1>
                <span className="opacity-50">
                  By {noteApi.response.user.email} @{" "}
                  {new Date(noteApi.response.note.created_at).toDateString()}
                </span>
              </div>
              <p className="text-lg whitespace-pre-wrap">
                {noteApi.response.note.text}
              </p>
            </div>
          )}
          {noteApi.rawResponse?.status !== 200 && (
            <div className="w-full h-full flex justify-center items-center flex-1">
              Note does not exist! Start writing&nbsp;
              <Clickable className="underline">
                <a href="/">here</a>
              </Clickable>
            </div>
          )}
        </div>
        <div className="w-full h-[10vh] text-center p-6">
          <span className="opacity-50">Powered by&nbsp;</span>
          <Clickable lite>
            <a href="/" target="/">
              Retro Note
            </a>
          </Clickable>
          <span className="opacity-50">&nbsp;& built by &nbsp;</span>
          <Clickable lite>
            <a href="https://twitter.com/pramodk73" target="_blank">
              @pramodk73
            </a>
          </Clickable>
        </div>
      </div>
    </div>
  );
};

export default PublicNote;
