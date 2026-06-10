import type { GetUserShortcutCommandsMessage } from "@/types/onshape-bridge";
import { executeBroadcastEvent, postToPage } from "./angular-events";
import { executeCommand, getUserShortcutCommands } from "./commands";
import { isInboundBridgeMessage } from "./guards";

async function handleGetUserShortcutCommands(
	data: GetUserShortcutCommandsMessage,
): Promise<void> {
	try {
		const result = await getUserShortcutCommands();
		postToPage({
			type: "OS_GET_USER_SHORTCUT_COMMANDS_RESULT",
			requestId: data.requestId,
			modes: result,
		});
	} catch (error) {
		postToPage({
			type: "OS_GET_USER_SHORTCUT_COMMANDS_RESULT",
			requestId: data.requestId,
			modes: [],
			error: String(error),
		});
	}
}

export function handleMessage(event: MessageEvent<unknown>): void {
	if (event.source !== window) return;
	if (!isInboundBridgeMessage(event.data)) return;

	const data = event.data;

	switch (data.type) {
		case "OS_GET_USER_SHORTCUT_COMMANDS": {
			if (typeof data.requestId !== "string") return;
			handleGetUserShortcutCommands(data);
			return;
		}

		case "OS_EXECUTE_BROADCAST_EVENT": {
			if (typeof data.name !== "string") return;

			try {
				executeBroadcastEvent(
					data.name,
					Array.isArray(data.args) ? data.args : [],
				);
			} catch (error) {
				console.error("Failed to execute Onshape broadcast event", error);
			}

			return;
		}

		case "OS_EXECUTE_COMMAND": {
			if (
				typeof data.namespace !== "string" ||
				typeof data.command !== "string"
			) {
				return;
			}

			try {
				executeCommand(data);
			} catch (error) {
				console.error("Failed to execute Onshape command", error);
			}

			return;
		}
	}
}
