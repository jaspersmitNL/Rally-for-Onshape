import {
	ArrowLeft,
	ArrowRight,
	Check,
	Focus,
	MousePointerBan,
	Trash2,
	X,
} from "lucide-react";
import { clickElement, pressKey } from "@/core/utils";
import type { UtilityAction } from "@/types";

export const utilityActions: UtilityAction[] = [
	{
		id: "undo",
		label: "Undo",
		description: "Undo the last action.",
		icon: ArrowLeft,
		onClick: () =>
			document.activeElement?.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: "z",
					code: "KeyZ",
					ctrlKey: true,
					bubbles: true,
					cancelable: true,
				}),
			),
	},
	{
		id: "redo",
		label: "Redo",
		description: "Redo the last undone action.",
		icon: ArrowRight,
		onClick: () =>
			document.activeElement?.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: "y",
					code: "KeyY",
					ctrlKey: true,
					bubbles: true,
					cancelable: true,
				}),
			),
	},
	{
		id: "delete",
		label: "Delete",
		description: "Delete the selected item.",
		icon: Trash2,
		onClick: () => pressKey("Delete"),
	},
	{
		id: "focus",
		label: "Focus",
		description: "Auto orient the view to the selected item(s).",
		icon: Focus,
		onClick: () => pressKey("n"),
	},
	{
		id: "space",
		label: "Clear Selection",
		description: "Clear the current selection.",
		icon: MousePointerBan,
		onClick: () =>
			pressKey(" ", {
				code: "Space",
				keyCode: 32,
				which: 32,
			}),
	},
	{
		id: "escape",
		label: "Cancel",
		description: "Cancel the current command.",
		icon: X,
		onClick: () => {
			clickElement("#feature-dialog .ns-dialog-button-cancel");
		},
	},
	{
		id: "confirm",
		label: "Confirm",
		description: "Confirm the current command.",
		icon: Check,
		onClick: () => {
			clickElement("#feature-dialog .ns-dialog-button-ok");
		},
	},
];
