import { Switch as SwitchPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
	className,
	size = "default",
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
	size?: "sm" | "default";
}) {
	const thumbSizeClass = size === "sm" ? "size-3" : "size-4";

	const thumbTransform =
		size === "sm"
			? {
					"--switch-thumb-unchecked": "1px",
					"--switch-thumb-checked": "11px",
				}
			: {
					"--switch-thumb-unchecked": "1px",
					"--switch-thumb-checked": "15px",
				};

	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			data-size={size}
			className={cn(
				"peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all outline-none",
				"after:absolute after:-inset-x-3 after:-inset-y-2",
				"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
				"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
				"dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",

				// size
				size === "default" && "h-[18.4px] w-[32px]",
				size === "sm" && "h-[14px] w-[24px]",

				// colors
				"data-[state=checked]:bg-primary",
				"data-[state=unchecked]:bg-input",
				"dark:data-[state=unchecked]:bg-input/80",

				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"pointer-events-none block rounded-full bg-background ring-0 transition-transform duration-200",
					thumbSizeClass,
					"data-[state=checked]:bg-background",
					"dark:data-[state=checked]:bg-primary-foreground",
					"dark:data-[state=unchecked]:bg-foreground",
				)}
				style={{
					...thumbTransform,
					transform:
						props.checked === true
							? "translateX(var(--switch-thumb-checked))"
							: "translateX(var(--switch-thumb-unchecked))",
				}}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
