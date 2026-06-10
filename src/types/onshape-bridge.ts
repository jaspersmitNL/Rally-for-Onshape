export type AngularEventKind = "broadcast" | "emit";

export type UnknownRecord = Record<string, unknown>;

export interface OnshapeAngularRootScope {
	$broadcast: (name: string, ...args: unknown[]) => unknown;
	$emit: (name: string, ...args: unknown[]) => unknown;
}

export interface OnshapeAngularInjector {
	get: <T = unknown>(name: string) => T;
}

export interface OnshapeAngular {
	element: (element: Document | Element) => {
		injector: () => OnshapeAngularInjector | undefined;
	};
}

export interface OnshapeCommand {
	namespace: string;
	command: string;
	showLabel?: boolean;
	tooltipKey?: string;
	icon?: unknown;
	commandDetails?: unknown;
	expandedTooltipKey?: string;
	useDynamicSnippet?: boolean;
	name?: string;
	context?: unknown;
	nodeType?: string;
	ownerType?: string;
	ownerId?: string;
	display?: unknown;
	disabled?: boolean;
	isGeneralTool?: boolean;
	ignoreNamespace?: boolean;
	isFsVersionCompatible?: boolean;
}

export interface OnshapeMiniToolbarSettingGroup {
	tabType: string;
	tabId?: string;
	commands?: Array<string | { command: string }>;
}

export interface OnshapeMiniToolbarCollectionGroup {
	tabType: string;
	commands?: OnshapeCommand[];
}

export interface MiniToolbarService {
		miniToolbarSetting?: OnshapeMiniToolbarSettingGroup[];
		miniToolbarCollection?: OnshapeMiniToolbarCollectionGroup[];
		refreshMiniToolbarSettings: () => void
	}

export interface ElementToolbarService {
	executeCommand: (
		namespace: string,
		command: string,
		commandDetails?: unknown,
	) => unknown;
}

export interface SafeOnshapeCommand {
	id: string;
	tabType: string;
	tabId?: string;
	showLabel?: boolean;
	namespace: string;
	tooltipKey?: string;
	icon?: unknown;
	command: string;
	commandDetails?: unknown;
	expandedTooltipKey?: string;
	useDynamicSnippet?: boolean;
	name?: string;
	context?: unknown;
	nodeType?: string;
	ownerType?: string;
	ownerId?: string;
	display?: unknown;
	disabled?: boolean;
	isGeneralTool?: boolean;
	ignoreNamespace?: boolean;
	isFsVersionCompatible?: boolean;
}

export interface OnshapeShortcutCommandsResponse {
	tabType: string;
	tabId?: string;
	commands: SafeOnshapeCommand[];
}

export interface BaseInboundMessage {
	type: string;
	requestId?: string;
}

export interface GetUserShortcutCommandsMessage extends BaseInboundMessage {
	type: "OS_GET_USER_SHORTCUT_COMMANDS";
	requestId: string;
}

export interface ExecuteBroadcastEventMessage extends BaseInboundMessage {
	type: "OS_EXECUTE_BROADCAST_EVENT";
	name: string;
	args?: unknown[];
}

export interface ExecuteCommandMessage extends BaseInboundMessage {
	type: "OS_EXECUTE_COMMAND";
	namespace: string;
	command: string;
	commandDetails?: unknown;
}

export type InboundBridgeMessage =
	| GetUserShortcutCommandsMessage
	| ExecuteBroadcastEventMessage
	| ExecuteCommandMessage;