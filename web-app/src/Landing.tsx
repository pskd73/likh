import { useState } from "react";
import Clickable from "./components/Clickable";
import { supabase } from "./components/supabase";

const steps = [
  "Add topics you are interested in",
  "Add the daily calendar event",
  "Pick a Retro Notensuggested topic to write about. Repeat it daily!",
];

const Landing = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [mailSent, setMailSent] = useState(false);

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
    <div className="text-slate-700 font-SpecialElite min-h-[100vh] w-full">
      <div className="p-4 min-h-[100vh] text-slate-700 dark:bg-iblack dark:text-iwhite flex justify-center text-lg">
        <div className="max-w-[900px] space-y-10">
          <div>
            <h1 className="text-5xl mb-4">Build writing habits</h1>
            <p className="leading-normal">
              Writing is a way to{" "}
              <span className="underline">articulate thoughts</span>. Don't let
              AI trick you! Start building{" "}
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
            <div className="relative">
              <input
                type="text"
                placeholder="Enter email"
                className="outline-none py-1 mr-4"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMailSent(false);
                }}
                disabled={loading}
              />
              <span className="absolute left-0 -bottom-4">
                -----------------
              </span>
              <Clickable onClick={handleSubmit} disabled={loading}>
                login &rarr;
              </Clickable>
            </div>
            {mailSent && <div className="mt-2">Sent! Check your inbox</div>}
            {/* <div>
              <Clickable lite>
                <a href="/app">try it</a>
              </Clickable>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
