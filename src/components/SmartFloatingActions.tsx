import { debounce } from "lodash-es";
import { Move3d, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FORWARDED_ONSHAPE_EVENTS } from "@/constants/onshapeEvents";
import { useOnshapeBridgeSubscription } from "@/contexts/OnshapeBridgeContext";
import type { ClassifiedOnshapeSelection } from "@/types/onshape/selection";
import { RadialContextMenu } from "./RadialContextMenu";

type Position = {
	left: number;
	top: number;
};

function isFromSmartFloatingActions(event: Event) {
	return event.composedPath().some((target) => {
		return (
			target instanceof HTMLElement &&
			target.classList.contains("os-smart-floating-actions")
		);
	});
}

export function SmartFloatingActions() {
	const lastPointerPositionRef = useRef<Position | null>(null);

	const [selections, setSelections] = useState<ClassifiedOnshapeSelection[]>(
		[],
	);
	const [position, setPosition] = useState<Position | null>(null);

	const triggerFetchOfSelections = useMemo(
		() =>
			debounce(() => {
				window.postMessage(
					{
						type: "GET_CURRENT_USER_SELECTIONS",
					},
					window.location.origin,
				);
			}, 75),
		[],
	);

	useEffect(() => {
		const handlePointerUp = (event: PointerEvent) => {
			if (isFromSmartFloatingActions(event)) return;

			lastPointerPositionRef.current = {
				left: event.clientX,
				top: event.clientY - 150,
			};

			triggerFetchOfSelections();
		};

		const handleKeyUp = () => {
			triggerFetchOfSelections();
		};

		window.addEventListener("pointerup", handlePointerUp, true);
		window.addEventListener("keyup", handleKeyUp, true);

		return () => {
			window.removeEventListener("pointerup", handlePointerUp, true);
			window.removeEventListener("keyup", handleKeyUp, true);

			triggerFetchOfSelections.cancel();
		};
	}, [triggerFetchOfSelections]);

	useOnshapeBridgeSubscription(
		useCallback((event) => {
			if (event.name === FORWARDED_ONSHAPE_EVENTS.SELECTION_UPDATED) {
				const nextSelections = Array.isArray(event.data)
					? (event.data as ClassifiedOnshapeSelection[])
					: [];

				setSelections(nextSelections);

				if (nextSelections.length === 0) {
					setPosition(null);
					return;
				}

				setPosition(
					lastPointerPositionRef.current ?? {
						left: window.innerWidth / 2,
						top: window.innerHeight / 2,
					},
				);
			}
		}, []),
	);

	const items = useMemo(
		() => [
			{
				id: "demo",
				label: "Demo",
				icon: <Sparkles className="h-4 w-4" />,
				onClick: () => {
					console.log("Selected items", selections);
				},
			},
			{
				id: "extrude",
				label: "Extrude",
				icon: <Move3d className="h-4 w-4" />,
				onClick: () => {
					console.log("Extrude face", selections);
				},
			},
		],
		[selections],
	);

	if (selections.length === 0 || !position) return null;

	return <RadialContextMenu position={position} items={items} />;
}
