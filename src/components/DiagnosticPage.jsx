import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as GoogleAI from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  BookOpen,
  ShieldCheck,
  Save,
  Camera,
  X,
  ImageIcon
} from 'lucide-react';

// --- CONFIGURAÇÃO DA IA ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// --- CONFIGURAÇÃO DO SUPABASE ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function DiagnosticPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // ESTADOS
  const [formData, setFormData] = useState({
    equipment_name: '',
    brand: '',
    model: '',
    defect_description: ''
  });
  
  const [selectedImage, setSelectedImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);   
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [actualSolution, setActualSolution] = useState("");
  const [wasEffective, setWasEffective] = useState(true);

  // AUTO-DIAGNÓSTICO NO CONSOLE
  useEffect(() => {
    console.log("Sistema pronto. Modelo: gemini-3-flash-preview");
    console.log("Recurso ativado: Memória Coletiva (Lê logs de sucesso anteriores)");
  }, []);

  // CONVERTER ARQUIVO PARA BASE64
  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 1. BUSCA O MANUAL (TEORIA)
  const fetchManualFromLibrary = async (modelName) => {
    console.log(`Buscando manual para o modelo: ${modelName}...`);
    try {
      const { data, error } = await supabase
        .from('manuals')
        .select('content')
        .ilike('model', modelName)
        .single();

      if (error || !data) {
        console.log("Manual não encontrado.");
        return null;
      }
      return { text: data.content };
    } catch (err) {
      console.error("Erro Supabase (Manual):", err);
      return null;
    }
  };

  // 2. BUSCA SOLUÇÕES ANTERIORES (PRÁTICA/MEMÓRIA COLETIVA) -- NOVO!
  const fetchPreviousSolutions = async (modelName) => {
    console.log(`Buscando histórico de sucesso para: ${modelName}...`);
    try {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select('defect_description, technician_notes')
        .ilike('model', modelName)   // Mesmo modelo
        .eq('was_effective', true)   // Só o que funcionou
        .neq('technician_notes', '') // Que tenha anotação
        .not('technician_notes', 'is', null)
        .limit(3); // Pega as 3 últimas dicas

      if (error || !data || data.length === 0) return null;

      // Formata para a IA ler
      const formattedTips = data.map((log, i) => 
        `   CASO ${i+1}: O defeito era "${log.defect_description}" e o técnico resolveu assim: "${log.technician_notes}"`
      ).join('\n');

      console.log("Histórico encontrado:", formattedTips);
      return formattedTips;
      
    } catch (err) {
      console.error("Erro Supabase (Histórico):", err);
      return null;
    }
  };

  // SALVAR NOVO FEEDBACK
  const handleSaveFeedback = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('maintenance_logs')
        .insert({
          equipment_name: formData.equipment_name,
          brand: formData.brand,
          model: formData.model,
          defect_description: formData.defect_description,
          ai_diagnosis: diagnosisResult,
          was_effective: wasEffective,
          technician_notes: actualSolution
        });

      if (error) throw error;
      alert("Experiência salva! A IA ficará mais inteligente para o próximo técnico.");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Verifique o console.");
    } finally {
      setIsSaving(false);
    }
  };

  // FLUXO PRINCIPAL DE ANÁLISE
  const handleAnalyze = async () => {
    if (!formData.equipment_name || (!formData.defect_description && !selectedImage)) {
      alert('Preencha os dados e descreva o defeito ou envie uma foto.');
      return;
    }

    setIsAnalyzing(true);
    setDiagnosisResult(null);

    try {
      // MODELO GEMINI 3 (CONFIRMADO FUNCIONANDO)
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      // Busca dados em paralelo (Manual + Histórico)
      const [internalManual, fieldTips] = await Promise.all([
        fetchManualFromLibrary(formData.model),
        fetchPreviousSolutions(formData.model)
      ]);

      const promptText = `
        VOCÊ É UM ASSISTENTE TÉCNICO EXPERT DA TECNOLOC.
        
        CONTEXTO ATUAL:
        - Equipamento: ${formData.equipment_name} (${formData.brand} - ${formData.model})
        - Relato do Problema: "${formData.defect_description}"
        
        SUAS FONTES DE CONHECIMENTO:
        
        --- FONTE 1: MANUAL TÉCNICO OFICIAL ---
        ${internalManual ? internalManual.text : "NÃO DISPONÍVEL NA BASE."}
        
        --- FONTE 2: MEMÓRIA COLETIVA (O que outros técnicos já fizeram e funcionou) ---
        ${fieldTips ? fieldTips : "Nenhum histórico relevante encontrado para este modelo."}
        
        INSTRUÇÕES DE RACIOCÍNIO:
        1. Analise a IMAGEM (se houver) buscando danos visuais.
        2. Priorize a segurança do Manual Oficial.
        3. SE houver uma dica na "Memória Coletiva" que pareça resolver o problema atual melhor que o manual, SUGIRA ELA COM DESTAQUE (ex: "Baseado em casos anteriores...").
        4. Retorne APENAS JSON.

        FORMATO JSON OBRIGATÓRIO:
        {
          "possible_causes": ["causa 1", "causa 2 (baseado no histórico)"],
          "solutions": [
            {
              "title": "Ação Recomendada",
              "steps": ["passo 1", "passo 2"],
              "difficulty": "fácil/média/difícil",
              "estimated_time": "30 min",
              "tools_needed": ["ferramenta"],
              "warnings": ["cuidado"]
            }
          ]
        }
      `;

      const contentParts = [promptText];
      
      if (selectedImage) {
        const imagePart = await fileToGenerativePart(selectedImage);
        contentParts.push(imagePart);
      }

      const result = await model.generateContent(contentParts);
      const response = await result.response;
      let text = response.text();
      
      // Limpeza de resposta (JSON)
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          text = text.substring(firstBrace, lastBrace + 1);
      }

      setDiagnosisResult(JSON.parse(text));

    } catch (error) {
      console.error("Erro na análise:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const difficultyColors = {
    'fácil': 'bg-green-100 text-green-800',
    'média': 'bg-yellow-100 text-yellow-800',
    'difícil': 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6 hover:bg-slate-200">
          <ArrowLeft className="w-4 h-4 mr-2" /> Painel Principal
        </Button>

        {/* --- CARD DE ENTRADA --- */}
        <Card className="mb-8 border-t-4 border-t-indigo-600 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900 text-xl">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              Diagnóstico Inteligente (Manual + Histórico)
            </CardTitle>
            <p className="text-sm text-slate-500">
              A IA consulta manuais oficiais e aprende com soluções de outros técnicos.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Equipamento</Label>
                <Input 
                  value={formData.equipment_name} 
                  onChange={(e) => setFormData({...formData, equipment_name: e.target.value})}
                  placeholder="Ex: Rolo Compactador"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Marca</Label>
                <Input 
                  value={formData.brand} 
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="Wacker"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Modelo (Exato)</Label>
                <Input 
                  value={formData.model} 
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="RT-82"
                  className="bg-white border-indigo-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Relato do Técnico & Evidência Visual</Label>
              <div className="relative">
                <Textarea 
                  value={formData.defect_description} 
                  onChange={(e) => setFormData({...formData, defect_description: e.target.value})}
                  placeholder="Descreva o problema..."
                  rows={4}
                  className="bg-white pr-12 resize-none"
                />
                <div className="absolute bottom-3 right-3">
                   <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                   />
                   <Button 
                     size="icon" 
                     variant="outline" 
                     className="rounded-full shadow-sm hover:bg-indigo-50 border-indigo-200"
                     onClick={() => fileInputRef.current.click()}
                     title="Anexar foto"
                   >
                     <Camera className="h-5 w-5 text-indigo-600" />
                   </Button>
                </div>
              </div>

              {imagePreview && (
                <div className="mt-4 inline-flex relative animate-in fade-in zoom-in duration-300">
                  <img 
                    src={imagePreview} 
                    alt="Evidência" 
                    className="h-32 w-auto rounded-lg border-2 border-indigo-100 shadow-md object-cover"
                  />
                  <button 
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full bg-indigo-700 hover:bg-indigo-800 h-14 text-lg font-bold shadow-md"
            >
              {isAnalyzing ? (
                <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Consultando Base de Conhecimento...</>
              ) : (
                <><ImageIcon className="mr-2 h-5 w-5" /> Analisar Diagnóstico</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* --- RESULTADOS --- */}
        {diagnosisResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Card className="border-green-200 bg-white shadow-2xl overflow-hidden border-l-8 border-l-green-500">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Diagnóstico Gerado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Causas Identificadas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {diagnosisResult.possible_causes.map((cause, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 text-sm italic font-medium">
                        • {cause}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Plano de Ação</h3>
                  <div className="space-y-6">
                    {diagnosisResult.solutions.map((sol, idx) => (
                      <div key={idx} className="border-2 rounded-xl p-5 border-slate-100 bg-white">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <h4 className="font-bold text-slate-900 text-lg leading-tight">{sol.title}</h4>
                          <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${difficultyColors[sol.difficulty?.toLowerCase()] || 'bg-slate-100'}`}>
                            {sol.difficulty}
                          </span>
                        </div>
                        <div className="space-y-4">
                          {sol.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex gap-4 text-sm leading-relaxed">
                              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                {sIdx + 1}
                              </span>
                              <p className="text-slate-700 pt-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* --- FEEDBACK (RESTAURADO) --- */}
            <Card className="border-blue-200 bg-blue-50/40 shadow-inner mb-12">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-900 uppercase">
                  <BookOpen className="h-4 w-4" /> Feedback do Técnico (Incrementar Base)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Label className="font-medium">O manual foi suficiente para resolver?</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant={wasEffective ? "default" : "outline"} 
                      className={wasEffective ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white"}
                      onClick={() => setWasEffective(true)}
                    >Sim, resolveu</Button>
                    <Button 
                      variant={!wasEffective ? "destructive" : "outline"} 
                      className={!wasEffective ? "bg-red-600 hover:bg-red-700" : "bg-white"}
                      onClick={() => setWasEffective(false)}
                    >Fiz diferente</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">Relato da Experiência Real:</Label>
                  <Textarea 
                    placeholder="Se fez algo diferente do manual, descreva aqui. Isso ajudará a IA a dar melhores diagnósticos no futuro..."
                    className="bg-white border-blue-100"
                    value={actualSolution}
                    onChange={(e) => setActualSolution(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold h-12 shadow-lg"
                  onClick={handleSaveFeedback}
                  disabled={isSaving}
                >
                   {isSaving ? (
                     <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                   ) : (
                     <><Save className="mr-2 h-4 w-4" /> Salvar Experiência no Banco de Dados</>
                   )}
                </Button>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}