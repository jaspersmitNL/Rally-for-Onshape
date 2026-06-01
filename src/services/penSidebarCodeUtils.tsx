import {
	IconArrowBackUp,
	IconArrowForwardUp,
	IconCheck,
	IconDeselect,
	IconFocusAuto,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { clickElement, pressKey } from "@/core/utils";
import type { UtilityAction } from "@/types";

export const utilityActions: UtilityAction[] = [
	{
		id: "undo",
		label: "Undo",
		description: "Undo the last action.",
		icon: IconArrowBackUp,
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
		icon: IconArrowForwardUp,
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
		icon: IconTrash,
		onClick: () => pressKey("Delete"),
	},
	{
		id: "focus",
		label: "Focus",
		description: "Auto orient the view to the selected item(s).",
		icon: IconFocusAuto,
		onClick: () => pressKey("n"),
	},
	{
		id: "space",
		label: "Clear Selection",
		description: "Clear the current selection.",
		icon: IconDeselect,
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
		icon: IconX,
		onClick: () => {
			clickElement("#feature-dialog .ns-dialog-button-cancel");
		},
	},
	{
		id: "confirm",
		label: "Confirm",
		description: "Confirm the current command.",
		icon: IconCheck,
		onClick: () => {
			clickElement("#feature-dialog .ns-dialog-button-ok");
		},
	},
];
