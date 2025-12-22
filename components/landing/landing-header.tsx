"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

const navLinks = [
	{ href: "#features", label: "Funcionalidades" },
	{ href: "#benefits", label: "Benefícios" },
	{ href: "#testimonials", label: "Depoimentos" },
	{ href: "#pricing", label: "Preços" },
]

export function LandingHeader() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 20)
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", isMobileMenuOpen)
		return () => document.body.classList.remove("overflow-hidden")
	}, [isMobileMenuOpen])

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20 gap-4">
					<Link
						href="/"
						className="text-white font-semibold text-lg tracking-tight"
					>
						Clausify
					</Link>

					<nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="hover:text-white transition-colors"
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-3">
						<Link
							href="/login"
							className="hidden sm:inline-flex text-sm text-gray-200 hover:text-white transition-colors"
						>
							Entrar
						</Link>
						<Button
							asChild
							size="sm"
							className="hidden md:inline-flex rounded-full px-5"
						>
							<Link href="/cadastro">Começar agora</Link>
						</Button>
						<button
							type="button"
							className="md:hidden text-gray-200 hover:text-white transition-colors"
							onClick={() => setIsMobileMenuOpen((prev) => !prev)}
							aria-label="Alternar menu"
						>
							{isMobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{isMobileMenuOpen && (
				<div className="md:hidden fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm">
					<div className="px-6 pt-28 space-y-5 text-lg text-gray-200">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="block py-2 border-b border-white/10"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<Link
							href="/login"
							className="block py-2 text-emerald-400 font-medium"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Entrar
						</Link>
					</div>
				</div>
			)}
		</header>
	)
}
