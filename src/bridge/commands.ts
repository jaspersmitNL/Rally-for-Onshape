import { classifyOnshapeSelection, delay } from "@/core/utils";
import type { OnshapeSelectionService } from "@/types/onshape/selection";
import type {
	ElementToolbarService,
	ExecuteCommandMessage,
	MiniToolbarService,
	OnshapeCommand,
	OnshapeShortcutCommandsResponse,
	SafeOnshapeCommand,
} from "@/types/onshape-bridge";
import { getInjector } from "./injector";

function safeCommand(
	command: OnshapeCommand,
	tabType: string,
	tabId?: string,
): SafeOnshapeCommand {
	return {
		id: `${command.namespace}-${command.command}`,
		tabType,
		tabId,
		showLabel: command.showLabel,
		namespace: command.namespace,
		tooltipKey: command.tooltipKey,
		icon: command.icon,
		command: command.command,
		commandDetails: command.commandDetails,
		expandedTooltipKey: command.expandedTooltipKey,
		useDynamicSnippet: command.useDynamicSnippet,
		name: command.name,
		context: command.context,
		nodeType: command.nodeType,
		ownerType: command.ownerType,
		ownerId: command.ownerId,
		display: command.display,
		disabled: command.disabled,
		isGeneralTool: command.isGeneralTool,
		ignoreNamespace: command.ignoreNamespace,
		isFsVersionCompatible: command.isFsVersionCompatible,
	};
}

function getCommandName(setting: string | { command: string }): string {
	return typeof setting === "string" ? setting : setting.command;
}

export async function getUserShortcutCommands(): Promise<
	OnshapeShortcutCommandsResponse[]
> {
	const injector = getInjector();
	if (!injector) throw new Error("Onshape injector not available");

	const mini = injector.get<MiniToolbarService>("MiniToolbarService");
	mini.refreshMiniToolbarSettings();

	await delay(1000);

	return (mini.miniToolbarSetting ?? []).map((settingGroup) => {
		const collectionGroup = (mini.miniToolbarCollection ?? []).find(
			(group) => group.tabType === settingGroup.tabType,
		);

		const commands = (settingGroup.commands ?? [])
			.map((setting) => {
				const commandName = getCommandName(setting);

				return collectionGroup?.commands?.find(
					(command) => command.command === commandName,
				);
			})
			.filter((command): command is OnshapeCommand => Boolean(command))
			.map((command) =>
				safeCommand(command, settingGroup.tabType, settingGroup.tabId),
			);

		return {
			tabType: settingGroup.tabType,
			tabId: settingGroup.tabId,
			commands,
		};
	});
}

export function getCurrentSelectionCommands() {
	const injector = getInjector();
	if (!injector) throw new Error("Onshape injector not available");

	const selectionService =
		injector.get<OnshapeSelectionService>("SelectionService");
	const s = selectionService.constructor.getCurrentSelections();

	const annoatetedSelection = s.map((selection) =>
		classifyOnshapeSelection(selection),
	);

	return annoatetedSelection;
}

export function executeCommand(data: ExecuteCommandMessage): void {
	const injector = getInjector();
	const service = injector?.get<ElementToolbarService>("ElementToolbarService");

	if (!service) {
		throw new Error("Onshape ElementToolbarService not available");
	}

	service.executeCommand(data.namespace, data.command, data.commandDetails);
}
