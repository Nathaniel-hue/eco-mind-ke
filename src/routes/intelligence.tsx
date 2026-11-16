import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/intelligence")({ staticData: { sitemap: false }, component: () => <Outlet /> });
