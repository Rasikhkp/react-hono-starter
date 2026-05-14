import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import {
  AnchoredToastProvider,
  ToastProvider,
} from "./shared/components/ui/toast";
import { TooltipProvider } from "./shared/components/ui/tooltip";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ToastProvider position="top-right">
      <AnchoredToastProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </AnchoredToastProvider>
    </ToastProvider>,
  );
}
