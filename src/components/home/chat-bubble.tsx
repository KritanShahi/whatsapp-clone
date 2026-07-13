import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chat-store";
import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import ReactPlayer from "react-player";
import ChatAvatarActions from "./chat-avatar-actions";
import { Bot, Video, Play, Pause, Mic } from "lucide-react";

type ChatBubbleProps = {
	message: IMessage;
	me: any;
	previousMessage?: IMessage;
};

const ChatBubble = ({ me, message, previousMessage }: ChatBubbleProps) => {
	const date = new Date(message._creationTime);
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	const time = `${hour}:${minute}`;

	const { selectedConversation } = useConversationStore();
	const isMember = selectedConversation?.participants.includes(message.sender?._id) || false;
	const isGroup = selectedConversation?.isGroup;
	const fromMe = message.sender?._id === me._id;
	const fromAI = message.sender?.name === "ChatGPT";
	const bgClass = fromMe ? "bg-green-chat" : !fromAI ? "bg-white dark:bg-gray-primary" : "bg-blue-500 text-white";

	console.log(message.sender);
	const [open, setOpen] = useState(false);

	const renderMessageContent = () => {
		switch (message.messageType) {
			case "text":
				return <TextMessage message={message} />;
			case "image":
				return <ImageMessage message={message} handleClick={() => setOpen(true)} />;
			case "video":
				return <VideoMessage message={message} />;
			case "audio":
				return <AudioMessage message={message} />;
			default:
				return null;
		}
	};

	if (!fromMe) {
		return (
			<>
				<DateIndicator message={message} previousMessage={previousMessage} />
				<div className='flex gap-1 w-2/3'>
					<ChatBubbleAvatar isGroup={isGroup} isMember={isMember} message={message} fromAI={fromAI} />
					<div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
						{!fromAI && <OtherMessageIndicator />}
						{fromAI && <Bot size={16} className='absolute bottom-[2px] left-2' />}
						{<ChatAvatarActions message={message} me={me} />}
						{renderMessageContent()}
						{open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
						<MessageTime time={time} fromMe={fromMe} />
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<DateIndicator message={message} previousMessage={previousMessage} />

			<div className='flex gap-1 w-2/3 ml-auto'>
				<div className={`flex  z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}>
					<SelfMessageIndicator />
					{renderMessageContent()}
					{open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
					<MessageTime time={time} fromMe={fromMe} />
				</div>
			</div>
		</>
	);
};
export default ChatBubble;

const VideoMessage = ({ message }: { message: IMessage }) => {
	return <ReactPlayer url={message.content} width='250px' height='250px' controls={true} light={true} />;
};

const ImageMessage = ({ message, handleClick }: { message: IMessage; handleClick: () => void }) => {
	return (
		<div className='w-[250px] h-[250px] m-2 relative'>
			<Image
				src={message.content}
				fill
				className='cursor-pointer object-cover rounded'
				alt='image'
				onClick={handleClick}
			/>
		</div>
	);
};

const ImageDialog = ({ src, onClose, open }: { open: boolean; src: string; onClose: () => void }) => {
	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className='min-w-[750px]'>
				<DialogTitle className='sr-only'>Image Preview</DialogTitle>
				<DialogDescription className='relative h-[450px] flex justify-center'>
					<Image src={src} fill className='rounded-lg object-contain' alt='image' />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
	return (
		<p className='text-[10px] mt-2 self-end flex gap-1 items-center'>
			{time} {fromMe && <MessageSeenSvg />}
		</p>
	);
};

const OtherMessageIndicator = () => (
	<div className='absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full' />
);

const SelfMessageIndicator = () => (
	<div className='absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden' />
);

const TextMessage = ({ message }: { message: IMessage }) => {
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL
	const isVideoCall = message.content.includes("video-call?roomID=");

	if (isVideoCall) {
		const roomUrl = message.content.match(/https?:\/\/[^\s]+/)?.[0] || message.content;
		return (
			<div className='flex flex-col gap-2.5 p-3 rounded-lg bg-gray-tertiary border border-gray-600 my-1 max-w-[280px]'>
				<div className='flex items-center gap-2.5'>
					<div className='p-2 bg-green-primary rounded-full text-white animate-pulse'>
						<Video size={18} />
					</div>
					<div className='flex flex-col'>
						<span className='font-bold text-sm text-white'>Video Call</span>
						<span className='text-[10px] text-gray-400'>Tap to join the call room</span>
					</div>
				</div>
				<a
					href={roomUrl}
					target='_blank'
					rel='noopener noreferrer'
					className='w-full text-center block bg-green-primary hover:bg-green-secondary text-white font-medium py-1.5 px-4 rounded text-xs transition-colors mt-1 shadow-sm'
				>
					Join Call
				</a>
			</div>
		);
	}

	return (
		<div>
			{isLink ? (
				<a
					href={message.content}
					target='_blank'
					rel='noopener noreferrer'
					className={`mr-2 text-sm font-light text-blue-400 underline`}
				>
					{message.content}
				</a>
			) : (
				<p className={`mr-2 text-sm font-light`}>{message.content}</p>
			)}
		</div>
	);
};

const AudioMessage = ({ message }: { message: IMessage }) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [playbackRate, setPlaybackRate] = useState(1);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime);
		};

		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
		};

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("ended", handleEnded);

		// If duration is already loaded
		if (audio.duration) {
			setDuration(audio.duration);
		}

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("ended", handleEnded);
		};
	}, []);

	const togglePlayPause = () => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
			setIsPlaying(false);
		} else {
			audio.play().catch((err) => console.error("Playback failed:", err));
			setIsPlaying(true);
		}
	};

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const audio = audioRef.current;
		if (!audio) return;
		const newTime = parseFloat(e.target.value);
		audio.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const togglePlaybackRate = () => {
		const audio = audioRef.current;
		if (!audio) return;
		let newRate = 1;
		if (playbackRate === 1) newRate = 1.5;
		else if (playbackRate === 1.5) newRate = 2;
		else newRate = 1;

		audio.playbackRate = newRate;
		setPlaybackRate(newRate);
	};

	const formatTime = (time: number) => {
		if (isNaN(time)) return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className='flex items-center gap-3 p-1.5 rounded-md bg-transparent max-w-[280px] w-[280px]'>
			<audio ref={audioRef} src={message.content} preload='metadata' />
			
			<button 
				onClick={togglePlayPause} 
				className='flex items-center justify-center w-9 h-9 rounded-full bg-green-primary hover:bg-green-secondary text-white transition shadow-sm shrink-0'
			>
				{isPlaying ? <Pause size={16} fill='currentColor' /> : <Play size={16} className='ml-0.5' fill='currentColor' />}
			</button>

			<div className='flex flex-col flex-1 min-w-0'>
				<input
					type='range'
					min={0}
					max={duration || 100}
					value={currentTime}
					onChange={handleSeek}
					className='w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-primary'
				/>
				
				<div className='flex justify-between items-center mt-1 text-[10px] text-gray-500 dark:text-gray-400'>
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>

			<div className='flex flex-col items-center gap-1 shrink-0'>
				<button 
					onClick={togglePlaybackRate} 
					className='text-[9px] font-bold px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition'
				>
					{playbackRate}x
				</button>
				<Mic size={12} className='text-green-primary' />
			</div>
		</div>
	);
};