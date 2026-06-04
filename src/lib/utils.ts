import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function shouldUseFloatingNumpad(): boolean {
	const setting = localStorage.getItem("os-floating-numpad");

	if (setting === "always") return true;
	if (setting === "off") return false;

	return (
		navigator.maxTouchPoints > 0 &&
		window.matchMedia("(pointer: coarse)").matches
	);
}
