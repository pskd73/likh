import mixpanel from "mixpanel-browser";

mixpanel.init("636dcfc140621d079b6da334d676bd23");

let prod = process.env.NODE_ENV === "production";

let actions = {
  track: (name: string, props?: any) => {
    if (prod) mixpanel.track(name, props);
  },
};

export default actions;
