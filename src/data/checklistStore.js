// src/data/checklistStore.js

// 1. Dados iniciais (Modelos que já vem no sistema)
export const initialTemplates = [
  {
    id: 'gerador-padrao',
    name: 'Gerador de Energia (Modelo Básico)',
    type: 'gerador',
    sections: [
      {
        title: "Motor e Fluidos",
        items: [
          { id: "oleo", label: "Nível do óleo e viscosidade" },
          { id: "agua", label: "Nível da água do radiador" },
          { id: "vazamentos", label: "Vazamentos aparentes" }
        ]
      }
    ]
  }
];

// 2. Simulador de IA (Agora com TODOS os itens do PDF F-170)
export const simulateAIAnalysis = (file) => {
  return new Promise((resolve) => {
    
    console.log(`Processando arquivo: ${file.name}`);

    setTimeout(() => {
      // Verifica se é o arquivo de Torre (ou qualquer PDF que contenha 'torre' ou '170')
      const isTorre = file.name.toLowerCase().includes('torre') || file.name.includes('170');

      if (isTorre) {
        resolve({
          id: `torre-f170-${Date.now()}`,
          name: 'Torre de Iluminação (Modelo F-170 Completo)',
          type: 'torre',
          sections: [
            {
              title: "1. Filtros e Fluidos (Preventiva)",
              items: [
                { id: "f_ar", label: "Filtro de ar Primário" },
                { id: "f_comb_prim", label: "Filtro de combustível primário" },
                { id: "f_comb_sec", label: "Filtro de combustível secundário" },
                { id: "f_oleo", label: "Filtro de Óleo" },
                { id: "oleo_lub", label: "Óleo lubrificante (Nível e Estado)" },
                { id: "oleo_motor", label: "Verificar nível de óleo motor" }
              ]
            },
            {
              title: "2. Motor e Arrefecimento",
              items: [
                { id: "correia", label: "Condição e tensionamento da correia do alternador" },
                { id: "arrefecimento", label: "Sistema de arrefecimento (Nível e Qualidade)" },
                { id: "pescador", label: "Verificar pescador do tanque de combustível" },
                { id: "bomba_transf", label: "Bomba de transferência (Motores CAT)" },
                { id: "parafusos_motor", label: "Verificar parafusos e coxins do motor" },
                { id: "mangueira_oleo", label: "Mangueira e registro para retirada de óleo" }
              ]
            },
            {
              title: "3. Sistema Elétrico",
              items: [
                { id: "alt_tensao", label: "Tensão de saída do alternador C.C" },
                { id: "bateria_polos", label: "Bateria (Suporte, tensão, fixação dos polos)" },
                { id: "teste_bateria", label: "Teste de carga da bateria (com testador)" },
                { id: "tomadas", label: "Tensão de saída das tomadas" },
                { id: "disjuntor", label: "Disjuntor Geral e teste de lâmpadas" },
                { id: "lacre_painel", label: "Lacre de verificação no interior do painel" },
                { id: "cabos_painel", label: "Cabos e componentes do painel (Aperto/Oxidação)" }
              ]
            },
            {
              title: "4. Estrutura e Mecânica",
              items: [
                { id: "patolas", label: "Niveladores (Patolas) e funcionamento" },
                { id: "pinos_trava", label: "Pinos trava das patolas e mastro" },
                { id: "mastro_rot", label: "Rotação do mastro e pino de travamento" },
                { id: "catracas", label: "Verificar funcionamento das catracas" },
                { id: "cambao", label: "Verificar cambão e reboque" },
                { id: "pneus", label: "Pneus (Estado e Calibragem)" },
                { id: "marcador_rodas", label: "Marcador químico nas porcas de roda" },
                { id: "portas", label: "Portas (Alinhamento, travas, dobradiças)" },
                { id: "parafusos_geral", label: "Conferir aperto de parafusos GERAL" }
              ]
            },
            {
              title: "5. Iluminação",
              items: [
                { id: "lampadas", label: "Lâmpadas e Refletores (Funcionamento)" },
                { id: "limpeza_lentes", label: "Limpeza interna das lentes dos refletores" }
              ]
            },
            {
              title: "6. Limpeza e Acabamento",
              items: [
                { id: "limp_tanque", label: "Limpeza do tanque de combustível" },
                { id: "limp_motor", label: "Limpeza do motor" },
                { id: "limp_radiador", label: "Limpeza do radiador" },
                { id: "adesivacao", label: "Adesivação (Tecnoloc, Preventiva)" },
                { id: "pintura", label: "Pintura do equipamento (Retoques necessários?)" }
              ]
            }
          ]
        });
      } else {
        // Caso suba um arquivo desconhecido
        resolve({
          id: `custom-${Date.now()}`,
          name: `Checklist Genérico (${file.name})`,
          type: 'custom',
          sections: [
            {
              title: "Itens Gerais Identificados",
              items: [
                { id: "item_1", label: "Verificação de Estado Geral" },
                { id: "item_2", label: "Funcionamento Operacional" },
                { id: "item_3", label: "Limpeza e Conservação" }
              ]
            }
          ]
        });
      }
    }, 2000); // 2 segundos de "processamento"
  });
};