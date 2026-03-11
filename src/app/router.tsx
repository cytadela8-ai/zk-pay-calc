import { createBrowserRouter } from "react-router-dom";

import { App } from "src/app/App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);
