import type { LucideIcon } from "lucide-react";

export type ToolTone = "default" | "primary" | "success" | "danger";

export type ToolDefinition = {
	id: string;
	icon: LucideIcon;
	title: string;
	onClick: () => void;
	tone?: ToolTone;
};

export type FeatureDefinition = {
	label: string;
	tools: ToolDefinition[];
};
