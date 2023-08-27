import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./prism.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import WriteV2 from "./Write";
import Timeline from "./App/Home/Timeline";
import NotePage from "./App/NotePage";
import Storage from "./App/SidePanel/Storage";
import Init from "./App/Init";
import NewHome from "./App/Home/NewHome";
import RollPage from "./App/RollPage";
import MobileSearch from "./App/MobileSearch";
import MobileSettings from "./App/MobileSettings";
import PluginPage from "./App/PluginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WriteV2 />,
    children: [
      {
        index: true,
        element: <NewHome />,
      },
      {
        path: "tags",
        element: <MobileSearch />,
      },
      {
        path: "timeline",
        element: <Timeline />,
      },
      {
        path: "note/:noteId",
        element: <NotePage />,
      },
      {
        path: "journal/:hashtag",
        element: <RollPage />,
      },
      {
        path: "settings/sync",
        element: <Storage />,
      },
      {
        path: "settings",
        element: <MobileSettings />,
      },
      {
        path: "init",
        element: <Init />,
      },
      {
        path: "plugin/:pluginUrl",
        element: <PluginPage />,
      },
    ],
  },
  {
    path: "/write",
    element: <WriteV2 />,
    children: [
      {
        index: true,
        element: <NewHome />,
      },
      {
        path: "tags",
        element: <MobileSearch />,
      },
      {
        path: "timeline",
        element: <Timeline />,
      },
      {
        path: "note/:noteId",
        element: <NotePage />,
      },
      {
        path: "journal/:hashtag",
        element: <RollPage />,
      },
      {
        path: "settings/sync",
        element: <Storage />,
      },
      {
        path: "settings",
        element: <MobileSettings />,
      },
      {
        path: "init",
        element: <Init />,
      },
      {
        path: "plugin/:pluginUrl",
        element: <PluginPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
