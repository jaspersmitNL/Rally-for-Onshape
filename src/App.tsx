import { SettingsDialog } from "./components/dialogs/Settings";
import { FloatingNumpad } from "./components/FloatingNumberPad";
import { PenSidebar } from "./components/PenSidebar";
import { SmartFloatingActions } from "./components/SmartFloatingActions";
import { useOnshapeBridge } from "./contexts/OnshapeBridgeContext";

export function App() {
	const { isDocumentLoaded } = useOnshapeBridge();
	return (
		<>
			{isDocumentLoaded && (
				<>
					<PenSidebar />
					<FloatingNumpad />
					<SettingsDialog />
					<SmartFloatingActions />
				</>
			)}
		</>
	);
}
