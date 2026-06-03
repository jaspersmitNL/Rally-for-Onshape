import type { InboundBridgeMessage, UnknownRecord } from "@/types/onshape-bridge";

export function isRecord(value: unknown): value is UnknownRecord {
	return typeof value === "object" && value !== null;
}

export function isInboundBridgeMessage(
	value: unknown,
): value is InboundBridgeMessage {
	return isRecord(value) && typeof value.type === "string";
}