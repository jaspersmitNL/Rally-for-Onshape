import { pressKey } from "@/core/utils";
import type { FeatureDefinition } from "@/features/types";
import {
	Circle,
	Minus,
	RectangleHorizontal,
	Ruler,
	Scissors,
	Slash,
} from "lucide-react";

const pressKeyAction = (key: string, opts = {}) => () => pressKey(key, opts);

export const featureDefinitions: Record<string, FeatureDefinition> = {
	newSketch: {
		label: "Sketch",
		tools: [
			{
				id: "line",
				icon: Slash,
				title: "Line",
				onClick: pressKeyAction("l"),
				tone: "primary",
			},
			{
				id: "circle",
				icon: Circle,
				title: "Circle",
				onClick: pressKeyAction("c"),
			},
			{
				id: "rectangle",
				icon: RectangleHorizontal,
				title: "Rectangle",
				onClick: pressKeyAction("r"),
			},
			{
				id: "dimension",
				icon: Ruler,
				title: "Dimension",
				onClick: pressKeyAction("d"),
				tone: "primary",
			},
			{
				id: "trim",
				icon: Scissors,
				title: "Trim",
				onClick: pressKeyAction("t"),
			},
			{
				id: "offset",
				icon: Minus,
				title: "Offset",
				onClick: pressKeyAction("o"),
			},
		],
	},

	extrude: {
		label: "Extrude",
		tools: [],
	},

	fillet: {
		label: "Fillet",
		tools: [],
	},

	chamfer: {
		label: "Chamfer",
		tools: [],
	},
};
