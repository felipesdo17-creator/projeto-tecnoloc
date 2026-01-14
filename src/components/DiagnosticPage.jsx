import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// REMOVIDO: import { GoogleGenerativeAI }... (Não precisamos mais disso aqui!)
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

// --- REMOVIDO: CONFIGURAÇÃO DA IA (Isso agora vive no servidor /api/diagnose) ---
// const genAI = ... (APAGADO PARA NÃO VAZAR A CHAVE)

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
        .ilike('model_name', modelName) // Atenção: verifique se sua coluna chama 'model' ou 'model_name'
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
        .ilike('equipment_model', modelName)   // Verifique se a coluna é 'model' ou 'equipment_model'
        .eq('status', 'Resolvido') // Exemplo de filtro, ajuste conforme suas colunas
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
          equipment_model: formData.model, // Ajuste nomes das colunas conforme seu SQL
          diagnosis: JSON.stringify(diagnosisResult),
          status: wasEffective ? 'Resolvido' : 'Pendente',
          // Adicione outros campos necessários aqui
        });

      if (error) throw error;
      alert("Experiência salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FLUXO PRINCIPAL DE ANÁLISE (CORRIGIDO) ---
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

      // 2. Monta o Prompt Poderoso
      const promptText = `
        VOCÊ É UM ASSISTENTE TÉCNICO EXPERT DA TECNOLOC.
        
        CONTEXTO ATUAL:
        - Equipamento: ${formData.equipment_name} (${formData.brand} - ${formData.model})
        - Relato do Problema: "${formData.defect_description}"
        
        SUAS FONTES DE CONHECIMENTO:
        --- FONTE 1: MANUAL TÉCNICO OFICIAL ---
        ${internalManual ? internalManual.text : "NÃO DISPONÍVEL NA BASE."}
        
        --- FONTE 2: MEMÓRIA COLETIVA ---
        ${fieldTips ? fieldTips : "Nenhum histórico relevante encontrado."}
        
        INSTRUÇÕES:
        Analise a imagem e o relato. Retorne APENAS JSON no formato:
        {
          "possible_causes": ["causa 1", "causa 2"],
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

      // 3. Prepara a imagem (se houver)
      let base64Image = null;
      if (selectedImage) {
        const reader = new FileReader();
        base64Image = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result.split(',')[1]);
            reader.readAsDataURL(selectedImage);
        });
      }

      // 4. CHAMA A SUA API SEGURA (AQUI ESTÁ A MÁGICA)
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText, // Envia o prompt completo que criamos acima
          image: base64Image  // Envia a imagem convertida
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro na comunicação com a IA');

      // 5. Limpa e processa o JSON recebido
      let text = data.result;
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      // Garante que pegamos apenas o objeto JSON
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
    // ... MANTENHA O SEU JSX DE RETORNO IGUAL AO QUE JÁ TINHA ...
    // Vou resumir aqui para não ficar gigante, mas o return não mudou.
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="max-w-4xl mx-auto">
             {/* ... todo o seu JSX de interface ... */}
             {/* Apenas certifique-se de que o botão chama handleAnalyze */}
             <Button 
               onClick={handleAnalyze} 
               disabled={isAnalyzing}
               className="w-full bg-indigo-700 hover:bg-indigo-800 h-14 text-lg font-bold shadow-md"
             >
               {isAnalyzing ? (
                 <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Analisando...</>
               ) : (
                 <><ImageIcon className="mr-2 h-5 w-5" /> Analisar Diagnóstico</>
               )}
             </Button>
             
             {/* ... Exibição dos resultados ... */}
             {diagnosisResult && (
                 /* ... seu código de exibição dos cards ... */
                 <div className="mt-8">
                    {/* Exemplo simples para garantir que exibe */}
                    <Card className="border-l-8 border-green-500">
                        <CardHeader><CardTitle>Diagnóstico Pronto</CardTitle></CardHeader>
                        <CardContent>
                            {diagnosisResult.possible_causes.map((c, i) => <div key={i}>{c}</div>)}
                        </CardContent>
                    </Card>
                 </div>
             )}
        </div>
    </div>
  );
}