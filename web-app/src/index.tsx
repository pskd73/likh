import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import PublicNote from "./Public/PublicNote";
import Home from "./Home/Home";
import MyNotes from "./Notes/MyNotes";
import Settings from "./Settings/Settings";
import Write from "./Write/Write";
import New from "./Write/New";
import Landing from "./Landing";
import { NoMobile, Private } from "./comps/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NoMobile>
        <Landing />
      </NoMobile>
    ),
  },
  {
    path: "/note",
    element: <App nav={false} />,
    children: [{ path: ":noteId", element: <PublicNote /> }],
  },
  {
    path: "/app",
    element: (
      <NoMobile>
        <Private>
          <App />
        </Private>
      </NoMobile>
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
