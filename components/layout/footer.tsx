import { ChevronDown, Cookie } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer>
      <div className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="py-3">
            <Image
              src="/images/1200px-Gov.br_logo.svg.png"
              alt="Government of Brazil logo showing gov.br in white text"
              width={96}
              height={24}
              className="w-24 filter invert brightness-0"
            />
          </div>
          <div className="border-t border-gray-600"></div>
          <nav>
            <ul className="text-sm">
              <li className="py-3">
                <a href="#" className="text-sm hover:underline">
                  SOBRE O MINISTÉRIO
                </a>
              </li>
              <li className="border-t border-gray-600 py-3 flex justify-between items-center">
                <a href="#" className="text-sm hover:underline">
                  SERVIÇOS DO PROGRAMA
                </a>
                <ChevronDown className="text-xs h-4 w-4" />
              </li>
              <li className="border-t border-gray-600 py-3 flex justify-between items-center">
                <a href="#" className="text-sm hover:underline">
                  NAVEGAÇÃO POR PÚBLICO
                </a>
                <ChevronDown className="text-xs h-4 w-4" />
              </li>
              <li className="border-t border-gray-600 py-3 flex justify-between items-center">
                <a href="#" className="text-sm hover:underline">
                  ACESSIBILIDADE
                </a>
                <ChevronDown className="text-xs h-4 w-4" />
              </li>
              <li className="border-t border-gray-600 py-3 flex justify-between items-center">
                <a href="#" className="text-sm hover:underline">
                  ACESSO À INFORMAÇÃO
                </a>
                <ChevronDown className="text-xs h-4 w-4" />
              </li>
              <li className="border-t border-gray-600 py-3 flex justify-between items-center">
                <a href="#" className="text-sm hover:underline">
                  CENTRAIS DE CONTEÚDO
                </a>
                <ChevronDown className="text-xs h-4 w-4" />
              </li>
              <li className="border-t border-gray-600 py-3 flex justify-between items-center">
                <a href="#" className="text-sm hover:underline">
                  CANAIS DE ATENDIMENTO
                </a>
                <ChevronDown className="text-xs h-4 w-4" />
              </li>
              <li className="border-t border-gray-600 py-3 flex justify-between items-center">
                <a href="#" className="text-sm hover:underline">
                  PROGRAMAS E PROJETOS
                </a>
                <ChevronDown className="text-xs h-4 w-4" />
              </li>
            </ul>
          </nav>
          <div className="mt-4 flex items-center">
            <Cookie className="text-base mr-2 h-5 w-5" />
            <span className="text-sm hover:underline cursor-pointer">Redefinir Cookies</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-3">
        <div className="container mx-auto px-4">
          <div className="text-xs text-white">
            Todo o conteúdo deste site está publicado sob a licença{" "}
            <a
              rel="license"
              href="https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR"
              className="text-blue-400 hover:text-blue-300"
            >
              Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  )
}
