"use client"

import Header from "@/components/layout/header"
import SubNav from "@/components/layout/sub-nav"
import Footer from "@/components/layout/footer"
import { Facebook, Twitter, Linkedin, MessageCircle, Copy, CheckCircle2, Lock, ArrowRight } from "lucide-react"
import Image from "next/image"

type LandingPageProps = {
  onStartInscription: () => void
}

export default function LandingPage({ onStartInscription }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={onStartInscription} />
      <SubNav />
      <div className="container mx-auto px-4">
        <div className="py-4">
          <div className="flex items-center space-x-2 text-xs">
            <a href="#" className="text-[#1451B4]">
              🏠
            </a>
            <span className="text-[#9E9D9D]">{">"}</span>
            <a href="#" className="text-[#1451B4]">
              Transportes
            </a>
            <span className="text-[#9E9D9D]">{">"}</span>
            <a href="#" className="text-[#1451B4]">
              Trânsito
            </a>
            <span className="text-[#9E9D9D]">{">"}</span>
            <span>CNH Social</span>
          </div>
          <p className="text-xs">
            <strong style={{ fontWeight: 400 }}>Programa CNH Social - Carteira Nacional de Habilitação Gratuita</strong>
          </p>
        </div>
      </div>
      <hr />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 style={{ fontWeight: 700, color: "rgb(85, 85, 85)" }} className="text-lg font-light text-gray-900">
              CNH Social 2025: Conquiste sua liberdade e independência
            </h1>
            <p className="text-xl text-[#0c326f] font-light">
              <strong
                style={{
                  fontWeight: 500,
                  fontSize: "1.4rem",
                  lineHeight: "2.5rem",
                }}
              >
                Mais de 150.000 vagas para CNH gratuita em todo o Brasil
              </strong>
            </p>
          </div>
          <div className="space-y-6" style={{ marginTop: "0px" }}>
            <section className="space-y-6">
              <p className="text-lg text-gray-700 mt-4 leading-relaxed">
                O maior programa de CNH Social do Brasil já está com inscrições abertas e beneficiará
                <strong className="text-[#1351B4]">
                  {" "}
                  milhões de brasileiros garantindo mobilidade e oportunidades{" "}
                </strong>
                em 2025.
              </p>
            </section>
            <hr />
            <div className="flex justify-center items-center text-center gap-4">
              <p className="text-[13px] text-[#555]">Compartilhe esta oportunidade: </p>
              <div className="flex space-x-3 gap-1">
                <button
                  className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                  title="Compartilhar no Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                  title="Compartilhar no Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  className="text-blue-700 hover:text-blue-900 transition-colors p-1"
                  title="Compartilhar no LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  className="text-green-500 hover:text-green-700 transition-colors p-1"
                  title="Compartilhar no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors p-1" title="Copiar link">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-center text-[#555] text-[14px] pb-4" style={{ fontWeight: 400 }}>
              Publicado em 04/06/2025 15h42
            </p>
            <div className="w-full">
              <Image
                src="/images/cnh-social-2025.jpg"
                alt="CNH Social 2025 - Você no caminho da sua habilitação"
                width={640}
                height={360}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="mt-6">
              <p className="text-justify text-gray-700 leading-relaxed">
                <span className="float-left text-6xl font-bold text-blue-600 leading-none mr-2 mt-1">O</span>
                CNH Social é uma iniciativa dos governos estaduais, com apoio da Associação Nacional de Detrans (AND),
                que oferece a Carteira Nacional de Habilitação sem custo para pessoas de baixa renda. O programa visa
                promover a inclusão social e ampliar as oportunidades de trabalho e mobilidade urbana para milhões de
                brasileiros.
              </p>
            </div>
            <div className="border-l-4 border-[#1351B4] bg-white py-6 px-8 my-8 shadow-md">
              <div className="max-w-4xl">
                <h3 className="text-lg font-medium text-gray-900 mb-2">CNH Social - Carteira de Motorista Gratuita</h3>
                <p className="text-gray-600 mb-4 text-base">
                  Mais de 150.000 vagas para brasileiros de baixa renda. Pessoas inscritas no CadÚnico, beneficiários do
                  Bolsa Família e trabalhadores com renda familiar até 3 salários mínimos. Processo 100% digital e
                  simplificado.
                </p>
                <button
                  onClick={onStartInscription}
                  className="bg-[#1351B4] text-white px-6 py-3 text-sm font-medium rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse"
                >
                  Acessar inscrições agora
                </button>
              </div>
            </div>
            <section className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                O programa CNH Social oferece carteira de motorista gratuita para pessoas de baixa renda em todo o
                Brasil.{" "}
                <strong>
                  Não é necessário ter experiência prévia na condução - oferecemos treinamento completo gratuito.
                </strong>
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Uma das prioridades é ampliar o acesso à mobilidade urbana, com parcerias entre autoescolas credenciadas
                e órgãos de trânsito estaduais e municipais. A estimativa é que seja possível beneficiar até{" "}
                <strong className="text-[#1351B4]">150.000 brasileiros</strong> em todas as regiões do país.
              </p>
            </section>
            <section className="space-y-6">
              <h2 className="text-2xl font-light text-gray-900">A importância da mobilidade urbana no Brasil</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                As ações unem esforços dos governos estaduais e federais para atender a uma demanda urgente de
                mobilidade urbana da população brasileira. Milhões de brasileiros não possuem carteira de motorista
                devido aos <strong>altos custos</strong>, que podem chegar a R$ 3.000 reais, limitando oportunidades de
                trabalho.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Dados do DENATRAN apontam que pessoas com CNH têm <strong>35% mais chances</strong> de conseguir emprego
                em áreas urbanas. Há uma necessidade de o país ampliar o acesso à carteira de motorista para{" "}
                <strong>reduzir a desigualdade social</strong> e promover inclusão.
              </p>
            </section>
            <div className="bg-white border border-gray-200 rounded-lg p-8 my-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#1351B4] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    CNH Social - Aberto para TODOS os Brasileiros de Baixa Renda
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Especialmente criado para pessoas cadastradas no CadÚnico, beneficiários do Bolsa Família e
                    trabalhadores com renda familiar até 3 salários mínimos. Mais de 150.000 vagas para CNH gratuita em
                    todo o Brasil. Todas as categorias disponíveis: A, B, C, D e E.
                  </p>
                  <button
                    onClick={onStartInscription}
                    className="bg-[#1351B4] text-white px-8 py-3 rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-lg"
                  >
                    <span>💡 Inscreva-se Agora</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <Lock className="w-4 h-4 mr-2" />
                  Serviço oficial protegido com login gov.br
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
