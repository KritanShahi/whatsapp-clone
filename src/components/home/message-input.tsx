import { Laugh, Mic, Plus, Send, Trash, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import toast from "react-hot-toast";
import useComponentVisible from "@/hooks/useComponentVisible";
import EmojiPicker, { Theme } from "emoji-picker-react";
import MediaDropdown from "./media-dropdown";

const MessageInput = () => {
	const [msgText, setMsgText] = useState("");
	const { selectedConversation } = useConversationStore();
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	const me = useQuery(api.users.getMe);
	const sendTextMsg = useMutation(api.messages.sendTextMessage);
	
	// Voice message mutations
	const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
	const sendAudio = useMutation(api.messages.sendAudio);

	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const shouldSendRef = useRef(true);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;
			audioChunksRef.current = [];
			shouldSendRef.current = true;

			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (e) => {
				if (e.data && e.data.size > 0) {
					audioChunksRef.current.push(e.data);
				}
			};

			mediaRecorder.onstop = async () => {
				// Stop the tracks to release the microphone
				if (streamRef.current) {
					streamRef.current.getTracks().forEach((track) => track.stop());
					streamRef.current = null;
				}

				if (!shouldSendRef.current) {
					// Discarded
					setIsRecording(false);
					setRecordingTime(0);
					return;
				}

				const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
				setIsUploading(true);

				try {
					const postUrl = await generateUploadUrl();
					const result = await fetch(postUrl, {
						method: "POST",
						headers: { "Content-Type": "audio/webm" },
						body: audioBlob,
					});

					if (!result.ok) throw new Error("Upload failed");

					const { storageId } = await result.json();

					await sendAudio({
						audioId: storageId,
						conversation: selectedConversation!._id,
						sender: me!._id,
					});

					toast.success("Voice message sent!");
				} catch (err: any) {
					toast.error("Failed to send voice message");
					console.error(err);
				} finally {
					setIsUploading(false);
					setIsRecording(false);
					setRecordingTime(0);
				}
			};

			setIsRecording(true);
			setRecordingTime(0);
			mediaRecorder.start();

			intervalRef.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);

		} catch (err: any) {
			toast.error("Microphone access denied or error occurred");
			console.error(err);
		}
	};

	const stopAndSendRecording = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		shouldSendRef.current = true;
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
		}
	};

	const cancelRecording = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		shouldSendRef.current = false;
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
		} else {
			// Fallback in case recorder wasn't fully initialized
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}
			setIsRecording(false);
			setRecordingTime(0);
		}
	};

	// Clean up interval on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	const handleSendTextMsg = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!msgText.trim()) return;
		try {
			await sendTextMsg({ content: msgText, conversation: selectedConversation!._id, sender: me!._id });
			setMsgText("");
		} catch (err: any) {
			toast.error(err.message);
			console.error(err);
		}
	};

	const formatRecordingTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className='bg-gray-primary p-2 flex gap-4 items-center'>
			{!isRecording ? (
				<>
					<div className='relative flex gap-2 ml-2'>
						{/* EMOJI PICKER */}
						<div ref={ref} onClick={() => setIsComponentVisible(true)}>
							{isComponentVisible && (
								<EmojiPicker
									theme={Theme.DARK}
									onEmojiClick={(emojiObject) => {
										setMsgText((prev) => prev + emojiObject.emoji);
									}}
									style={{ position: "absolute", bottom: "1.5rem", left: "1rem", zIndex: 50 }}
								/>
							)}
							<Laugh className='text-gray-600 dark:text-gray-400 cursor-pointer' />
						</div>
						<MediaDropdown />
					</div>
					<form onSubmit={handleSendTextMsg} className='w-full flex gap-3'>
						<div className='flex-1'>
							<Input
								type='text'
								placeholder='Type a message'
								className='py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent'
								value={msgText}
								onChange={(e) => setMsgText(e.target.value)}
							/>
						</div>
						<div className='mr-4 flex items-center gap-3'>
							{msgText.length > 0 ? (
								<Button
									type='submit'
									size={"sm"}
									className='bg-transparent text-foreground hover:bg-transparent'
								>
									<Send />
								</Button>
							) : (
								<Button
									type='button'
									onClick={startRecording}
									size={"sm"}
									className='bg-transparent text-foreground hover:bg-transparent'
								>
									<Mic />
								</Button>
							)}
						</div>
					</form>
				</>
			) : (
				<div className='flex-1 flex items-center justify-between px-4 py-1.5 bg-gray-tertiary rounded-lg mr-4 ml-2 gap-4'>
					<button onClick={cancelRecording} className='text-gray-500 hover:text-red-500 transition shrink-0'>
						<Trash size={20} />
					</button>

					<div className='flex items-center gap-2 flex-1 justify-center'>
						<div className='w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse' />
						<span className='text-xs font-mono text-foreground'>
							Recording {formatRecordingTime(recordingTime)}
						</span>
					</div>

					<button 
						onClick={stopAndSendRecording} 
						disabled={isUploading}
						className='text-green-primary hover:text-green-secondary transition shrink-0 disabled:opacity-50'
					>
						{isUploading ? <Loader2 className='animate-spin' size={20} /> : <Send size={20} />}
					</button>
				</div>
			)}
		</div>
	);
};

export default MessageInput;