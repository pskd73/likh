import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PublicNote from "./Public/Note";
import AppV2 from "./AppV2";
import PublicNoteV2 from "./Public/PublicNote";
import Home from "./Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/note/:noteId",
    element: <PublicNote />,
  },
  {
    path: "/v2",
    element: <AppV2 />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "note/:noteId",
        element: <PublicNoteV2 />,
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
