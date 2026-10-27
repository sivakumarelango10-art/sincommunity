import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles";
import App from "./App";

const container = document.getElementById("root")!;
// built pages name themselves (data-path); the development server falls back to the address
const built = container.dataset.path;
const path = built && built.startsWith("/") ? built : window.location.pathname;
const app = (
  <StrictMode>
    <App path={path} />
  </StrictMode>
);

// production builds ship prerendered HTML (see scripts/prerender.mjs); dev starts empty
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
