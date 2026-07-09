"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useConversationStore } from "@/store/chat-store";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const RightPanel = () => {
	const { selectedConversation, setSelectedConversation } = useConversationStore();
	const { isLoading, isAuthenticated } = useConvexAuth();

	const me = useQuery(api.users.getMe, isAuthenticated ? undefined : "skip");
	const sendTextMsg = useMutation(api.messages.sendTextMessage);

	if (isLoading) return null;
	if (!selectedConversation) return <ChatPlaceHolder />;

	const conversationName = selectedConversation.groupName || selectedConversation.name;
	const conversationImage = selectedConversation.groupImage || selectedConversation.image;

	const handleVideoCall = async () => {
		if (!selectedConversation || !me) return;
		const roomUrl = `${window.location.origin}/video-call?roomID=${selectedConversation._id}`;
		try {
			await sendTextMsg({
				content: `Join my video call: ${roomUrl}`,
				conversation: selectedConversation._id,
				sender: me._id,
			});
			window.open(roomUrl, "_blank");
		} catch (err: any) {
			console.error("Error starting video call:", err);
		}
	};

	return (
		<div className='w-3/4 flex flex-col'>
			<div className='w-full sticky top-0 z-50'>
				{/* Header */}
				<div className='flex justify-between bg-gray-primary p-3'>
					<div className='flex gap-3 items-center'>
						<Avatar>
							<AvatarImage src={conversationImage || "/placeholder.png"} className='object-cover' />
							<AvatarFallback>
								<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full' />
							</AvatarFallback>
						</Avatar>
						<div className='flex flex-col'>
							<p>{conversationName}</p>
							{selectedConversation.isGroup && (
								<GroupMembersDialog selectedConversation={selectedConversation} />
							)}
						</div>
					</div>

					<div className='flex items-center gap-7 mr-5'>
						<button onClick={handleVideoCall} className="hover:text-green-primary transition-colors">
							<Video size={23} />
						</button>
						<X size={16} className='cursor-pointer' onClick={() => setSelectedConversation(null)} />
					</div>
				</div>
			</div>
			{/* CHAT MESSAGES */}
			<MessageContainer />

			{/* INPUT */}
			<MessageInput />
		</div>
	);
};
export default RightPanel;