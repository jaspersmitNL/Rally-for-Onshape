import { capitalize, debounce } from "lodash-es";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OnshapeIcon } from "@/components/shared/OnShapeIcon";
import { RadialContextMenu } from "@/components/shared/RadialContextMenu";
import { FORWARDED_ONSHAPE_EVENTS } from "@/constants/onshapeEvents";
import {
	useOnshapeBridge,
	useOnshapeBridgeSubscription,
} from "@/contexts/OnshapeBridgeContext";
import {
	executeOnshapeShortcutCommand,
	watchElementPresence,
} from "@/core/utils";
import type { ClassifiedOnshapeSelection } from "@/types/onshape/selection";

type Position = {
	left: number;
	top: number;
};

const SMART_COMMANDS = {
	singleEdge: ["fillet", "chamfer", "plane"],
	multipleEdges: ["fillet", "chamfer", "loft"],
	singleFace: ["extrude", "newSketch", "moveFace", "offsetSurface", "plane"],
	multipleFaces: [
		"extrude",
		"loft",
		"boolean",
		"deleteFace",
		"moveFace",
		"offsetSurface",
	],
} as const;

function isFromSmartFloatingActions(event: Event) {
	return event.composedPath().some((target) => {
		return (
			target instanceof HTMLElement &&
			target.classList.contains("os-smart-floating-actions")
		);
	});
}

function commandMatches(toolCommand: string, wantedCommand: string) {
	const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "");

	return normalize(toolCommand).includes(normalize(wantedCommand));
}

function getSelectionSignature(selections: ClassifiedOnshapeSelection[]) {
	return selections
		.map((selection) => {
			const id =
				"id" in selection && typeof selection.id === "string"
					? selection.id
					: JSON.stringify(selection);

			return `${selection.kind}:${id}`;
		})
		.sort()
		.join("|");
}

function getSelectionKind(selections: ClassifiedOnshapeSelection[]) {
	if (selections.length === 0) return null;

	const firstKind = selections[0]?.kind;
	if (!firstKind) return null;

	const allSameKind = selections.every(
		(selection) => selection.kind === firstKind,
	);

	return allSameKind ? firstKind : null;
}

function getSmartCommandNames(selections: ClassifiedOnshapeSelection[]) {
	const selectionKind = getSelectionKind(selections);
	if (!selectionKind) return [];

	const isMultiple = selections.length > 1;

	if (selectionKind === "edge") {
		return isMultiple
			? SMART_COMMANDS.multipleEdges
			: SMART_COMMANDS.singleEdge;
	}

	if (selectionKind === "face") {
		return isMultiple
			? SMART_COMMANDS.multipleFaces
			: SMART_COMMANDS.singleFace;
	}

	return [];
}

