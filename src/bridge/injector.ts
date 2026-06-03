import type {
	OnshapeAngular,
	OnshapeAngularInjector,
} from "@/types/onshape-bridge";

declare global {
	interface Window {
		angular?: OnshapeAngular;
	}
}

export function getInjector(): OnshapeAngularInjector | undefined {
	return window.angular?.element(document).injector();
}