"use client";

import { SignInButton } from "@clerk/nextjs";
import { MessageSquare, Bot, Video, Image as ImageIcon, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
	return (
		<div className='min-h-[calc(100vh-100px)] max-w-[1400px] mx-auto flex flex-col justify-between p-6 md:p-12 relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-950 via-[#111b21] to-[#0b141a] text-slate-100 shadow-2xl border border-teal-900/30'>
			{/* Decorative glowing gradient elements */}
			<div className='absolute top-0 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full filter blur-[80px] -z-10 animate-pulse' />
			<div className='absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full filter blur-[60px] -z-10' />

			{/* Navbar */}
			<header className='flex justify-between items-center w-full z-10 border-b border-teal-900/20 pb-6'>
				<div className='flex items-center gap-3'>
					<div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20'>
						<MessageSquare className='w-6 h-6 text-white' />
					</div>
					<div>
						<h1 className='text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent'>
							WhatsApp <span className='font-light text-teal-300'>AI</span>
						</h1>
						<p className='text-[10px] text-teal-400/80 tracking-widest uppercase font-semibold'>Real-time Web</p>
					</div>
				</div>
				<SignInButton mode='modal'>
					<button className='px-5 py-2.5 rounded-xl border border-teal-800/80 hover:border-teal-500 bg-teal-950/40 hover:bg-teal-950/80 text-teal-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-teal-500/5 cursor-pointer'>
						Sign In
					</button>
				</SignInButton>
			</header>

			{/* Main Hero Section */}
			<main className='flex flex-col lg:flex-row items-center justify-between gap-12 my-12 z-10'>
				<div className='flex flex-col gap-6 text-left max-w-xl'>
					<div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-800/40 w-fit'>
						<Sparkles className='w-4 h-4 text-emerald-400 animate-spin-slow' />
						<span className='text-xs font-semibold text-teal-300'>Next-Gen Chat Web Application</span>
					</div>
					<h2 className='text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white'>
						Connect instantly. <br />
						Chat with <span className='bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-200 bg-clip-text text-transparent'>Smart AI</span>.
					</h2>
					<p className='text-slate-400 text-base md:text-lg font-light leading-relaxed'>
						Experience a beautifully crafted WhatsApp Web replica featuring instant real-time messaging, group communication, rich media sharing, peer-to-peer HD calling, and custom integrations with OpenAI GPT and DALL-E.
					</p>

					<div className='flex flex-col sm:flex-row gap-4 mt-4'>
						<SignInButton mode='modal'>
							<button className='px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold transition-all duration-300 ease-in-out shadow-lg shadow-teal-500/20 hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer'>
								Open Web App
								<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
							</button>
						</SignInButton>
					</div>
				</div>

				{/* Visual Features Board */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full'>
					{/* Card 1 */}
					<div className='p-6 rounded-2xl border border-teal-900/30 bg-teal-950/20 backdrop-blur-md hover:border-teal-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-teal-500/5'>
						<div className='w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-teal-950 transition-colors duration-300'>
							<MessageSquare className='w-6 h-6' />
						</div>
						<h3 className='text-lg font-bold text-white mb-2'>Real-time Chats</h3>
						<p className='text-sm text-slate-400 leading-relaxed font-light'>
							Sub-millisecond query replication powered by Convex. Send texts, images, and videos with instant reactivity.
						</p>
					</div>

					{/* Card 2 */}
					<div className='p-6 rounded-2xl border border-teal-900/30 bg-teal-950/20 backdrop-blur-md hover:border-teal-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-teal-500/5'>
						<div className='w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-teal-950 transition-colors duration-300'>
							<Bot className='w-6 h-6' />
						</div>
						<h3 className='text-lg font-bold text-white mb-2'>AI Bots integration</h3>
						<p className='text-sm text-slate-400 leading-relaxed font-light'>
							Call OpenAI GPT using <code className='text-emerald-400 bg-teal-950 px-1 py-0.5 rounded'>@gpt</code> to query answers, or <code className='text-emerald-400 bg-teal-950 px-1 py-0.5 rounded'>@dall-e</code> to paint AI graphics directly in chats.
						</p>
					</div>

					{/* Card 3 */}
					<div className='p-6 rounded-2xl border border-teal-900/30 bg-teal-950/20 backdrop-blur-md hover:border-teal-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-teal-500/5'>
						<div className='w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-teal-950 transition-colors duration-300'>
							<Video className='w-6 h-6' />
						</div>
						<h3 className='text-lg font-bold text-white mb-2'>Peer Calling</h3>
						<p className='text-sm text-slate-400 leading-relaxed font-light'>
							High-quality voice and video calls powered by ZegoCloud. Start secure meetings directly inside chat channels.
						</p>
					</div>

					{/* Card 4 */}
					<div className='p-6 rounded-2xl border border-teal-900/30 bg-teal-950/20 backdrop-blur-md hover:border-teal-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-teal-500/5'>
						<div className='w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-teal-950 transition-colors duration-300'>
							<ImageIcon className='w-6 h-6' />
						</div>
						<h3 className='text-lg font-bold text-white mb-2'>Media Uploads</h3>
						<p className='text-sm text-slate-400 leading-relaxed font-light'>
							Send rich media assets instantly. Upload files securely to Convex Storage buckets and render player viewports directly.
						</p>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className='border-t border-teal-900/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 z-10 w-full'>
				<p>© {new Date().getFullYear()} WhatsApp AI. All rights reserved.</p>
				<div className='flex gap-6'>
					<a href='#' className='hover:text-teal-400 transition-colors'>Privacy Policy</a>
					<a href='#' className='hover:text-teal-400 transition-colors'>Terms of Service</a>
				</div>
			</footer>
		</div>
	);
}
