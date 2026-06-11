import { debounce } from "lodash-es";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FORWARDED_ONSHAPE_EVENTS } from "@/constants/onshapeEvents";
import { useOnshapeBridgeSubscription } from "@/contexts/OnshapeBridgeContext";
import type { ClassifiedOnshapeSelection } from "@/types/onshape/selection";

export function SmartFloatingActions() {
	const [selections, setSelection] = useState<ClassifiedOnshapeSelection[]>([]);

	const triggerFetchOfSelections = useMemo(
		() =>
			debounce(() => {
				window.postMessage(
					{
						type: "GET_CURRENT_USER_SELECTIONS",
					},
					window.location.origin,
				);
			}, 50),
		[],
	);

	useEffect(() => {
		window.addEventListener("pointerup", triggerFetchOfSelections, true);
		window.addEventListener("keyup", triggerFetchOfSelections, true);

		return () => {
			window.removeEventListener("pointerup", triggerFetchOfSelections, true);
			window.removeEventListener("keyup", triggerFetchOfSelections, true);

			triggerFetchOfSelections.cancel();
		};
	}, [triggerFetchOfSelections]);

	useOnshapeBridgeSubscription(
		useCallback((event) => {
			if (
				event.name === FORWARDED_ONSHAPE_EVENTS.SELECTION_UPDATED &&
				event.data
			) {
				console.log("selection updated", event);

				setSelection(event.data as ClassifiedOnshapeSelection[]);
			}
		}, []),
	);

	if (selections.length === 0) return;
	return null;
}
