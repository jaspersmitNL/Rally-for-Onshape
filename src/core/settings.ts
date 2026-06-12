export type FloatingNumpadMode = "auto" | "always" | "off";

const FLOATING_NUMPAD_MODE_KEY = "os-floating-numpad-mode";

export function getFloatingNumpadMode(): FloatingNumpadMode {
	const value = localStorage.getItem(FLOATING_NUMPAD_MODE_KEY);

	if (value === "auto" || value === "always" || value === "off") {
		return value;
	}

	return "auto";
}

export function setFloatingNumpadMode(mode: FloatingNumpadMode): void {
	localStorage.setItem(FLOATING_NUMPAD_MODE_KEY, mode);
}

export function shouldUseFloatingNumpad(): boolean {
	const mode = getFloatingNumpadMode();

	switch (mode) {
		case "always":
			return true;

		case "off":
			return false;

		case "auto":
		default:
			return (
				navigator.maxTouchPoints > 0 &&
				window.matchMedia("(pointer: coarse)").matches
			);
	}
}

const SMART_FLOATING_ACTIONS_KEY = "smartFloatingActionsEnabled";

export function getSmartFloatingActionsEnabled() {
	return localStorage.getItem(SMART_FLOATING_ACTIONS_KEY) === "true";
}

export function setSmartFloatingActionsEnabled(enabled: boolean) {
	localStorage.setItem(SMART_FLOATING_ACTIONS_KEY, String(enabled));
}
