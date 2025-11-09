import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DarkModeContextProvider } from "./context/darkModeContext.tsx";
import { AuthContextProvider } from "./context/authContext.js";

createRoot(document.getElementById("root")!).render(
  <DarkModeContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </DarkModeContextProvider>
);
