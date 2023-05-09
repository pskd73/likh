import { ComponentProps, PropsWithChildren, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useSupabase } from "../components/supabase";
import { useNavigate } from "react-router-dom";

export const Paper = ({
  children,
  className,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div
      className={twMerge("flex justify-center text-primary-700", className)}
      {...restProps}
    >
      <div className="w-[860px] p-4 md:p-0">{children}</div>
    </div>
  );
};

export const NoMobile = ({ children }: PropsWithChildren) => {
  if (window.innerWidth < 860) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center text-center">
        Not supported on this device! Log in from PC/Mac
      </div>
    );
  }
  return <>{children}</>;
};

export const Private = ({ children }: PropsWithChildren) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useSupabase({
    setUser: (user) => {
      if (!user) {
        navigate("/");
      } else {
        setLoggedIn(true);
      }
    },
  });

  return loggedIn ? <>{children}</> : null;
};
