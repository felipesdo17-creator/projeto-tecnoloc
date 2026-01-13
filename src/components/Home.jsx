import React from 'react';
import { Link } from 'react-router-dom';
// Removemos o import do 'utils' para simplificar
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { FileText, Search, History, Wrench, ChevronRight, Zap, ClipboardCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0d2818 0%, #1a4d2e 50%, #0d2818 100%)'
    }}>
      {/* Pattern de fundo industrial */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px),
                          repeating-linear-gradient(90deg, transparent, transparent 2px, #fff 2px, #fff 4px)`
      }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
            {/* Mantive a imagem, mas certifique-se que ela carrega ou troque por um texto se preferir */}
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d0a9200ced41a30cb2042/2614e7d21_image.png" 
              alt="Tecnoloc"
              className="h-28 object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Diagnóstico Técnico Inteligente
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Análise especializada baseada em manuais técnicos do fabricante
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-400/30">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-100 font-medium">IA Integrada</span>
            </div>
          </div>
        </div>

        {/* Cards - Atualizei os Links para strings simples */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Novo Diagnóstico */}
          <Link to="/diagnostico" className="group">
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-green-400/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Novo Diagnóstico</h3>
                <p className="text-green-100 mb-6 leading-relaxed">
                  Inicie um diagnóstico completo com análise de manuais técnicos
                </p>
                <div className="flex items-center text-green-400 font-medium group-hover:gap-3 gap-2 transition-all">
                  <span>Começar</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Manuais */}
          <Link to="/manuais" className="group">
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-orange-400/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Manuais Técnicos</h3>
                <p className="text-green-100 mb-6 leading-relaxed">
                  Biblioteca completa de documentação técnica dos fabricantes
                </p>
                <div className="flex items-center text-orange-400 font-medium group-hover:gap-3 gap-2 transition-all">
                  <span>Gerenciar</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Checklist */}
          <Link to="/checklist" className="group">
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-orange-400/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Checklist</h3>
                <p className="text-green-100 mb-6 leading-relaxed">
                  Acesse checklists de manutenção e inspeção dos equipamentos
                </p>
                <div className="flex items-center text-orange-400 font-medium group-hover:gap-3 gap-2 transition-all">
                  <span>Acessar</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Histórico */}
          <Link to="/historico" className="group">
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-green-400/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <History className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Histórico</h3>
                <p className="text-green-100 mb-6 leading-relaxed">
                  Acesse diagnósticos anteriores e acompanhe soluções aplicadas
                </p>
                <div className="flex items-center text-green-400 font-medium group-hover:gap-3 gap-2 transition-all">
                  <span>Consultar</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}