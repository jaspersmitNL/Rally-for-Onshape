export type PressKeyOptions = {
	code?: string;
	keyCode?: number;
	which?: number;
	target?: EventTarget | null;
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
};

export type OnshapeRoute = {
	href: string;
	pathname: string;
	isDocumentPage: boolean;
	documentId: string | null;
};

export type FeatureState = {
	dialog: HTMLElement | null;
	isFeatureOpen: boolean;
	featureType: string | null;
};

export type Unsubscribe = () => void;

export function pressKey(key: string, opts: PressKeyOptions = {}): void {
	const isLetter = /^[a-z]$/i.test(key);
	const isDigit = /^[0-9]$/.test(key);
	const upperKey = key.toUpperCase();

	const keyCode =
		opts.keyCode ??
		(isLetter ? upperKey.charCodeAt(0) : isDigit ? key.charCodeAt(0) : 0);

	const code =
		opts.code ?? (isLetter ? `Key${upperKey}` : isDigit ? `Digit${key}` : key);

	const eventOptions: KeyboardEventInit = {
		key,
		code,
		keyCode,
		which: opts.which ?? keyCode,
		bubbles: true,
		cancelable: true,
		composed: true,
		ctrlKey: !!opts.ctrlKey,
		shiftKey: !!opts.shiftKey,
		altKey: !!opts.altKey,
		metaKey: !!opts.metaKey,
	};

	const targets: EventTarget[] = [
		opts.target,
		window,
		document,
		document.body,
		document.querySelector("canvas"),
		document.activeElement,
	].filter((target): target is EventTarget => !!target);

	for (const target of targets) {
		target.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
		target.dispatchEvent(new KeyboardEvent("keypress", eventOptions));

		window.setTimeout(() => {
			target.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
		}, 35);
	}
}

export function getRoute(): OnshapeRoute {
	const pathname = window.location.pathname;
	const documentMatch = pathname.match(/^\/documents\/([^/]+)/);

	return {
		href: window.location.href,
		pathname,
		isDocumentPage: !!documentMatch,
		documentId: documentMatch?.[1] ?? null,
	};
}

export function getFeatureState(): FeatureState {
	const dialog = document.querySelector<HTMLElement>(
		"#feature-dialog.feature-dialog",
	);

	return {
		dialog,
		isFeatureOpen: !!dialog,
		featureType: dialog?.getAttribute("feature-type") ?? null,
	};
}

export function subscribeToRoute(
	callback: (route: OnshapeRoute) => void,
): Unsubscribe {
	let lastHref = window.location.href;

	const check = (): void => {
		if (window.location.href === lastHref) return;

		lastHref = window.location.href;
		callback(getRoute());
	};

	const interval = window.setInterval(check, 250);

	window.addEventListener("hashchange", check);
	window.addEventListener("popstate", check);

	callback(getRoute());

	return () => {
		window.clearInterval(interval);
		window.removeEventListener("hashchange", check);
		window.removeEventListener("popstate", check);
	};
}

export function subscribeToFeature(
	callback: (state: FeatureState) => void,
): Unsubscribe {
	let lastFeatureType: string | null | undefined;
	let lastIsFeatureOpen: boolean | undefined;
	let timer: number | undefined;

	const emitIfChanged = (): void => {
		if (timer) {
			window.clearTimeout(timer);
		}

		timer = window.setTimeout(() => {
			const state = getFeatureState();

			if (
				state.featureType === lastFeatureType &&
				state.isFeatureOpen === lastIsFeatureOpen
			) {
				return;
			}

			lastFeatureType = state.featureType;
			lastIsFeatureOpen = state.isFeatureOpen;

			callback(state);
		}, 50);
	};

	const observer = new MutationObserver(emitIfChanged);

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["feature-type", "class", "style"],
	});

	emitIfChanged();

	return () => {
		if (timer) {
			window.clearTimeout(timer);
		}

		observer.disconnect();
	};
}

export function setNativeValue(
	el: HTMLInputElement | HTMLTextAreaElement,
	value: string,
): void {
	const valueSetter = Object.getOwnPropertyDescriptor(el, "value")?.set;
	const prototypeSetter = Object.getOwnPropertyDescriptor(
		Object.getPrototypeOf(el),
		"value",
	)?.set;

	if (prototypeSetter && valueSetter !== prototypeSetter) {
		prototypeSetter.call(el, value);
	} else if (valueSetter) {
		valueSetter.call(el, value);
	} else {
		el.value = value;
	}
}

export function fireInputEvents(
	el: HTMLElement,
	inputType: InputEvent["inputType"] = "insertText",
	data: string | null = null,
): void {
	el.dispatchEvent(
		new InputEvent("input", {
			bubbles: true,
			cancelable: true,
			inputType,
			data,
		}),
	);

	el.dispatchEvent(
		new Event("change", {
			bubbles: true,
		}),
	);
}