"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Phone, PhoneOff, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function CallNotification() {
	const conversations = useQuery(api.conversations.getMyConversations);
	const me = useQuery(api.users.getMe);
	
	const [activeCall, setActiveCall] = useState<{
		roomUrl: string;
		callerName: string;
		callerImage: string;
		messageId: string;
	} | null>(null);
	
	const [dismissedMsgIds, setDismissedMsgIds] = useState<string[]>([]);
	
	const audioCtxRef = useRef<AudioContext | null>(null);
	const ringIntervalRef = useRef<any>(null);

	// Ringtone player using Web Audio API
	const startRinging = () => {
		if (typeof window === "undefined") return;
		stopRinging();

		try {
			const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
			if (!AudioContextClass) return;

			const ctx = new AudioContextClass();
			audioCtxRef.current = ctx;

			const playBeeps = () => {
				if (ctx.state === "suspended") {
					ctx.resume().catch(() => {});
				}

				// Dual tone telephone ring simulation (440Hz + 480Hz)
				const osc1 = ctx.createOscillator();
				const osc2 = ctx.createOscillator();
				const gainNode = ctx.createGain();

				osc1.type = "sine";
				osc2.type = "sine";
				osc1.frequency.setValueAtTime(440, ctx.currentTime);
				osc2.frequency.setValueAtTime(480, ctx.currentTime);

				// Volume control curve (fade-in, sustain, fade-out)
				gainNode.gain.setValueAtTime(0, ctx.currentTime);
				gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
				gainNode.gain.setValueAtTime(0.12, ctx.currentTime + 1.2);
				gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.4);

				osc1.connect(gainNode);
				osc2.connect(gainNode);
				gainNode.connect(ctx.destination);

				osc1.start();
				osc2.start();

				// Clean up oscillators after beep finishes
				setTimeout(() => {
					try {
						osc1.stop();
						osc2.stop();
						osc1.disconnect();
						osc2.disconnect();
						gainNode.disconnect();
					} catch (e) {}
				}, 1500);
			};

			playBeeps();
			ringIntervalRef.current = setInterval(playBeeps, 3000);
		} catch (error) {
			console.error("Failed to start ringtone audio:", error);
		}
	};

	const stopRinging = () => {
		if (ringIntervalRef.current) {
			clearInterval(ringIntervalRef.current);
			ringIntervalRef.current = null;
		}
		if (audioCtxRef.current) {
			audioCtxRef.current.close().catch(() => {});
			audioCtxRef.current = null;
		}
	};

	// Detect new calls from conversations
	useEffect(() => {
		if (!conversations || !me) return;

		let foundCall = false;

		for (const conversation of conversations) {
			const msg = conversation.lastMessage;
			if (!msg) continue;

			const isCallMsg = msg.content.includes("video-call?roomID=");
			const isRecent = Date.now() - msg._creationTime < 45000; // 45 seconds window
			const isFromOther = msg.sender !== me._id;
			const isNotDismissed = !dismissedMsgIds.includes(msg._id);

			if (isCallMsg && isRecent && isFromOther && isNotDismissed) {
				const roomUrl = msg.content.match(/https?:\/\/[^\s]+/)?.[0] || msg.content;
				
				setActiveCall({
					roomUrl,
					callerName: conversation.name || conversation.groupName || "Someone",
					callerImage: conversation.image || conversation.groupImage || "/placeholder.png",
					messageId: msg._id,
				});
				foundCall = true;
				break;
			}
		}

		if (!foundCall) {
			setActiveCall(null);
		}
	}, [conversations, me, dismissedMsgIds]);

	// Manage audio based on active call state
	useEffect(() => {
		if (activeCall) {
			startRinging();
		} else {
			stopRinging();
		}
		return () => stopRinging();
	}, [activeCall]);

	const handleAccept = () => {
		if (!activeCall) return;
		window.open(activeCall.roomUrl, "_blank");
		setDismissedMsgIds((prev) => [...prev, activeCall.messageId]);
		setActiveCall(null);
	};

	const handleDecline = () => {
		if (!activeCall) return;
		setDismissedMsgIds((prev) => [...prev, activeCall.messageId]);
		setActiveCall(null);
	};

	if (!activeCall) return null;

	return (
		<div className="fixed top-5 right-5 z-[9999]">
			<div className="flex flex-col gap-4 p-4 rounded-2xl bg-gray-primary border border-gray-600 shadow-2xl min-w-[320px] backdrop-blur-md bg-opacity-95">
				{/* Header */}
				<div className="flex items-center gap-3.5">
					<Avatar className="h-12 w-12 border-2 border-green-primary">
						<AvatarImage src={activeCall.callerImage} className="object-cover" />
						<AvatarFallback>
							<div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-bold text-sm text-white">{activeCall.callerName}</span>
						<span className="text-xs text-green-primary flex items-center gap-1">
							<span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
							Incoming Video Call...
						</span>
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-3 w-full">
					<button
						onClick={handleDecline}
						className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 text-xs font-semibold shadow transition-all duration-200"
					>
						<PhoneOff size={16} />
						Decline
					</button>
					<button
						onClick={handleAccept}
						className="flex-1 flex items-center justify-center gap-2 bg-green-primary hover:bg-green-secondary text-white rounded-xl py-2.5 text-xs font-semibold shadow transition-all duration-200"
					>
						<Phone size={16} />
						Accept
					</button>
				</div>
			</div>
		</div>
	);
}
