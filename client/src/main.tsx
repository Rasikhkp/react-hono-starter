import type { RankingInfo } from "@tanstack/match-sorter-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import type { FilterFn } from "@tanstack/react-table";
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

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export const queryClient = new QueryClient();

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider position="top-right">
        <AnchoredToastProvider>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </AnchoredToastProvider>
      </ToastProvider>
    </QueryClientProvider>,
  );
}
