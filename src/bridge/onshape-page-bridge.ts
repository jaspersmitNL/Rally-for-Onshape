import { startAngularEventForwarding } from "./angular-events";
import { getInjector } from "./injector";
import { handleMessage } from "./messages";

declare global {
	interface Window {
		__onshapePageBridgeLoaded?: boolean;
		__onshapeAngularEventForwardingStarted?: boolean;
	}
}

function initializeBridge(): void {
	window.addEventListener("message", handleMessage);

	const interval = window.setInterval(() => {
		if (!getInjector()) return;

		startAngularEventForwarding();
		window.clearInterval(interval);
	}, 250);
}

if (!window.__onshapePageBridgeLoaded) {
	window.__onshapePageBridgeLoaded = true;
	initializeBridge();
}