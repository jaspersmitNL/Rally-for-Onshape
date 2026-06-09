import {
	ACCEPTED_ONSHAPE_TO_EXTENSION_EVENT_TYPE,
	FORWARDED_ONSHAPE_EVENTS,
} from "@/constants/onshapeEvents";
import type {
	AngularEventKind,
	OnshapeAngularRootScope,
	UnknownRecord,
} from "@/types/onshape-bridge";
import { getInjector } from "./injector";

function shouldForwardAngularEvent(name: unknown): name is string {
	return (
		typeof name === "string" && Object.hasOwn(FORWARDED_ONSHAPE_EVENTS, name)
	);
}

export function postToPage(message: UnknownRecord): void {
	window.postMessage(message, window.location.origin);
}

export function executeBroadcastEvent(
	name: string,
	args: unknown[] = [],
): void {
	const injector = getInjector();
	const $rootScope = injector?.get<OnshapeAngularRootScope>("$rootScope");

	if (!$rootScope) {
		throw new Error("Onshape $rootScope not available");
	}

	$rootScope.$broadcast(name, ...args);
}

export function startAngularEventForwarding(): void {
	const injector = getInjector();
	if (!injector || window.__onshapeAngularEventForwardingStarted) return;

	window.__onshapeAngularEventForwardingStarted = true;

	const $rootScope = injector.get<OnshapeAngularRootScope>("$rootScope");

	const originalBroadcast = $rootScope.$broadcast;
	const originalEmit = $rootScope.$emit;

	function forwardLater(
		kind: AngularEventKind,
		name: string,
		args: unknown[],
	): void {
		if (!shouldForwardAngularEvent(name)) return;

		queueMicrotask(() => {
			try {
				postToPage({
					type: ACCEPTED_ONSHAPE_TO_EXTENSION_EVENT_TYPE,
					kind,
					name,
					args,
					timestamp: Date.now(),
				});
			} catch (error) {
				console.warn("Failed to forward Onshape Angular event", name, error);
			}
		});
	}

	$rootScope.$broadcast = function patchedBroadcast(
		this: OnshapeAngularRootScope,
		name: string,
		...args: unknown[]
	): unknown {
		const result = originalBroadcast.apply(this, [name, ...args]);

		try {
			forwardLater("broadcast", name, args);
		} catch {
			// Never let forwarding break Onshape.
		}

		return result;
	};

	$rootScope.$emit = function patchedEmit(
		this: OnshapeAngularRootScope,
		name: string,
		...args: unknown[]
	): unknown {
		const result = originalEmit.apply(this, [name, ...args]);

		try {
			forwardLater("emit", name, args);
		} catch {
			// Never let forwarding break Onshape.
		}

		return result;
	};

	console.log("Onshape Angular event forwarding started");
}
