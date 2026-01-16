import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ClipboardCheck, Search, Loader2, CheckCircle2, Upload, FileText, Send, FileCheck, ArrowLeft } from 'lucide-react';

export default function ChecklistPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  const [equipmentType, setEquipmentType] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [checklists, setChecklists] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  
  // Finalização
  const [showFinalizationForm, setShowFinalizationForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [finalizationData, setFinalizationData] = useState({
    equipment_name: '',
    patrimonio: '',
    horimetro: '',
    technician_name: '',
    email: ''
  });
  
  // Upload form
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    equipment_type: 'torre',
    equipment_name: '',
    brand: '',
    model: '',
    description: '',
    file_name: ''
  });

  // MOCK: Dados simulados (Isso será substituído pelo Supabase depois)
  const mockChecklistData = {
    equipment_info: { name: 'Torre MLT6SKD', type: 'torre' },
    checklists: [
      {
        title: 'Motor e Níveis',
        category: 'preventiva',
        items: [
          { description: 'Nível de óleo do motor', critical: true },
          { description: 'Nível de água do radiador', critical: true },
          { description: 'Vazamentos de fluidos', critical: true },
        ]
      },
      {
        title: 'Sistema Elétrico',
        category: 'funcionamento',
        items: [
          { description: 'Bateria e cabos', critical: false },
          { description: 'Lâmpadas dos refletores', critical: false },
          { description: 'Painel de controle', critical: true },
        ]
      },
      {
        title: 'Estrutura',
        category: 'carenagem',
        items: [
          { description: 'Pneus e calibragem', critical: false },
          { description: 'Patolas de fixação', critical: true },
          { description: 'Pintura e adesivos', critical: false },
        ]
      }
    ]
  };

  const handleSearch = async () => {
    if (!equipmentType) {
      alert('Selecione o tipo de equipamento');
      return;
    }

    setIsSearching(true);
    setChecklists(null);
    setCheckedItems({});

    // Simulação de delay de rede
    setTimeout(() => {
      setChecklists(mockChecklistData);
      setIsSearching(false);
    }, 1000);
  };

  const toggleCheckItem = (checklistIdx, itemIdx) => {
    const key = `${checklistIdx}-${itemIdx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'preventiva': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'funcionamento': 'bg-blue-100 text-blue-800 border-blue-300',
      'limpeza': 'bg-green-100 text-green-800 border-green-300',
      'pintura': 'bg-purple-100 text-purple-800 border-purple-300',
      'carenagem': 'bg-indigo-100 text-indigo-800 border-indigo-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const equipmentTypeLabels = {
    'torre': 'Torre de Iluminação',
    'gerador': 'Gerador',
    'maquina_solda': 'Máquina de Solda',
    'outro': 'Outro'
  };

  const handleFinalize = async () => {
    if (!finalizationData.equipment_name || !finalizationData.technician_name) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    setIsSending(true);
    // Simulação de envio
    setTimeout(() => {
      alert(`Checklist finalizado com sucesso!\nEnviado para: ${finalizationData.email}`);
      setIsSending(false);
      setShowFinalizationForm(false);
      navigate('/'); // Volta para a Home
    }, 1500);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    alert("Funcionalidade de Upload será conectada ao Supabase em breve!");
    setShowUploadForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button variant="ghost" className="pl-0 hover:bg-transparent mb-2 text-slate-600" onClick={() => navigate('/')}>
               <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Menu
            </Button>
            <div className="flex items-center gap-3">
              <ClipboardCheck className="w-8 h-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-900">Checklist de Manutenção</h1>
            </div>
            <p className="text-gray-600 mt-1">Gerencie e execute inspeções técnicas</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto md:mx-0">
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              Realizar Checklist
            </TabsTrigger>
            <TabsTrigger value="manage">
              <Upload className="w-4 h-4 mr-2" />
              Cadastrar Modelo
            </TabsTrigger>
          </TabsList>

          {/* TAB: REALIZAR CHECKLIST */}
          <TabsContent value="search" className="space-y-8">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Selecione o Equipamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label>Tipo de Equipamento</Label>
                    <Select value={equipmentType} onValueChange={setEquipmentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="torre">Torre de Iluminação</SelectItem>
                        <SelectItem value="gerador">Gerador</SelectItem>
                        <SelectItem value="maquina_solda">Máquina de Solda</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {isSearching ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Buscando...</>
                      ) : (
                        <><Search className="w-4 h-4 mr-2" /> Iniciar Checklist</>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {checklists && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Info do Equipamento */}
                <Card className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-l-orange-500 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                        <ClipboardCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {checklists.equipment_info.name}
                        </h3>
                        <p className="text-gray-600 capitalize">
                          {equipmentTypeLabels[checklists.equipment_info.type]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de Itens */}
                {checklists.checklists?.map((checklist, checklistIdx) => (
                  <Card key={checklistIdx} className="shadow-sm border-slate-200">
                    <CardHeader className="bg-slate-50/50 border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <CardTitle className="text-lg">{checklist.title}</CardTitle>
                        </div>
                        {checklist.category && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(checklist.category)}`}>
                            {checklist.category.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {checklist.items?.map((item, itemIdx) => {
                          const itemKey = `${checklistIdx}-${itemIdx}`;
                          const isChecked = checkedItems[itemKey] || false;
                          
                          return (
                            <div 
                              key={itemIdx}
                              onClick={() => toggleCheckItem(checklistIdx, itemIdx)}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                isChecked 
                                  ? 'bg-green-50 border-green-200' 
                                  : item.critical 
                                    ? 'bg-white border-red-100 hover:border-red-300' 
                                    : 'bg-white border-slate-100 hover:border-slate-300'
                              }`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggleCheckItem(checklistIdx, itemIdx)}
                                className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                              />
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${isChecked ? 'text-green-800' : 'text-slate-700'}`}>
                                  {item.description}
                                </p>
                              </div>
                              {item.critical && !isChecked && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide rounded">
                                  Crítico
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Formulário de Finalização */}
                <Card className="mt-8 border-2 border-slate-200 shadow-md">
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <FileCheck className="w-5 h-5" />
                      Finalizar Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {!showFinalizationForm ? (
                      <Button 
                        onClick={() => setShowFinalizationForm(true)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-lg h-12"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Concluir e Assinar
                      </Button>
                    ) : (
                      <div className="space-y-4 animate-in fade-in">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Patrimônio *</Label>
                            <Input
                              value={finalizationData.patrimonio}
                              onChange={(e) => setFinalizationData({...finalizationData, patrimonio: e.target.value})}
                              placeholder="Ex: PAT-001234"
                            />
                          </div>
                          <div>
                            <Label>Horímetro Atual *</Label>
                            <Input
                              value={finalizationData.horimetro}
                              onChange={(e) => setFinalizationData({...finalizationData, horimetro: e.target.value})}
                              placeholder="Ex: 1250 h"
                              type="number"
                            />
                          </div>
                          <div>
                            <Label>Nome do Técnico *</Label>
                            <Input
                              value={finalizationData.technician_name}
                              onChange={(e) => setFinalizationData({...finalizationData, technician_name: e.target.value})}
                              placeholder="Seu nome"
                            />
                          </div>
                          <div>
                            <Label>E-mail do Supervisor</Label>
                            <Input
                              type="email"
                              value={finalizationData.email}
                              onChange={(e) => setFinalizationData({...finalizationData, email: e.target.value})}
                              placeholder="supervisor@tecnoloc.com"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-3 justify-end pt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowFinalizationForm(false)}
                            disabled={isSending}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleFinalize}
                            disabled={isSending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {isSending ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                            ) : (
                              <><Send className="w-4 h-4 mr-2" /> Enviar Relatório</>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* TAB: GERENCIAR (Placeholder) */}
          <TabsContent value="manage" className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Modelos de Checklist</h2>
              <Button onClick={() => setShowUploadForm(!showUploadForm)} className="bg-orange-600 text-white">
                <Upload className="w-4 h-4 mr-2" /> Novo Modelo
              </Button>
            </div>

            {showUploadForm && (
              <Card className="mb-6 animate-in slide-in-from-top-2">
                <CardHeader>
                  <CardTitle>Cadastrar Novo Checklist (PDF)</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Equipamento</Label>
                        <Input placeholder="Nome do modelo" value={uploadFormData.equipment_name} onChange={e => setUploadFormData({...uploadFormData, equipment_name: e.target.value})} />
                      </div>
                      <div>
                        <Label>Arquivo</Label>
                         <Input type="file" disabled />
                         <p className="text-xs text-slate-500 mt-1">Upload será ativado com Supabase Storage.</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setShowUploadForm(false)}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
               <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
               <p className="text-slate-500">Nenhum modelo customizado encontrado.</p>
               <p className="text-xs text-slate-400">Use os modelos padrão na aba "Realizar Checklist"</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}