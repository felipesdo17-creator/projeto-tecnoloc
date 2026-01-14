import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Loader2, CheckCircle, AlertCircle, ArrowLeft, BookOpen,
  ShieldCheck, Save, Camera, X, ImageIcon
} from 'lucide-react';

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

  // LOG DE SEGURANÇA
  useEffect(() => {
    console.log("Sistema pronto. Modo Seguro (API Proxy).");
  }, []);

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
        .ilike('model_name', modelName) // Verifica nome da coluna no seu Supabase
        .single();

      if (error || !data) return null;
      return { text: data.content };
    } catch (err) {
      console.error("Erro Supabase (Manual):", err);
      return null;
    }
  };

  // 2. BUSCA SOLUÇÕES ANTERIORES (PRÁTICA)
  const fetchPreviousSolutions = async (modelName) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select('defect_description, technician_notes')
        .ilike('equipment_model', modelName) // Verifica nome da coluna no seu Supabase
        // .eq('status', 'Resolvido') // Remova o comentário se tiver essa coluna
        .limit(3);

      if (error || !data || data.length === 0) return null;

      return data.map((log, i) => 
        `   CASO ${i+1}: O defeito era "${log.defect_description}" e a solução foi: "${log.technician_notes}"`
      ).join('\n');
      
    } catch (err) {
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
          equipment_model: formData.model,
          diagnosis: JSON.stringify(diagnosisResult),
          status: wasEffective ? 'Resolvido' : 'Pendente',
          defect_description: formData.defect_description,
          technician_notes: actualSolution
        });

      if (error) throw error;
      alert("Experiência salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar no banco.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FLUXO PRINCIPAL DE ANÁLISE ---
  const handleAnalyze = async () => {
    if (!formData.equipment_name || (!formData.defect_description && !selectedImage)) {
      alert('Preencha os dados e descreva o defeito ou envie uma foto.');
      return;
    }

    setIsAnalyzing(true);
    setDiagnosisResult(null);

    try {
      // 1. Busca dados em paralelo (Manual + Histórico)
      const [internalManual, fieldTips] = await Promise.all([
        fetchManualFromLibrary(formData.model),
        fetchPreviousSolutions(formData.model)
      ]);

      // 2. Monta o Prompt
      const promptText = `
        VOCÊ É UM ASSISTENTE TÉCNICO EXPERT DA TECNOLOC.
        CONTEXTO: Equipamento ${formData.equipment_name} (${formData.brand} - ${formData.model}).
        PROBLEMA: "${formData.defect_description}"
        
        MANUAL TÉCNICO: ${internalManual ? internalManual.text : "Não disponível."}
        HISTÓRICO: ${fieldTips ? fieldTips : "Sem histórico."}
        
        INSTRUÇÃO: Retorne APENAS JSON válido com "possible_causes" (lista) e "solutions" (lista de objetos com title, steps, difficulty).
      `;

      // 3. Prepara a imagem
      let base64Image = null;
      if (selectedImage) {
        const reader = new FileReader();
        base64Image = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result.split(',')[1]);
            reader.readAsDataURL(selectedImage);
        });
      }

      // 4. CHAMA A API PROXY SEGURA
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          image: base64Image
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro na IA');

      // 5. Limpa JSON
      let text = data.result;
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

  // --- AQUI ESTÁ A PARTE VISUAL QUE FALTAVA ---
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6 hover:bg-slate-200">
          <ArrowLeft className="w-4 h-4 mr-2" /> Painel Principal
        </Button>

        {/* --- CARD DE ENTRADA DE DADOS --- */}
        <Card className="mb-8 border-t-4 border-t-indigo-600 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900 text-xl">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              Diagnóstico Inteligente (Manual + Histórico)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* INPUTS DE IDENTIFICAÇÃO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Equipamento</Label>
                <Input 
                  value={formData.equipment_name} 
                  onChange={(e) => setFormData({...formData, equipment_name: e.target.value})}
                  placeholder="Ex: Rolo Compactador"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Marca</Label>
                <Input 
                  value={formData.brand} 
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="Wacker"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Modelo (Exato)</Label>
                <Input 
                  value={formData.model} 
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="RT-82"
                />
              </div>
            </div>

            {/* ÁREA DE DESCRIÇÃO E FOTO */}
            <div className="space-y-2">
              <Label className="font-bold">Relato do Técnico & Evidência Visual</Label>
              <div className="relative">
                <Textarea 
                  value={formData.defect_description} 
                  onChange={(e) => setFormData({...formData, defect_description: e.target.value})}
                  placeholder="Descreva o problema..."
                  rows={4}
                  className="pr-12 resize-none"
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
                     className="rounded-full shadow-sm"
                     onClick={() => fileInputRef.current.click()}
                   >
                     <Camera className="h-5 w-5 text-indigo-600" />
                   </Button>
                </div>
              </div>

              {imagePreview && (
                <div className="mt-4 inline-flex relative">
                  <img src={imagePreview} alt="Evidência" className="h-32 w-auto rounded-lg border-2" />
                  <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* BOTÃO DE AÇÃO */}
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

        {/* --- CARD DE RESULTADOS --- */}
        {diagnosisResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Card className="border-green-200 bg-white shadow-2xl border-l-8 border-l-green-500">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" /> Diagnóstico Gerado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Causas Identificadas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {diagnosisResult.possible_causes.map((cause, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg border italic font-medium">• {cause}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Plano de Ação</h3>
                  <div className="space-y-6">
                    {diagnosisResult.solutions.map((sol, idx) => (
                      <div key={idx} className="border-2 rounded-xl p-5 border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-lg">{sol.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase ${difficultyColors[sol.difficulty?.toLowerCase()] || 'bg-slate-100'}`}>
                            {sol.difficulty}
                          </span>
                        </div>
                        <div className="space-y-4">
                          {sol.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex gap-4 text-sm">
                              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">{sIdx + 1}</span>
                              <p className="pt-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ÁREA DE FEEDBACK */}
            <Card className="border-blue-200 bg-blue-50/40">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-blue-900 uppercase">Feedback do Técnico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Label>A solução funcionou?</Label>
                 <div className="flex gap-2">
                   <Button variant={wasEffective ? "default" : "outline"} onClick={() => setWasEffective(true)}>Sim</Button>
                   <Button variant={!wasEffective ? "destructive" : "outline"} onClick={() => setWasEffective(false)}>Não / Fiz diferente</Button>
                 </div>
                 <Textarea 
                   placeholder="Notas adicionais sobre a solução..." 
                   value={actualSolution} 
                   onChange={(e) => setActualSolution(e.target.value)} 
                 />
                 <Button className="w-full bg-blue-900 text-white" onClick={handleSaveFeedback} disabled={isSaving}>
                   {isSaving ? "Salvando..." : "Salvar Experiência"}
                 </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}