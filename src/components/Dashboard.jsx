import React from 'react'
import { Button } from "./ui/button"
import { 
  LayoutDashboard, 
  Wrench, 
  FileText, 
  LogOut, 
  Search 
} from "lucide-react" // Ícones bonitos

export function Dashboard({ onLogout }) {
  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* --- BARRA LATERAL (SIDEBAR) --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-blue-400">Tecnoloc</h2>
          <p className="text-xs text-slate-400">Gestão de Frotas</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800 hover:text-blue-200">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Visão Geral
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800 hover:text-blue-200">
            <Wrench className="mr-2 h-4 w-4" />
            Manutenção
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800 hover:text-blue-200">
            <FileText className="mr-2 h-4 w-4" />
            Manuais
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800 hover:text-blue-200">
            <Search className="mr-2 h-4 w-4" />
            Diagnóstico IA
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button 
            onClick={onLogout} 
            variant="destructive" 
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto">
        {/* Cabeçalho Superior */}
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
          <div className="text-sm text-slate-500">
            Olá, Técnico <b>Fabio</b>
          </div>
        </header>

        {/* Área de Trabalho */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card de Exemplo 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-slate-500 text-sm font-medium">Equipamentos Ativos</h3>
              <p className="text-3xl font-bold text-slate-900 mt-2">142</p>
            </div>
            
            {/* Card de Exemplo 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-slate-500 text-sm font-medium">Manutenções Pendentes</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">8</p>
            </div>

            {/* Card de Exemplo 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-slate-500 text-sm font-medium">Eficiência da IA</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">94%</p>
            </div>
          </div>

          <div className="mt-8 p-10 border-2 border-dashed border-slate-300 rounded-lg text-center text-slate-400">
            Área para os gráficos de desempenho da frota
          </div>
        </div>
      </main>

    </div>
  )
}