import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "*.convex.cloud" },
			{ hostname: "oaidalleapiprodscus.blob.core.windows.net" },
			{ hostname: "images.unsplash.com" },
			{ hostname: "avatars.githubusercontent.com" },
			{ hostname: "upload.wikimedia.org" },
			{ hostname: "randomuser.me" },
			{ hostname: "avatar.iran.liara.run" },
			{ hostname: "img.clerk.com" },
		],
	},
	transpilePackages: ["@zegocloud/zego-uikit-prebuilt"],
};

export default nextConfig;
