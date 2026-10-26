import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles";
import App from "./App";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// production builds ship prerendered HTML (see scripts/prerender.mjs); dev starts empty
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
