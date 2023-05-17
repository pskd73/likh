"use client";
import classNames from "classnames";
import { Courier } from "../font";
import { useState } from "react";
import { supabase } from "./Auth";

export default function SginIn() {
  const [email, setEmail] = useState("");
  const [mailSent, setMailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_AUTH_REDIRECT,
      },
    });
    setMailSent(true);
    setEmail("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={classNames(
          Courier.className,
          "bg-primary-700 h-[46px] md:h-[62px] rounded-full flex items-center p-1 italic md:text-2xl"
        )}
      >
        <div className="bg-white flex-1 h-full rounded-l-full flex items-center justify-center px-4 outline-none">
          <input
            type="text"
            className="italic outline-none"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          className={classNames("text-white italic px-2 md:px-6", {
            "text-primary-700 text-opacity-80": loading,
          })}
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          write &rarr;
        </button>
      </div>
      {mailSent && (
        <span className="opacity-50">
          Login link sent. Please check your inbox!
        </span>
      )}
      <a
        href={process.env.NEXT_PUBLIC_WRITE_URL}
        className={classNames(
          Courier.className,
          "italic md:text-xl opacity-50 underline"
        )}
      >
        try writing
      </a>
    </div>
  );
}
