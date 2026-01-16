import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BookOpen, 
  Search, 
  Upload, 
  FileText, 
  Zap, 
  Settings, 
  ArrowLeft,
  Filter,
  Download,
  ShieldCheck
} from 'lucide-react';

export default function ManualsPage() {
  const navigate = useNavigate();
  const [isAdmin] = useState(true); // Simulando que o usuário é Admin para ver o painel
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para o formulário de upload do Admin
  const [newManual, setNewManual] = useState({
    equipment: '',
    brand: '',
    model: '',
    type: 'mecanico' // 'eletrico' ou 'mecanico'
  });

  // MOCK: Dados simulados de manuais existentes
  const manuals = [
    { id: 1, equipment: 'Mini Rolo', brand: 'Wacker Neuson', model: 'RT-82', type: 'mecanico', date: '10/01/2026' },
    { id: 2, equipment: 'Gerador', brand: 'Himoinsa', model: 'HYW-20', type: 'eletrico', date: '05/01/2026' },
    { id: 3, equipment: 'Torre de Iluminação', brand: 'Generac', model: 'MLT6', type: 'eletrico', date: '12/12/2025' },
  ];

  const handleUpload = (e) => {
    e.preventDefault();
    console.log("Dados para upload:", newManual);
    alert("Manual enviado com sucesso (Simulação)!");
    // Aqui entrará a lógica do Supabase Storage
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="pl-0 mb-2 text-slate-600" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Menu
          </Button>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Manuais</h1>
          </div>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="browse">Consultar Manuais</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="text-orange-600">
                <ShieldCheck className="w-4 h-4 mr-2" /> Painel Admin
              </TabsTrigger>
            )}
          </TabsList>

          {/* ABA DE CONSULTA (Para todos) */}
          <TabsContent value="browse" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Busque por equipamento, marca ou modelo..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="bg-orange-600 text-white">
                    <Filter className="w-4 h-4 mr-2" /> Filtrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {manuals.map((manual) => (
                <Card key={manual.id} className="hover:shadow-md transition-shadow border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${manual.type === 'eletrico' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                        {manual.type === 'eletrico' ? <Zap className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        PDF
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{manual.equipment}</h3>
                    <p className="text-sm text-slate-600">{manual.brand} - {manual.model}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Atualizado em: {manual.date}</span>
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                        <Download className="w-4 h-4 mr-2" /> Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ABA ADMIN (Apenas envio) */}
          {isAdmin && (
            <TabsContent value="admin">
              <Card className="border-2 border-dashed border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-orange-600" />
                    Upload de Novo Manual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Nome do Equipamento</Label>
                        <Input 
                          placeholder="Ex: Mini Rolo" 
                          value={newManual.equipment}
                          onChange={(e) => setNewManual({...newManual, equipment: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Marca</Label>
                        <Input 
                          placeholder="Ex: Wacker Neuson" 
                          value={newManual.brand}
                          onChange={(e) => setNewManual({...newManual, brand: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Modelo</Label>
                        <Input 
                          placeholder="Ex: RT-82" 
                          value={newManual.model}
                          onChange={(e) => setNewManual({...newManual, model: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo de Manual</Label>
                        <Select 
                          value={newManual.type} 
                          onValueChange={(v) => setNewManual({...newManual, type: v})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mecanico">Mecânico / Operação</SelectItem>
                            <SelectItem value="eletrico">Esquema Elétrico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Clique para selecionar o arquivo PDF ou arraste aqui</p>
                      <input type="file" className="hidden" accept=".pdf" id="manual-file" />
                      <Label htmlFor="manual-file" className="mt-4 cursor-pointer text-orange-600 font-bold block">Selecionar Arquivo</Label>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                        Salvar Manual na Biblioteca
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}