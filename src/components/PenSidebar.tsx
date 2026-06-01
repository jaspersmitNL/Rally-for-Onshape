import { capitalize } from "lodash-es";
import { GripHorizontal, LoaderCircle, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserShortcutCommands } from "@/core/userShortcuts";
import { utilityActions } from "@/services/penSidebarCodeUtils";
import type {
	OnshapeShortcutCommandsResponse,
	OnshapeToolbarMode,
} from "@/types";
import { executeOnshapeShortcutCommand, pressKey } from "../core/utils";
import { OnshapeIcon } from "./OnShapeIcon";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

const STORAGE_KEY = "onshapePenSidebarPosition";
const LABEL_MODE_KEY = "onshapePenSidebarLabelsAlwaysVisible";

const MotionButton = motion.create(Button);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function SidebarDivider() {
	return <div className="my-3 h-px w-full bg-border" />;
}

export function PenSidebar() {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [allCommands, setAllCommands] = useState<
		OnshapeShortcutCommandsResponse[]
	>([]);

	const [currentTool, setCurrentTool] = useState<string | null>(null);

	const [visible, setVisible] = useState(false);

	const [position, setPosition] = useState(() => {
		try {
			return JSON.parse(
				localStorage.getItem(STORAGE_KEY) ?? JSON.stringify({ x: 12, y: 200 }),
			);
		} catch {
			return { x: 12, y: 200 };
		}
	});

	const [toolbarType, setToolbarType] =
		useState<OnshapeToolbarMode>("Part Studio");

	const [labelsVisible, setLabelsVisible] = useState(
		() => localStorage.getItem(LABEL_MODE_KEY) === "true",
	);

	useEffect(() => {
		async function onMessage(event: MessageEvent) {
			if (event.source !== window) return;

			const data = event.data;
			if (!data || data.type !== "OS_ANGULAR_EVENT") return;

			if (data.name === "ELEMENT_LOAD_DONE") {
				setVisible(true);
				pressKey("s");

				await delay(250);

				document.body.dispatchEvent(
					new MouseEvent("mousedown", {
						bubbles: true,
						cancelable: true,
						view: window,
					}),
				);

				await delay(1000);

				getUserShortcutCommands().then((commands) => {
					console.log("Received user shortcut commands", commands);
					setAllCommands(commands);
				});
			}

			if (data.name === "CHANGE_ELEMENT_TOOLBAR") {
				const newToolbarType = data.args?.[0]?.toolbarName || null;
				setToolbarType(newToolbarType);
			}

			if (data.name === "ELEMENT_TOOLBAR_SET_CURRENT_TOOL") {
				const currentTool = data.args?.[0];
				setCurrentTool(currentTool);
			}

			if (data.name === "ELEMENT_TOOLBAR_EXIT_CURRENT_TOOL") {
				setCurrentTool(null);
			}

			if (data.name === "DOCUMENT_UNLOADED") {
				setVisible(false);
			}
		}

		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, []);

	useEffect(() => {
		localStorage.setItem(LABEL_MODE_KEY, String(labelsVisible));
	}, [labelsVisible]);

	if (!visible) return null;

	const modeTools =
		allCommands.find((c) => c.tabType === toolbarType)?.commands ?? [];

	return (
		<Draggable
			nodeRef={nodeRef}
			handle=".os-pen-drag-handle"
			position={position}
			onDrag={(_, data) => {
				setPosition({ x: data.x, y: data.y });
			}}
			onStop={(_, data) => {
				const next = { x: data.x, y: data.y };
				setPosition(next);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			}}
		>
			<div
				ref={nodeRef}
				id="os-pen-shortcut-sidebar"
				className="fixed left-0 top-0 z-[999999] flex max-h-[80vh] flex-col rounded-md border bg-background/95 p-2 shadow-2xl backdrop-blur os-animate-in"
			>
				<div className="flex flex-col items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="os-pen-drag-handle h-10 w-10 shrink-0 cursor-pointer active:cursor-grabbing"
					>
						<GripHorizontal />
					</Button>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="h-10 w-10 shrink-0 cursor-pointer"
								onClick={() =>
									window.open(
										"https://cad.onshape.com/user/settings?minicontext=0",
										"_blank",
									)
								}
							>
								<Pencil />
							</Button>
						</TooltipTrigger>

						<TooltipContent side="right">
							<Card className="w-[350px]">
								<CardHeader>
									<CardTitle>Edit Shortcuts</CardTitle>
									<CardDescription>
										The dynamic items are based on your onshape mini toolbar
										items. Click the button to edit and then refresh the page to
										see the changes.
									</CardDescription>
								</CardHeader>
							</Card>
						</TooltipContent>
					</Tooltip>
				</div>

				<SidebarDivider />

				<div className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden">
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={toolbarType}
							className="flex min-h-0 w-full flex-1 flex-col items-center gap-1 overflow-y-auto px-1"
							initial={{ x: 28, opacity: 0, filter: "blur(4px)" }}
							animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
							exit={{ x: -28, opacity: 0, filter: "blur(4px)" }}
							transition={{
								type: "spring",
								stiffness: 420,
								damping: 36,
								mass: 0.8,
							}}
						>
							{modeTools.length === 0 && (
								<LoaderCircle className="my-2 h-6 w-6 animate-spin text-muted-foreground" />
							)}

							{modeTools.map((tool, index) => (
								<Tooltip key={tool.id}>
									<TooltipTrigger asChild>
										<MotionButton
											className="h-10 w-10 shrink-0 cursor-pointer"
											variant={
												tool.command === currentTool ? "secondary" : "outline"
											}
											initial={{ opacity: 0, x: 12, scale: 0.92 }}
											animate={{ opacity: 1, x: 0, scale: 1 }}
											transition={{
												delay: index * 0.025,
												type: "spring",
												stiffness: 520,
												damping: 32,
											}}
											whileTap={{ scale: 0.94 }}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();

												if (tool.command === currentTool) {
													pressKey("Escape", {
														code: "Escape",
														keyCode: 27,
														which: 27,
													});
													return;
												}

												executeOnshapeShortcutCommand(tool);
											}}
										>
											<OnshapeIcon icon={tool.icon!} className="h-5 w-5" />
										</MotionButton>
									</TooltipTrigger>

									<TooltipContent side="right">
										<Card className="w-[350px]">
											<CardHeader>
												<CardTitle>{capitalize(tool.command)}</CardTitle>
												<CardDescription>
													{capitalize(
														tool.expandedTooltipKey?.replace("tooltips:::", ""),
													)}
												</CardDescription>
											</CardHeader>
										</Card>
									</TooltipContent>
								</Tooltip>
							))}
						</motion.div>
					</AnimatePresence>
				</div>

				<SidebarDivider />

				<div className="flex flex-col items-center gap-1">
					{utilityActions.map((action) => {
						const Icon = action.icon;
						return (
							<Tooltip key={action.id}>
								<TooltipTrigger asChild>
									<Button
										className="h-10 w-10 cursor-pointer"
										variant="outline"
										size="icon"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											action.onClick();
										}}
									>
										<Icon className="h-5 w-5" />
									</Button>
								</TooltipTrigger>

								<TooltipContent side="right">
									<Card className="w-[260px]">
										<CardHeader>
											<CardTitle>{action.label}</CardTitle>
											<CardDescription>{action.description}</CardDescription>
										</CardHeader>
									</Card>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</div>
		</Draggable>
	);
}
