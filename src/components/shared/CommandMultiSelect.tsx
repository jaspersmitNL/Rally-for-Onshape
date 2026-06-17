import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type CommandMultiSelectOption = {
	id: string;
	label: string;
	description?: string;
};

type CommandMultiSelectProps = {
	value: string[];
	options: CommandMultiSelectOption[];
	onChange: (value: string[]) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	maxSelected?: number;
	maxSelectedMessage?: string;
	triggerClassName?: string;
	contentClassName?: string;
};

function getSelectedSummary(
	value: string[],
	optionsById: Record<string, CommandMultiSelectOption | undefined>,
	placeholder: string,
) {
	if (value.length === 0) {
		return placeholder;
	}

	if (value.length <= 2) {
		return value.map((id) => optionsById[id]?.label ?? id).join(", ");
	}

	return `${value.length} selected`;
}

export function CommandMultiSelect({
	value,
	options,
	onChange,
	placeholder = "Select items",
	searchPlaceholder = "Search...",
	emptyMessage = "No items found.",
	maxSelected,
	maxSelectedMessage,
	triggerClassName,
	contentClassName,
}: CommandMultiSelectProps) {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const optionsById = useMemo(
		() =>
			Object.fromEntries(
				options.map((option) => [option.id, option]),
			) as Record<string, CommandMultiSelectOption | undefined>,
		[options],
	);

	const selectedOptions = options.filter((option) => value.includes(option.id));

	const selectedSummary = getSelectedSummary(value, optionsById, placeholder);

	const toggleValue = (id: string) => {
		if (value.includes(id)) {
			onChange(value.filter((valueId) => valueId !== id));
			return;
		}

		if (maxSelected && value.length >= maxSelected) {
			return;
		}

		onChange([...value, id]);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					role="combobox"
					aria-expanded={open}
					className={cn(
						`
						w-[150px] justify-between rounded-lg border border-white/10
						bg-white/[0.045] px-3 text-left text-xs font-medium text-slate-200
						hover:bg-white/10 hover:text-white
					`,
						triggerClassName,
					)}
				>
					<span className="min-w-0 truncate">{selectedSummary}</span>

					<ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align="start"
				className={cn(
					`
					w-96 border-white/10 bg-slate-950/95 p-0 text-white
					shadow-2xl backdrop-blur-xl
				`,
					contentClassName,
				)}
			>
				<Command className="bg-transparent">
					<CommandInput
						placeholder={searchPlaceholder}
						className="h-9 text-xs"
						value={searchValue}
						onValueChange={setSearchValue}
					/>

					{maxSelected && (
						<div className="border-b border-white/10 px-3 py-2 text-[11px] text-slate-400">
							{maxSelectedMessage ?? `Select up to ${maxSelected} items.`}
						</div>
					)}

					<CommandList className="max-h-[220px] overflow-y-auto overscroll-contain">
						<CommandEmpty>{emptyMessage}</CommandEmpty>

						{searchValue.length === 0 && selectedOptions.length > 0 && (
							<CommandGroup heading="Selected">
								{selectedOptions.map((option) => (
									<CommandItem
										key={`selected-${option.id}`}
										value={`selected-${option.label} ${option.id}`}
										onSelect={() => toggleValue(option.id)}
									>
										<Check className="mr-2 h-3 w-3 text-blue-200" />
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						)}

						<CommandGroup heading="All">
							{options.map((option) => {
								const isSelected = value.includes(option.id);
								const disableSelection =
									!!maxSelected && value.length >= maxSelected && !isSelected;

								return (
									<CommandItem
										key={option.id}
										value={`${option.label} ${option.id}`}
										onSelect={() => toggleValue(option.id)}
										disabled={disableSelection}
									>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-white/15",
												isSelected
													? "bg-blue-500/25 text-blue-100"
													: "text-transparent",
											)}
										>
											<Check className="h-3 w-3" />
										</div>

										<div className="min-w-0">
											<div className="truncate">{option.label}</div>

											{option.description && (
												<div className="truncate text-[11px] text-slate-400">
													{option.description}
												</div>
											)}
										</div>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
