import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { initialTemplates, simulateAIAnalysis } from '../data/checklistStore';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Save, CheckSquare, Upload, FileText, Loader2, Plus, Trash2, MessageSquare, Mail, Send } from 'lucide-react';

export default function ChecklistPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplates[0].id);
  const [answers, setAnswers] = useState({});
  const [observation, setObservation] = useState("");
  
  // NOVO: Estados para o E-mail
  const [emailTo, setEmailTo] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const currentTemplate = templates.find(t => t.id === selectedTemplateId);

  const toggleItem = (itemId) => {
    setAnswers(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    try {
      const newTemplate = await simulateAIAnalysis(uploadFile);
      setTemplates(prev => [...prev, newTemplate]);
      setUploadFile(null);
      alert(`Sucesso! O modelo "${newTemplate.name}" foi criado.`);
    } catch (error) {
      alert("Erro ao processar arquivo");
    } finally {
      setIsUploading(false);
    }
  };

  // --- NOVA FUNÇÃO DE FINALIZAR E ENVIAR ---
  const handleFinish = () => {
    // 1. Validação simples
    if (!emailTo || !emailTo.includes('@')) {
      alert("Por favor, preencha um e-mail válido para envio.");
      return;
    }

    // 2. Inicia o estado de "Enviando..."
    setIsSending(true);

    // 3. Simula o tempo de envio (2 segundos)
    setTimeout(() => {
      console.log("=== ENVIANDO RELATÓRIO ===");
      console.log("Para:", emailTo);
      console.log("Equipamento:", currentTemplate.name);
      console.log("Dados:", answers);
      console.log("Obs:", observation);

      // 4. Finaliza e avisa
      setIsSending(false);
      alert(`✅ Sucesso!\n\nO relatório PDF foi gerado e enviado para:\n${emailTo}\n\nUma cópia foi salva no histórico.`);
      
      // Opcional: Limpar formulário após envio
      // setAnswers({});
      // setObservation("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      
      <div className="max-w-4xl mx-auto mb-6 flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Central de Checklists</h1>
          <p className="text-sm text-slate-500">Tecnoloc / Operacional</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="execute" className="w-full">
          
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="execute">Executar Checklist</TabsTrigger>
            <TabsTrigger value="manage">Gestão de Modelos</TabsTrigger>
          </TabsList>

          <TabsContent value="execute" className="space-y-6">
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Selecione o Equipamento</CardTitle>
              </CardHeader>
              <CardContent>
                <select 
                  className="w-full p-2 border rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    setAnswers({});
                    setObservation("");
                  }}
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {currentTemplate && (
              <div className="space-y-6 fade-in">
                
                <Card>
                  <CardHeader><CardTitle className="text-base text-blue-900">Identificação</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1"><label className="text-sm font-medium">Patrimônio</label><Input placeholder="Ex: TEC-001" /></div>
                    <div className="space-y-1"><label className="text-sm font-medium">Horímetro</label><Input type="number" placeholder="0000.0" /></div>
                    <div className="space-y-1"><label className="text-sm font-medium">Técnico</label><Input placeholder="Seu nome" /></div>
                  </CardContent>
                </Card>

                {currentTemplate.sections.map((section, idx) => (
                  <Card key={idx}>
                    <CardHeader className="bg-slate-100/50 py-3">
                      <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 grid gap-3">
                      {section.items.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                            answers[item.id] 
                              ? 'bg-green-50 border-green-500 shadow-sm' 
                              : 'bg-white border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${
                            answers[item.id] ? 'bg-green-500 border-green-500' : 'border-slate-300'
                          }`}>
                            {answers[item.id] && <CheckSquare className="h-3 w-3 text-white" />}
                          </div>
                          <span className={answers[item.id] ? 'text-green-900 font-medium' : 'text-slate-600'}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-blue-200 shadow-sm">
                  <CardHeader className="pb-3 bg-blue-50/50">
                    <CardTitle className="text-base flex items-center gap-2 text-blue-800">
                      <MessageSquare className="h-5 w-5" />
                      Observações Gerais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Textarea 
                      placeholder="Descreva avarias, peças faltantes ou detalhes importantes..." 
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                    />
                  </CardContent>
                </Card>

                {/* --- SEÇÃO DE ENVIO --- */}
                <Card className="bg-slate-900 text-white border-none shadow-xl">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-[1fr_200px] gap-4 items-end">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Enviar Relatório para (E-mail do Gestor)
                        </label>
                        <Input 
                          placeholder="gestor@tecnoloc.com.br" 
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-500"
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        size="lg" 
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold transition-all"
                        onClick={handleFinish}
                        disabled={isSending}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Finalizar e Enviar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {/* --- FIM SEÇÃO DE ENVIO --- */}

              </div>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Importar Novo Modelo via IA
                </CardTitle>
                <CardDescription>
                  Envie o PDF do manual. A IA irá ler e criar o formulário automaticamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="bg-white"
                  />
                  <Button 
                    onClick={handleUpload} 
                    disabled={!uploadFile || isUploading}
                    className="min-w-[140px]"
                  >
                    {isUploading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
                    ) : (
                      <><Plus className="mr-2 h-4 w-4" /> Criar Modelo</>
                    )}
                  </Button>
                </div>
                
                {isUploading && (
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analisando PDF...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <h3 className="font-semibold text-slate-900">Modelos Ativos</h3>
              {templates.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">ID: {t.id}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}