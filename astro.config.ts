import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

const defaultSite = "https://14-yillik-yorunge.vercel.app";
const githubOwner = process.env.GITHUB_REPOSITORY_OWNER;
const githubRepoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const githubPagesSite = githubOwner ? `https://${githubOwner}.github.io` : undefined;
const githubPagesBase =
  githubOwner && githubRepoName && githubRepoName !== `${githubOwner}.github.io`
    ? `/${githubRepoName}`
    : undefined;

const site =
  process.env.SITE_URL ?? (isGithubActions && githubPagesSite ? githubPagesSite : defaultSite);
const base = process.env.BASE_PATH ?? (isGithubActions ? githubPagesBase : undefined);

export default defineConfig({
  site,
  ...(base ? { base } : {}),
  output: "static",
  integrations: [
    sitemap(),
    icon({
      include: {
        ph: [
          "arrow-down",
          "arrow-right",
          "arrows-out",
          "camera",
          "check",
          "circle",
          "clock",
          "engine",
          "file-text",
          "info",
          "list",
          "plus",
          "printer",
          "shield-check",
          "user-circle",
          "whatsapp-logo",
          "x",
        ],
      },
    }),
  ],
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
    },
    build: {
      cssMinify: "lightningcss",
    },
  },
});
