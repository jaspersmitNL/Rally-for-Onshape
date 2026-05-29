import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { FloatingNumpad } from "./components/FloatingNumberPad";
import { PenSidebar } from "./components/PenSidebar";
import "./core/touchPolish";
import { TooltipProvider } from "./components/ui/tooltip";

const rootEl = document.createElement("div");
rootEl.id = "onshape-tablet-root";
document.body.appendChild(rootEl);

createRoot(rootEl).render(
	<React.StrictMode>
		<TooltipProvider delayDuration={120} skipDelayDuration={0}>
			<PenSidebar />
			<FloatingNumpad />
		</TooltipProvider>
	</React.StrictMode>,
);
