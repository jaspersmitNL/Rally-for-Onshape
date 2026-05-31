import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { FloatingNumpad } from "./components/FloatingNumberPad";
import { PenSidebar } from "./components/PenSidebar";
import { TooltipProvider } from "./components/ui/tooltip";

function injectOnshapeBridge(): void {
	if (document.getElementById("os-onshape-page-bridge")) return;

	const script = document.createElement("script");
	script.id = "os-onshape-page-bridge";
	script.src = chrome.runtime.getURL("onshape-page-bridge.js");

	document.documentElement.appendChild(script);
}

injectOnshapeBridge();

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
