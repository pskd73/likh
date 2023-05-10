import { useEffect, useState } from "react";
import Clickable from "./components/Clickable";
import { supabase, useSupabase } from "./components/supabase";
import { Paper } from "./comps/Layout";
import { Input } from "./comps/Form";
import { useAppContext } from "./components/AppContext";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

const steps = [
  "Add topics you are interested in",
  "Add the daily calendar event",
  "Pick a Retro Notensuggested topic to write about. Repeat it daily!",
];

const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [mailSent, setMailSent] = useState(false);

  useSupabase({
    setUser: (user) => {
      if (user) {
        navigate("/app", { replace: true });
      }
    },
  });

  const handleSubmit = async () => {
    if (email) {
      setLoading(true);
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "https://retronote.app",
        },
      });
      setEmail("");
      setLoading(false);
      setMailSent(true);
    }
  };

  return (
    <div className="font-Inter min-h-[100vh] w-full bg-base">
      <Paper>
        <div className="p-4 min-h-[100vh] flex justify-center items-center">
          <div className="max-w-[900px] space-y-10">
            <div>
              <h1 className="text-5xl mb-4">Build writing habits</h1>
              <p className="leading-normal">
                Writing is a way to{" "}
                <span className="underline">articulate thoughts</span>. Don't
                let AI trick you! Start building{" "}
                <span className="underline">writing habits</span> in a{" "}
                <span className="underline">distraction free, focused</span>{" "}
                environment.
              </p>
            </div>
            <div>
              <p className="mb-2">Just follow below steps</p>
              <ul>
                {steps.map((step, i) => (
                  <li key={i} className="flex">
                    <div className="mr-2">{i + 1}.</div>
                    <div>{step}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Enter email"
                  className="outline-none mr-4"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMailSent(false);
                  }}
                  disabled={loading}
                />
                <Clickable onClick={handleSubmit} disabled={loading}>
                  login &rarr;
                </Clickable>
              </div>
              {
                <div className={classNames("mt-1", { invisible: !mailSent })}>
                  Sent! Check your inbox
                </div>
              }
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Landing;
