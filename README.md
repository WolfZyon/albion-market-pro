# 🛡️ SilverForge — Albion Market Tools v2.0

Ferramenta web para jogadores de **Albion Online** focada em análise de mercado, flip de itens, Black Market e simulação de craft/refino.

🔗 **Dados em tempo real** via [Albion Online Data Project](https://www.albion-online-data.com)

---

## ⚔️ Módulos

| Módulo | Status | Descrição |
|--------|--------|-----------|
| **Flipper** | ✅ Pronto | Compara preços entre 7 cidades + Brecilien, calcula lucro líquido com taxas de anúncio e imposto de venda |
| **Buscar Item** | ✅ Pronto | Consulta preços de compra/venda em todas as cidades + Black Market de Caerleon, com filtro por qualidade |
| **Black Market Scanner** | ✅ Pronto | Escaneia ~60 itens populares, encontra oportunidades de lucro comprando nas cidades e vendendo no BM de Caerleon |
| **Craft & Refino** | ✅ Pronto | Simula lucro de refino (Metal, Couro, Tecido, Tábua, Pedra T2-T8) e craft genérico com múltiplos materiais, RRR, taxa de estação e imposto de venda |

---

## 🎨 Design

- **Tema:** Dark mode elegante com acentos dourados
- **Fontes:** Cinzel (títulos) + Inter (corpo)
- **Responsivo:** Mobile-first, adapta de desktop a celular
- **Estilo:** Cards com bordas arredondadas, glassmorphism na navbar, animações suaves, empty states ilustrados

---

## 🛠️ Tecnologias

- **HTML5** — SPA (Single Page Application) monolítico, todo o JS embutido
- **CSS3** puro (variáveis CSS, Grid, Flexbox, animações, glassmorphism)
- **JavaScript vanilla** (ES6+), sem frameworks
- **API REST:** Albion Online Data Project

---

## 📂 Estrutura
albion-market-pro/
├── index.html          # Página principal (SPA) — HTML + JS embutido (~90 KB)
├── css/
│   └── style.css       # Estilos completos
├── README.md           # Este arquivo
└── CONTEXT.md          # Estado atual e próximos passos do projeto


> **Nota:** O projeto foi unificado em um único arquivo `index.html`. A lógica JavaScript que antes ficava em `js/app.js` foi totalmente embutida no HTML para facilitar deploy e eliminar problemas de path/ CORS em abertura local.

---

## 🚀 Como usar

1. Baixe ou clone o repositório
2. Abra `index.html` diretamente no navegador (Chrome, Edge, Firefox)
   - Não precisa de servidor local nem build
3. Navegue pelos módulos pelo menu superior
4. Digite o nome do item em **português** (ex: "claymore", "bolsa", "capa", "machado")
5. O sistema traduz automaticamente para o ID do jogo e busca os preços reais

---

## 🔧 Funcionalidades Detalhadas

### Flipper
- Busca por nome em português com autocomplete
- Comparação de preços entre 7 cidades + Brecilien
- Cálculo de lucro líquido com taxa de venda (4% Premium / 8% normal)
- Stats cards no topo (melhor flip, lucro somado, margem média)
- Toggle Premium

### Buscar Item
- Lista de itens populares pré-carregada
- Busca com sugestões em português
- Exibição de preços por qualidade (Normal, Boa, Excelente, Obra-prima, Lendário)
- Cards de preço por cidade com ícones via API do Albion

### Black Market Scanner
- Scan automático de ~60 itens populares
- Filtro por nome em tempo real
- Slider de lucro mínimo (até 5M)
- Cards com: preço de compra, preço BM, taxa, lucro líquido
- Toggle Premium
- Cache de resultados para filtro rápido

### Craft & Refino
- **Refino:** 25 receitas (Metal, Couro, Tecido, Tábua, Pedra) T2-T8
- **Craft:** Simulação genérica com múltiplos materiais customizáveis (adicionar/remover linhas)
- Simulação com RRR (Taxa de Retorno de Recursos)
- Taxa de estação customizável
- Cálculo de lucro líquido com imposto de venda
- Painel de resultado com grid e detalhamento completo
- Toggle Premium

### Geral
- Dicionário de tradução PT-BR → ID do jogo (200+ itens)
- Formatação inteligente de prata (k, M, valor completo)
- Teste de conectividade com a API ao carregar
- Loading overlay
- Fechar sugestões ao clicar fora
- Atalho Enter nos inputs de busca

---

> 💡 Veja `CONTEXT.md` para o estado atual, bugs conhecidos e próximos passos do projeto.