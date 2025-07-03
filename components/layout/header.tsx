"use client"

import { User, Moon, Cookie } from "lucide-react"
import Image from "next/image"

type HeaderProps = {
  showUserButton?: boolean
  userData?: { nome?: string } | null
  onLoginClick?: () => void
}

export default function Header({ showUserButton = false, userData = null, onLoginClick }: HeaderProps) {
  return (
    <header className="bg-white z-50 fixed w-full top-0 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/">
          <Image
            src="/images/1200px-Gov.br_logo.svg.png"
            alt="gov.br logo"
            width={100}
            height={28}
            className="h-6 md:h-7 w-auto"
          />
        </a>
        <div className="flex items-center space-x-4">
          {!showUserButton && onLoginClick && (
            <>
              <button
                className="bg-[#1351B4] text-white rounded-full px-4 py-2 text-sm flex items-center hover:bg-[#0c326f] transition-colors"
                onClick={onLoginClick}
              >
                <User className="mr-2 text-sm h-4 w-4" />
                Entrar com gov.br
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
            </>
          )}
          <button className="text-blue-600">
            <Cookie className="text-base h-5 w-5" />
          </button>
          <button className="text-blue-600">
            <Moon className="text-base h-5 w-5" />
          </button>
          {showUserButton && (
            <button className="bg-[#1351B4] text-white rounded-full px-4 py-2 text-sm flex items-center">
              <User className="mr-2 text-sm h-4 w-4" />
              {userData?.nome?.split(" ")[0].toUpperCase() || "USUÁRIO"}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
