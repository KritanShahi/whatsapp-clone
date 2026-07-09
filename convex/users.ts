import { ConvexError, v } from "convex/values";
import { internalMutation, query, mutation } from "./_generated/server";

export const createUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		email: v.string(),
		name: v.string(),
		image: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("users", {
			tokenIdentifier: args.tokenIdentifier,
			email: args.email,
			name: args.name,
			image: args.image,
			isOnline: true,
		});
	},
});

export const updateUser = internalMutation({
	args: { tokenIdentifier: v.string(), image: v.string() },
	async handler(ctx, args) {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, {
			image: args.image,
		});
	},
});

export const setUserOnline = internalMutation({
	args: { tokenIdentifier: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, { isOnline: true });
	},
});

export const setUserOffline = internalMutation({
	args: { tokenIdentifier: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, { isOnline: false });
	},
});

export const getUsers = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const users = await ctx.db.query("users").collect();
		return users.filter((user) => user.tokenIdentifier !== identity.tokenIdentifier);
	},
});

export const getMe = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) {
			return null;
		}

		return user;
	},
});

export const getGroupMembers = query({
	args: { conversationId: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const conversation = await ctx.db
			.query("conversations")
			.filter((q) => q.eq(q.field("_id"), args.conversationId))
			.first();
		if (!conversation) {
			throw new ConvexError("Conversation not found");
		}

		const users = await ctx.db.query("users").collect();
		const groupMembers = users.filter((user) => conversation.participants.includes(user._id));

		return groupMembers;
	},
});

export const syncUserAndSeed = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		let user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) {
			const newUserId = await ctx.db.insert("users", {
				tokenIdentifier: identity.tokenIdentifier,
				email: identity.email || "guest@example.com",
				name: identity.name || "Guest User",
				image: identity.pictureUrl || "https://avatar.iran.liara.run/public/11",
				isOnline: true,
			});
			user = await ctx.db.get(newUserId);
		} else {
			await ctx.db.patch(user._id, {
				isOnline: true,
				name: identity.name || user.name,
				image: identity.pictureUrl || user.image,
			});
		}

		const demoUsers = [
			{
				name: "ChatGPT (AI)",
				email: "chatgpt@openai.com",
				image: "/gpt.png",
				tokenIdentifier: "demo-user-token-chatgpt",
				isOnline: true,
			},
			{
				name: "Elon Musk",
				email: "elon@tesla.com",
				image: "/elon.jpg",
				tokenIdentifier: "demo-user-token-elon",
				isOnline: true,
			},
			{
				name: "Steve Jobs",
				email: "steve@apple.com",
				image: "/steve.jpg",
				tokenIdentifier: "demo-user-token-steve",
				isOnline: false,
			},
			{
				name: "Bill Gates",
				email: "bill@microsoft.com",
				image: "/bill.jpg",
				tokenIdentifier: "demo-user-token-bill",
				isOnline: true,
			}
		];

		for (const u of demoUsers) {
			const existing = await ctx.db
				.query("users")
				.filter((q) => q.eq(q.field("tokenIdentifier"), u.tokenIdentifier))
				.first();
			if (existing) {
				await ctx.db.patch(existing._id, {
					image: u.image,
					name: u.name,
					email: u.email,
				});
			} else {
				await ctx.db.insert("users", u);
			}
		}

		return user;
	},
});
