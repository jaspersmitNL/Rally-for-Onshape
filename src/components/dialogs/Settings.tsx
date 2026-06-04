import { Code, Coffee, MessageCircle, Pencil, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { EDIT_SHORTCUT_ITEMS_URL } from "@/constants/onshape";
import {
	BUY_ME_A_COFFEE_URL,
	DISCORD_LINK,
	GITHUB_URL,
} from "@/constants/social";
import { useSettingsDialog } from "@/contexts/SettingsDialogContext";

const links = [
	{
		label: "Discord",
		description: "Join the community, report bugs, and request features.",
		icon: MessageCircle,
		href: DISCORD_LINK,
	},
	{
		label: "GitHub",
		description: "View the source code, open issues, or contribute.",
		icon: Code,
		href: GITHUB_URL,
	},
	{
		label: "Buy Me a Coffee",
		description: "Support development of Onshape Plus.",
		icon: Coffee,
		href: BUY_ME_A_COFFEE_URL,
	},
	{
		label: "Edit Quick Menu Actions",
		description: "Customize the Onshape shortcut menu used by Onshape Plus.",
		icon: Pencil,
		href: EDIT_SHORTCUT_ITEMS_URL,
	},
];

export function SettingsDialog() {
	const { isSettingsOpen, setSettingsOpen } = useSettingsDialog();
	return (
		<Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
			<DialogContent
				className="
					max-w-[420px] overflow-hidden rounded-2xl
					border border-white/10
					bg-gradient-to-b from-slate-900/95 via-slate-950/92 to-black/90
					p-0 text-white
					shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]
					backdrop-blur-xl
				"
			>
				<div className="relative">
					<div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/5 via-white/[0.015] to-transparent" />

					<div className="relative z-10 p-5">
						<DialogHeader>
							<DialogTitle className="text-lg font-semibold">
								Onshape Plus
							</DialogTitle>
							<DialogDescription className="text-sm text-slate-300">
								Links, support, and quick menu configuration.
							</DialogDescription>
						</DialogHeader>

						<div className="mt-5 grid gap-2">
							{links.map((item) => {
								const Icon = item.icon;

								return (
									<button
										key={item.label}
										type="button"
										className="
											group flex w-full cursor-pointer items-center gap-3 rounded-xl
											border border-white/10 bg-white/[0.045] p-3 text-left
											shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
											transition-all duration-150
											hover:border-white/15 hover:bg-white/[0.075]
											active:scale-[0.985]
										"
										onClick={() => window.open(item.href, "_blank")}
									>
										<div
											className="
												flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
												border border-white/10 bg-white/[0.06]
												text-blue-300
												group-hover:bg-blue-500/15 group-hover:text-blue-200
											"
										>
											<Icon className="h-5 w-5" />
										</div>

										<div className="min-w-0">
											<div className="text-sm font-medium text-slate-100">
												{item.label}
											</div>
											<div className="mt-0.5 text-xs leading-snug text-slate-300">
												{item.description}
											</div>
										</div>
									</button>
								);
							})}
						</div>

						<div className="mt-5 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-xs leading-relaxed text-slate-300">
							Onshape Plus is free and open source. Thanks for trying it.
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
