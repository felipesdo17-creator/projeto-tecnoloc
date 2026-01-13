import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Save, Database, CheckCircle, FileText } from 'lucide-react';

// SUPABASE CONFIG
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('');
  const [content, setContent] = useState('');

  const handleSaveManual = async () => {
    if (!model || !content) {
      alert("Preencha o modelo e o conteúdo do manual.");
      return;
    }

    setLoading(true);
    try {
      // 1. Verifica se já existe
      const { data: existing } = await supabase
        .from('manuals')
        .select('id')
        .ilike('model', model)
        .single();

      if (existing) {
        const confirmUpdate = window.confirm(`O modelo ${model} já existe. Deseja atualizar o conteúdo?`);
        if (!confirmUpdate) {
            setLoading(false);
            return;
        }
        
        // Atualiza
        const { error } = await supabase
            .from('manuals')
            .update({ content: content })
            .eq('id', existing.id);
            
        if (error) throw error;
        alert("Manual atualizado com sucesso!");

      } else {
        // Cria novo
        const { error } = await supabase
            .from('manuals')
            .insert({ model: model, content: content });

        if (error) throw error;
        alert("Novo manual cadastrado com sucesso!");
      }

      // Limpa formulário
      setModel('');
      setContent('');

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6 hover:bg-slate-200">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Início
        </Button>

        <Card className="border-t-4 border-t-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 text-2xl">
              <Database className="h-6 w-6" />
              Gestão de Base de Conhecimento
            </CardTitle>
            <p className="text-slate-500">Cadastre novos manuais técnicos para a IA consultar.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 text-sm text-blue-800">
                <FileText className="h-5 w-5 shrink-0" />
                <p>
                    <strong>Dica:</strong> Copie e cole o texto completo dos PDFs aqui. 
                    Inclua códigos de erro, tabelas de torques e procedimentos de desmontagem.
                    Quanto mais detalhes técnicos, melhor a IA será.
                </p>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-lg">Modelo do Equipamento *</Label>
              <Input 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: RT-82 ou ET-18"
                className="h-12 text-lg bg-white"
              />
              <p className="text-xs text-slate-400">Digite exatamente como vem na placa de identificação.</p>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-lg">Conteúdo do Manual Técnico *</Label>
              <Textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                placeholder="Cole aqui o texto do manual..."
                rows={15}
                className="bg-white font-mono text-sm leading-relaxed"
              />
            </div>

            <Button 
              onClick={handleSaveManual} 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 h-14 text-lg font-bold"
            >
              {loading ? "Salvando..." : <><Save className="mr-2" /> Salvar na Base de Dados</>}
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}