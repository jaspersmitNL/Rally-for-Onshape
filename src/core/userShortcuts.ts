import type {
	OnshapeShortcutCommand,
	OnshapeShortcutCommandsResponse,
	OnshapeToolbarMode,
} from "@/types";


export function getUserShortcutCommands(): Promise<OnshapeShortcutCommandsResponse[]> {
	const requestId = crypto.randomUUID();

	return new Promise((resolve, reject) => {
		const timeout = window.setTimeout(() => {
			window.removeEventListener("message", onMessage);
			reject(new Error("Timed out loading Onshape shortcut commands"));
		}, 3000);

		function onMessage(event: MessageEvent) {
			if (event.source !== window) return;

			const data = event.data;

			if (
				data?.type !== "OS_GET_USER_SHORTCUT_COMMANDS_RESULT" ||
				data.requestId !== requestId
			) {
				return;
			}

			window.clearTimeout(timeout);
			window.removeEventListener("message", onMessage);

			if (data.error) {
				reject(new Error(data.error));
				return;
			}

			resolve(data.modes ?? []);
		}

		window.addEventListener("message", onMessage);

		window.postMessage(
			{
				type: "OS_GET_USER_SHORTCUT_COMMANDS",
				requestId,
			},
			window.location.origin,
		);
	});
}
