import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { PanelLeftIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { breadcrumbAtom } from "../atoms/breadcrumbAtom";
import { AnimatedSidebarTrigger } from "./motion/animated-sidebar";
import { SearchCommand } from "./SearchCommand";
import { UserMenu } from "./UserMenu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { ThemeToggle } from "./ui/theme-toggle";

export function NavBar() {
  const breadcrumbs = useAtomValue(breadcrumbAtom);
  const hasSingleBreadcrumb = breadcrumbs.length === 1;
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${entry.contentRect.height}px`,
      );
    });

    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="flex h-16 shrink-0 justify-between border-b px-4"
    >
      <div className="flex items-center gap-4">
        <AnimatedSidebarTrigger className="-ml-1 size-8 text-muted-foreground hover:bg-muted hover:text-foreground">
          <PanelLeftIcon className="size-4" />
        </AnimatedSidebarTrigger>
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {hasSingleBreadcrumb ? (
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbs[0].name}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              breadcrumbs.map((b, i) => {
                if (i === breadcrumbs.length - 1) {
                  return (
                    <BreadcrumbItem key={b.name}>
                      <BreadcrumbPage>{b.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  );
                } else {
                  return (
                    <React.Fragment key={b.name}>
                      <BreadcrumbItem className="hidden md:block">
                        <Link to={b.url}>{b.name}</Link>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </React.Fragment>
                  );
                }
              })
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <SearchCommand />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
