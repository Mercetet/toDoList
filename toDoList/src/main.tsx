
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter.tsx";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<AppRouter />
	</BrowserRouter>
);
