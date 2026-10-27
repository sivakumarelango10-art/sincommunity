import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export { ROUTES, headTags } from "./seo/routes";
export { SITE_URL } from "./config/site";
export { llmsTxt } from "./seo/llms";

/** Renders one page for the build-time prerender (scripts/prerender.mjs). */
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
