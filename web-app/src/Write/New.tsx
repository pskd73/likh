import { useContext, useEffect } from "react";
import useFetch from "../useFetch";
import { Note } from "../type";
import { API_HOST } from "../config";
import { AppContext } from "../components/AppContext";
import { useNavigate } from "react-router-dom";

const New = () => {
  const { user } = useContext(AppContext);
  const api = useFetch<Note>();
  const navigate = useNavigate();

  useEffect(() => {
    if (api.response) {
      navigate(`/v2/write/${api.response.id}`, { replace: true });
    }
  }, [api.response]);

  useEffect(() => {
    if (user) {
      api.handle(
        fetch(`${API_HOST}/note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: `My note - ${new Date().toLocaleString()}`,
            text: "Write here ...",
          }),
        })
      );
    }
  }, [user]);

  return null;
};

export default New;
