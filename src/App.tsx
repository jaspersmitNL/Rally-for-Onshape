import { SettingsDialog } from "./components/dialogs/Settings";
import { FloatingNumpad } from "./components/FloatingNumberPad";
import { PenSidebar } from "./components/PenSidebar";
import { SmartFloatingActions } from "./components/SmartFloatingActions";
import { useOnshapeBridge } from "./contexts/OnshapeBridgeContext";
import { useSettingsDialog } from "./contexts/SettingsDialogContext";

export function App() {
	const { isDocumentLoaded } = useOnshapeBridge();

	const { smartFloatingActionsEnabled } = useSettingsDialog();

	if (!isDocumentLoaded) {
		return null;
	}

	return (
		<>
			<PenSidebar />
			<FloatingNumpad />
			<SettingsDialog />

			{smartFloatingActionsEnabled && <SmartFloatingActions />}
		</>
	);
}
