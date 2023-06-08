import { useEffect, useState } from "react";
import Clickable from "./components/Clickable";
import { supabase, useSupabase } from "./components/supabase";
import { Paper } from "./comps/Layout";
import { Input } from "./comps/Form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import classNames from "classnames";
import Event from "./components/Event";

const steps = [
  "Add topics you are interested in",
  "Add the daily calendar event",
  "Pick a Retro Note suggested topic to write about. Repeat it daily!",
];

const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [mailSent, setMailSent] = useState(false);

  useSupabase({
    setUser: (user) => {
      if (user) {
        navigate("/", { replace: true });
      }
    },
  });

  useEffect(() => {
    Event.track("landing_page");
  }, []);

  const handleSubmit = async () => {
    if (email) {
      setLoading(true);
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "https://app.retronote.app",
        },
      });
      setEmail("");
      setLoading(false);
      setMailSent(true);
    }
  };

  return (
    <div className="font-Inter min-h-[100vh] w-full bg-base">
      <Helmet>
        <title>Retro Note - Build daily writing habit</title>
      </Helmet>
      <Paper>
        <div className="p-4 md:py-6 space-y-20">
          <div className="space-y-6">
            <div>
              <h1 className="text-6xl mb-4 font-CourierPrime">
                Build writing habits!
              </h1>
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
              <p className="mb-2">
                Sing up now and start building writing habit by
              </p>
              <ul>
                {steps.map((step, i) => (
                  <li key={i} className="flex">
                    <div className="w-6">{i + 1}.</div>
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
                  Go &rarr;
                </Clickable>
              </div>
              <div className="mt-1 text-sm">
                <span
                  className={classNames("opacity-50", { hidden: mailSent })}
                >
                  No, we don't spam!
                </span>
                <span className={classNames({ hidden: !mailSent })}>
                  Sent! Check your inbox
                </span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-CourierPrime mb-4">How it works?</h2>
            <video width="900px" controls>
              <source
                src="https://gfbrmxfdddmpwlqtvwsh.supabase.co/storage/v1/object/sign/public/Start%20building%20writing%20habits%20with%20Retro%20Note.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwdWJsaWMvU3RhcnQgYnVpbGRpbmcgd3JpdGluZyBoYWJpdHMgd2l0aCBSZXRybyBOb3RlLm1wNCIsImlhdCI6MTY4Mzk2NDMzOSwiZXhwIjoxNzE1NTAwMzM5fQ.xt3-zNNkob4xk0YyPzgwSRxRjYnXk4r6vlAipWzQR44&t=2023-05-13T07%3A52%3A21.952Z"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <div>
            <span className="opacity-50">
              Built from the &lt;3 of writing by{" "}
            </span>
            <Clickable lite>
              <a
                href="https://twitter.com/@pramodk73"
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                @pramodk73
              </a>
            </Clickable>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Landing;
