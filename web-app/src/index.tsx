import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./prism.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import PublicNote from "./Public/PublicNote";
import Home from "./Home/Home";
import MyNotes from "./Notes/MyNotes";
import Settings from "./Settings/Settings";
import Write from "./Write/Write";
import New from "./Write/New";
import { Private } from "./comps/Layout";
import WriteV2 from "./Write";
import Roll from "./Write/Roll";
import Landing from "./Landing";
import Timeline from "./App/Home/Timeline";
import NotePage from "./App/NotePage";
import Storage from "./App/SidePanel/Storage";
import Init from "./App/Init";
import NewHome from "./App/Home/NewHome";
import RollPage from "./App/RollPage";
import MobileSearch from "./App/MobileSearch";
import MobileSettings from "./App/MobileSettings";

const router = createBrowserRouter([
  {
    path: "/old",
    element: <Landing />,
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
    ],
  },
  {
    path: "/note",
    element: <App nav={false} />,
    children: [{ path: ":noteId", element: <PublicNote /> }],
  },
  {
    path: "/",
    element: (
      <Private>
        <App />
      </Private>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "notes",
        element: <MyNotes />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "write/:noteId",
        element: <Write />,
      },
      {
        path: "write/new",
        element: <New />,
      },
      {
        path: "roll",
        element: <Roll />,
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
