import { AnimatedBubbles } from "./AnimatedBg";
import { FiLoader } from "react-icons/fi";

export default function Loading() {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg)] z-50">
			<AnimatedBubbles />

			<div className="relative z-10">
				<FiLoader className="w-12 h-12 text-[var(--color-main)] animate-spin" />
			</div>
		</div>
	);
}