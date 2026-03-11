import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import { RouterProvider } from "react-router-dom";

import "@radix-ui/themes/styles.css";
import "src/styles/global.css";
import { router } from "src/app/router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="amber" grayColor="sand" radius="medium">
      <RouterProvider router={router} />
    </Theme>
  </React.StrictMode>,
);
