import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { breadcrumbAtom } from "../atoms/breadcrumbAtom";

export function useUpdateBreadcrumbs(
  breadcrumbs: { name: string; url: string }[],
) {
  const setBreadcrumb = useSetAtom(breadcrumbAtom);

  useEffect(() => {
    setBreadcrumb(breadcrumbs);
  }, []);

  return null;
}