export function SmartFloatingActions() {
	const { allAvailableTools, toolbarType, currentTool } = useOnshapeBridge();

	const lastPointerPositionRef = useRef<Position | null>(null);
	const selectionSignatureRef = useRef("");
	const suppressUntilNextUserInteractionRef = useRef(false);
	const positionRef = useRef<Position | null>(null);

	const [selections, setSelections] = useState<ClassifiedOnshapeSelection[]>(
		[],
	);
	const [position, setPosition] = useState<Position | null>(null);
	const [enabled, setEnabled] = useState(true);

	const modeTools = allAvailableTools.find((c) => c.tabType === toolbarType);

	const updatePosition = useCallback((nextPosition: Position | null) => {
		positionRef.current = nextPosition;
		setPosition(nextPosition);
	}, []);

	const triggerFetchOfSelections = useMemo(
		() =>
			debounce(() => {
				window.postMessage(
					{
						type: "GET_CURRENT_USER_SELECTIONS",
					},
					window.location.origin,
				);
			}, 200),
		[],
	);

	useEffect(() => {
		const updateLastPointerPosition = (event: PointerEvent | MouseEvent) => {
			if (isFromSmartFloatingActions(event)) return;

			lastPointerPositionRef.current = {
				left: event.clientX,
				top: event.clientY - 50,
			};
		};

		const handlePointerEvent = (event: PointerEvent) => {
			if (isFromSmartFloatingActions(event)) return;

			suppressUntilNextUserInteractionRef.current = false;
			updateLastPointerPosition(event);

			triggerFetchOfSelections();
			window.setTimeout(triggerFetchOfSelections, 125);
			window.setTimeout(triggerFetchOfSelections, 250);
		};

		const handleMouseEvent = (event: MouseEvent) => {
			if (isFromSmartFloatingActions(event)) return;

			suppressUntilNextUserInteractionRef.current = false;
			updateLastPointerPosition(event);

			triggerFetchOfSelections();
			window.setTimeout(triggerFetchOfSelections, 125);
		};

		const handleKeyUp = () => {
			suppressUntilNextUserInteractionRef.current = false;

			triggerFetchOfSelections();
			window.setTimeout(triggerFetchOfSelections, 125);
		};

		window.addEventListener("pointerdown", handlePointerEvent, true);
		window.addEventListener("pointerup", handlePointerEvent, true);
		window.addEventListener("click", handleMouseEvent, true);
		window.addEventListener("mouseup", handleMouseEvent, true);
		window.addEventListener("keyup", handleKeyUp, true);

		return () => {
			window.removeEventListener("pointerdown", handlePointerEvent, true);
			window.removeEventListener("pointerup", handlePointerEvent, true);
			window.removeEventListener("click", handleMouseEvent, true);
			window.removeEventListener("mouseup", handleMouseEvent, true);
			window.removeEventListener("keyup", handleKeyUp, true);

			triggerFetchOfSelections.cancel();
		};
	}, [triggerFetchOfSelections]);

	useEffect(() => {
		let isDraggingCanvas = false;
		let lastDragPosition: Position | null = null;

		const moveMenuByDelta = (event: PointerEvent | MouseEvent) => {
			if (!isDraggingCanvas || !lastDragPosition || !positionRef.current)
				return;
			if (isFromSmartFloatingActions(event)) return;

			const dx = event.clientX - lastDragPosition.left;
			const dy = event.clientY - lastDragPosition.top;

			lastDragPosition = {
				left: event.clientX,
				top: event.clientY,
			};

			updatePosition({
				left: positionRef.current.left + dx,
				top: positionRef.current.top + dy,
			});
		};

		const handlePointerDown = (event: PointerEvent) => {
			if (isFromSmartFloatingActions(event)) return;
			if (!positionRef.current) return;

			isDraggingCanvas = true;
			lastDragPosition = {
				left: event.clientX,
				top: event.clientY,
			};
		};

		const handlePointerMove = (event: PointerEvent) => {
			moveMenuByDelta(event);
		};

		const stopDragging = () => {
			isDraggingCanvas = false;
			lastDragPosition = null;
		};

		const handleWheel = (event: WheelEvent) => {
			if (!positionRef.current) return;
			if (isFromSmartFloatingActions(event)) return;

			const scale = event.deltaY < 0 ? 1.04 : 0.96;
			const anchorX = event.clientX;
			const anchorY = event.clientY;

			updatePosition({
				left: anchorX + (positionRef.current.left - anchorX) * scale,
				top: anchorY + (positionRef.current.top - anchorY) * scale,
			});
		};

		window.addEventListener("pointerdown", handlePointerDown, true);
		window.addEventListener("pointermove", handlePointerMove, true);
		window.addEventListener("pointerup", stopDragging, true);
		window.addEventListener("pointercancel", stopDragging, true);
		window.addEventListener("blur", stopDragging);
		window.addEventListener("wheel", handleWheel, true);

		return () => {
			window.removeEventListener("pointerdown", handlePointerDown, true);
			window.removeEventListener("pointermove", handlePointerMove, true);
			window.removeEventListener("pointerup", stopDragging, true);
			window.removeEventListener("pointercancel", stopDragging, true);
			window.removeEventListener("blur", stopDragging);
			window.removeEventListener("wheel", handleWheel, true);
		};
	}, [updatePosition]);

	useEffect(() => {
		const featureDialogParent = document.querySelector("#content-div");

		if (!featureDialogParent) return;

		return watchElementPresence(
			"#feature-dialog",
			(isPresent) => {
				if (isPresent) {
					setEnabled(false);
					updatePosition(null);
				} else {
					window.setTimeout(() => {
						setEnabled(true);
					}, 1000);
				}
			},
			featureDialogParent,
		);
	}, [updatePosition]);

	useOnshapeBridgeSubscription(
		useCallback(
			(event) => {
				if (event.name !== FORWARDED_ONSHAPE_EVENTS.SELECTION_UPDATED) return;

				const nextSelections = Array.isArray(event.data)
					? (event.data as ClassifiedOnshapeSelection[])
					: [];

				const nextSignature = getSelectionSignature(nextSelections);
				const selectionChanged =
					nextSignature !== selectionSignatureRef.current;

				selectionSignatureRef.current = nextSignature;
				setSelections(nextSelections);

				if (nextSelections.length === 0) {
					updatePosition(null);
					return;
				}

				if (suppressUntilNextUserInteractionRef.current) {
					updatePosition(null);
					return;
				}

				if (!selectionChanged && positionRef.current) return;

				updatePosition(
					lastPointerPositionRef.current ?? {
						left: window.innerWidth / 2,
						top: window.innerHeight / 2,
					},
				);
			},
			[updatePosition],
		),
	);

	const items = useMemo(() => {
		if (!modeTools) return [];

		const smartCommandNames = getSmartCommandNames(selections);

		return smartCommandNames
			.map((commandName) => {
				const tool = modeTools.commands.find((candidate) =>
					commandMatches(candidate.command, commandName),
				);

				if (!tool) return null;

				return {
					id: tool.id,
					label: capitalize(tool.command),
					tooltipContent: capitalize(
						tool.expandedTooltipKey?.replace("tooltips:::", "") ?? tool.command,
					),
					icon: <OnshapeIcon icon={tool.icon as string} />,
					onClick: () => {
						suppressUntilNextUserInteractionRef.current = true;
						updatePosition(null);
						executeOnshapeShortcutCommand(tool);
					},
				};
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);
	}, [modeTools, selections, updatePosition]);

	if (
		!enabled ||
		currentTool ||
		selections.length === 0 ||
		!position ||
		items.length === 0
	) {
		return null;
	}

	return (
		<RadialContextMenu
			position={position}
			items={items}
			className="os-smart-floating-actions"
		/>
	);
}
