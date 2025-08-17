import { useState } from "react";
import { signUp } from "../api/auth.js";
import {
	FiUser,
	FiCopy,
	FiCheck,
	FiKey,
	FiLock,
	FiShield,
	FiAlertTriangle,
} from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { AnimatedBubbles } from "../components/AnimatedBg.jsx";

export default function Register() {
	const [error, setError] = useState(null);
	const [user, setUser] = useState(null);
	const [showPopup, setShowPopup] = useState(false);
	const [copiedKey, setCopiedKey] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSignUp = async () => {
		setIsLoading(true);
		try {
			const response = await signUp();
			setUser(response.user);
			setShowPopup(true);
		} catch (err) {
			setError(err?.response?.message || "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="h-screen flex items-center justify-center p-4 relative overflow-hidden">
			{/* Animated Gradient Background */}
			<AnimatedBubbles />

			{/* Main Card */}
			<div className="bg-[var(--color-surface)] shadow-lg rounded-2xl p-8 w-full max-w-md lg:max-w-lg xl:max-w-xl border border-[var(--color-border)] transition-all duration-300 hover:shadow-xl relative z-10 backdrop-blur-sm bg-opacity-90">
				<div className="flex justify-center mb-6">
					<div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[var(--color-main-bg)] flex items-center justify-center text-[var(--color-main)]">
						<FiUser size={36} className="lg:w-10 lg:h-10" />
					</div>
				</div>
				<h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-2 text-center">
					Join Our Platform
				</h1>
				<p className="text-[var(--color-text-light)] mb-8 text-center text-lg lg:text-xl">
					Create your secure account in seconds
				</p>
				<button
					onClick={handleSignUp}
					disabled={isLoading}
					className={`w-full py-4 lg:py-5 rounded-xl bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-[var(--color-text-inverse)] font-semibold hover:from-[var(--color-main-hover)] hover:to-[var(--color-main)] transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 text-lg ${
						isLoading ? "opacity-80 cursor-not-allowed" : ""
					}`}
				>
					{isLoading ? (
						<>
							<ImSpinner8 className="animate-spin" size={20} /> Creating
							Account...
						</>
					) : (
						<>
							<FiKey size={20} /> Get Started Now
						</>
					)}
				</button>
				{error && (
					<div className="mt-4 p-3 bg-[var(--color-error-bg)] rounded-lg border border-[var(--color-error)]/30 flex items-center gap-2">
						<div className="text-[var(--color-error)]">
							<FiLock size={18} />
						</div>
						<p className="text-[var(--color-error)] font-medium text-sm lg:text-base">
							{error}
						</p>
					</div>
				)}

				<div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
					<div className="flex items-center text-[var(--color-text-light)]">
						<FiShield className="mr-2 text-[var(--color-main)]" />
						<span className="text-sm">Powered by</span>
					</div>
					<div className="text-sm text-[var(--color-text-light)]">
						<span className="font-medium">AhmedEhab</span>
					</div>
				</div>
			</div>

			{/* Popup Modal */}
			{showPopup && user && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 p-4 animate-fade-in">
					<div className="bg-[var(--color-surface)] rounded-xl shadow-xl p-6 w-full max-w-md border border-[var(--color-border)] relative">
						{/* Header */}
						<div className="flex flex-col items-center mb-6">
							<div className="w-14 h-14 rounded-full bg-[var(--color-main-bg)] flex items-center justify-center text-[var(--color-main)] mb-3">
								<FiShield size={28} />
							</div>
							<h2 className="text-2xl font-bold text-[var(--color-text)] text-center">
								Your Security Keys
							</h2>
						</div>

						{/* Keys section - Modern input style */}
						<div className="space-y-6 mb-8">
							{/* Public Key */}
							<div className="group">
								<div className="flex items-center justify-between mb-3">
									<span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-light)]">
										Public Key
									</span>
									<button
										onClick={() => {
											navigator.clipboard.writeText(user.publicKey);
											setCopiedKey("public");
										}}
										className="text-xs flex items-center gap-1 text-[var(--color-main)] hover:text-[var(--color-main-hover)] transition-colors"
									>
										{copiedKey === "public" ? (
											<>
												<FiCheck
													className="text-[var(--color-success)]"
													size={14}
												/>
												<span>Copied!</span>
											</>
										) : (
											<>
												<FiCopy size={14} />
												<span>Copy</span>
											</>
										)}
									</button>
								</div>
								<div
									onClick={() => {
										navigator.clipboard.writeText(user.publicKey);
										setCopiedKey("public");
									}}
									className="w-full p-4 bg-[var(--color-bg)] rounded-xl text-sm font-mono cursor-pointer transition-all hover:bg-[var(--color-main-bg)]/30 relative overflow-hidden"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-main-bg)]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<div className="relative break-all pr-6">
										{user.publicKey}
									</div>
								</div>
							</div>

							{/* Private Key - More emphasized */}
							<div className="group">
								<div className="flex items-center justify-between mb-3">
									<span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-light)]">
										Private Key
									</span>
									<button
										onClick={() => {
											navigator.clipboard.writeText(user.privateKey);
											setCopiedKey("private");
										}}
										className="text-xs flex items-center gap-1 text-[var(--color-main)] hover:text-[var(--color-main-hover)] transition-colors"
									>
										{copiedKey === "private" ? (
											<>
												<FiCheck
													className="text-[var(--color-success)]"
													size={14}
												/>
												<span>Copied!</span>
											</>
										) : (
											<>
												<FiCopy size={14} />
												<span>Copy</span>
											</>
										)}
									</button>
								</div>
								<div
									onClick={() => {
										navigator.clipboard.writeText(user.privateKey);
										setCopiedKey("private");
									}}
									className="w-full p-4 bg-[var(--color-bg)] rounded-xl text-sm font-mono cursor-pointer transition-all hover:bg-[var(--color-main-bg)]/30 relative overflow-hidden"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-main-bg)]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<div className="relative break-all pr-6 text-[var(--color-main)] font-medium">
										{user.privateKey}
									</div>
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-main)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
								</div>
							</div>
						</div>

						{/* Concise warning */}
						<div className="bg-[var(--color-warning-bg)] rounded-lg p-3 mb-6">
							<p className="text-xs font-medium text-[var(--color-warning)] flex items-center gap-2">
								<FiAlertTriangle size={14} />
								Save private key now - it cannot be recovered!
							</p>
						</div>

						{/* Action button */}
						<button
							onClick={() => setShowPopup(false)}
							className="w-full py-3 bg-[var(--color-main)] text-white rounded-lg hover:bg-[var(--color-main-hover)] transition-all font-medium flex items-center justify-center gap-2"
						>
							<FiCheck size={18} /> I've saved my keys
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
