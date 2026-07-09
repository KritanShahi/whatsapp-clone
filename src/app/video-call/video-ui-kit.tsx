import { useEffect, useRef } from "react";
import { randomID } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export function getUrlParams(url = window.location.href) {
	let urlStr = url.split("?")[1];
	return new URLSearchParams(urlStr);
}

export default function VideoUIKit() {
	const roomID = getUrlParams().get("roomID") || randomID(5);
	const { user } = useClerk();
	const containerRef = useRef<HTMLDivElement>(null);
	const zpRef = useRef<any>(null);

	useEffect(() => {
		let active = true;

		const initMeeting = async () => {
			if (!user?.id || !containerRef.current) return;

			try {
				const res = await fetch(`/api/zegocloud?userID=${user.id}`);
				if (!res.ok) throw new Error("Failed to fetch token");
				
				const { token, appID } = await res.json();
				if (!active) return;

				const username = user.fullName || user.emailAddresses[0].emailAddress.split("@")[0];
				const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(appID, token, roomID, user.id, username);

				const zp = ZegoUIKitPrebuilt.create(kitToken);
				zpRef.current = zp;

				zp.joinRoom({
					container: containerRef.current,
					sharedLinks: [
						{
							name: "Personal link",
							url:
								window.location.protocol +
								"//" +
								window.location.host +
								window.location.pathname +
								"?roomID=" +
								roomID,
						},
					],
					scenario: {
						mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
					},
					turnOnCameraWhenJoining: true,
					turnOnMicrophoneWhenJoining: true,
					showMyCameraToggleButton: true,
					showMyMicrophoneToggleButton: true,
					showAudioVideoSettingsButton: true,
				});
			} catch (error) {
				console.error("Error setting up ZegoCloud room:", error);
			}
		};

		initMeeting();

		return () => {
			active = false;
			if (zpRef.current && typeof zpRef.current.destroy === "function") {
				zpRef.current.destroy();
			}
		};
	}, [user, roomID]);

	return <div className='myCallContainer' ref={containerRef} style={{ width: "100vw", height: "100vh" }}></div>;
}
