import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Calendar, 
  Wrench, 
  CheckCircle2, 
  Clock,
  ChevronRight
} from 'lucide-react';

export default function DiagnosticHistory() {
  const navigate = useNavigate();

  // Dados fictícios para simular o banco de dados
  const history = [
    {
      id: 1,
      equipment: "Torre de Iluminação",
      model: "MLT6SKD",
      defect: "Fumaça preta no escape",
      date: "13/01/2026",
      technician: "Fabio Oliveira",
      status: "Concluído"
    },
    {
      id: 2,
      equipment: "Gerador 250kVA",
      model: "Pramac GSW",
      defect: "Oscilação de frequência",
      date: "10/01/2026",
      technician: "Carlos Silva",
      status: "Em Análise"
    },
    {
      id: 3,
      equipment: "Mini Rolo",
      model: "RT-82",
      defect: "Perda de tração hidrostática",
      date: "08/01/2026",
      technician: "Fabio Oliveira",
      status: "Concluído"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Histórico de Diagnósticos</h1>
              <p className="text-slate-500">Consulte análises anteriores realizadas pela IA</p>
            </div>
          </div>
          <Button onClick={() => navigate('/diagnostico')} className="bg-indigo-600 hover:bg-indigo-700">
            <Search className="w-4 h-4 mr-2" />
            Novo Diagnóstico
          </Button>
        </div>

        {/* Lista de Histórico */}
        <div className="grid gap-4">
          {history.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-indigo-500">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                  
                  {/* Ícone e Status */}
                  <div className="flex flex-col items-center gap-2 min-w-[100px]">
                    <div className="p-3 bg-indigo-50 rounded-full">
                      <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      item.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Informações Principais */}
                  <div className="flex-1 space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-slate-900">{item.equipment}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> {item.model}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.date}</span>
                      <span className="flex items-center gap-1 text-indigo-600 font-medium font-bold italic">Técnico: {item.technician}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 bg-slate-100 p-2 rounded italic">
                      "Questão: {item.defect}"
                    </p>
                  </div>

                  {/* Botão Ação */}
                  <div className="flex items-center">
                    <Button variant="ghost" className="text-slate-400 hover:text-indigo-600">
                      Ver Relatório
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {history.length === 0 && (
          <Card className="p-12 text-center border-dashed">
            <div className="flex flex-col items-center gap-3">
              <Clock className="h-12 w-12 text-slate-300" />
              <p className="text-slate-500">Nenhum diagnóstico registrado ainda.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}