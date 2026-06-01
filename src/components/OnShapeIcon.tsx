type OnshapeIconProps = {
	icon: string;
	className?: string;
};

export function OnshapeIcon({ icon, className }: OnshapeIconProps) {
	const iconId = icon.startsWith("svg-icon-") ? icon : `svg-icon-${icon}`;

	return (
		<svg className={className ?? "os-svg-icon"} aria-hidden="true">
			<use xlinkHref={`#${iconId}`} />
		</svg>
	);
}
