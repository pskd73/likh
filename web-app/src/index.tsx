import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppV2 from "./App";
import PublicNoteV2 from "./Public/PublicNote";
import Home from "./Home/Home";
import MyNotes from "./Notes/MyNotes";
import Settings from "./Settings/Settings";
import Write from "./Write/Write";
import New from "./Write/New";
import Landing from "./Landing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/note",
    element: <AppV2 />,
    children: [{ path: ":noteId", element: <PublicNoteV2 /> }],
  },
  {
    path: "/app",
    element: <AppV2 />,
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
