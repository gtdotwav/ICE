import { Menu, Mic, Search } from "lucide-react"

export default function SubNav() {
  return (
    <nav className="bg-white px-6 py-4 flex justify-between items-center mt-16 border-b">
      <button className="border-none text-blue-600 flex items-center cursor-pointer">
        <Menu className="mr-3 text-lg" />
        <span className="text-gray-600 text-sm font-light">Serviços e Informações do Brasil</span>
      </button>
      <div className="flex items-center gap-5">
        <div className="flex items-center text-blue-600">
          <Mic className="text-xl" />
        </div>
        <div className="flex items-center text-blue-600">
          <Search className="text-xl" />
        </div>
      </div>
    </nav>
  )
}
