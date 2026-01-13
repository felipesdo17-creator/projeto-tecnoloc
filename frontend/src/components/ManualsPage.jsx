import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  ArrowLeft, FileText, Search, Download, ExternalLink, 
  HardDrive, Plus, Upload, Loader2, X 
} from 'lucide-react';

export default function ManualsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Lista de manuais (Simulando o banco de dados)
  const [manuals, setManuals] = useState([
    { id: 1, title: "Manual Torre de Iluminação", model: "MLT6SKD", brand: "Allmand", size: "4.2 MB" },
    { id: 2, title: "Manual Grupo Gerador", model: "GSW 30", brand: "Pramac", size: "8.1 MB" },
    { id: 3, title: "Manual Motor Diesel", model: "404D-22G", brand: "Perkins", size: "3.5 MB" },
  ]);

  // Função para simular o upload
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simula o tempo de upload e leitura da IA
    setTimeout(() => {
      const newManual = {
        id: Date.now(),
        title: e.target.title.value,
        brand: e.target.brand.value,
        model: e.target.model.value,
        size: "2.5 MB"
      };
      
      setManuals([newManual, ...manuals]);
      setIsUploading(false);
      setShowUploadModal(false);
      alert("Manual enviado e indexado com sucesso!");
    }, 2000);
  };

  const filteredManuals = manuals.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Biblioteca Técnica</h1>
              <p className="text-slate-500">Gestão de Manuais e Documentação</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar..." 
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* BOTÃO DE ADMIN */}
            <Button onClick={() => setShowUploadModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Grade de Manuais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManuals.map((manual) => (
            <Card key={manual.id} className="group hover:shadow-md transition-all border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <span className="text-xs font-mono text-slate-400">{manual.size}</span>
                </div>
                <CardTitle className="text-lg mt-4">{manual.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-500 mb-4">
                  <p><strong>Marca:</strong> {manual.brand}</p>
                  <p><strong>Modelo:</strong> {manual.model}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs">Visualizar</Button>
                  <Button variant="secondary" className="flex-1 text-xs">Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MODAL DE UPLOAD (Aparece quando clica em Upload) */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Enviar Novo Manual</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowUploadModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Manual</Label>
                    <Input id="title" name="title" placeholder="Ex: Manual de Operação Torre" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marca</Label>
                      <Input id="brand" name="brand" placeholder="Ex: Perkins" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Modelo</Label>
                      <Input id="model" name="model" placeholder="Ex: 404D" required />
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Clique para selecionar o PDF ou arraste aqui</p>
                    <input type="file" className="hidden" accept=".pdf" />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600" disabled={isUploading}>
                    {isUploading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
                    ) : (
                      "Confirmar Upload"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}