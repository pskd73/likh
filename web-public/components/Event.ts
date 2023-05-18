"use client";
import mixpanel from "mixpanel-browser";
import { useEffect } from "react";

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!);

let prod = process.env.NODE_ENV === "production";

let actions = {
  track: (name: string, props?: any) => {
    if (prod) mixpanel.track(name, props);
  },
};

export default function Event({ name, props }: { name: string; props?: any }) {
  useEffect(() => {
    actions.track(name, props);
  }, []);

  return null;
}
