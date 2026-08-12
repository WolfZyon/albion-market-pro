# 🛡️ SilverForge — Albion Market Tools v2.0

Ferramenta web para jogadores de **Albion Online** focada em análise de mercado, flip de itens, Black Market e simulação de craft/refino.

🔗 **Dados em tempo real** via [Albion Online Data Project](https://www.albion-online-data.com)

---

## ⚔️ Módulos

| Módulo | Status | Descrição |
|--------|--------|-----------|
| **Flipper** | ✅ Pronto | Compara preços entre cidades, calcula lucro líquido com taxas |
| **Buscar Item** | ✅ Pronto | Consulta preços de compra/venda em todas as cidades + Black Market |
| **Black Market Scanner** | ✅ Pronto | Encontra oportunidades de lucro comprando nas cidades e vendendo no BM de Caerleon |
| **Craft & Refino** | ✅ Pronto | Simula lucro de refino com RRR, taxa de estação e imposto de venda |

---

## 🎨 Design

- **Tema:** Dark mode elegante com acentos dourados
- **Fontes:** Cinzel (títulos) + Inter (corpo)
- **Responsivo:** Mobile-first, adapta de desktop a celular
- **Estilo:** Cards com bordas arredondadas, glassmorphism na navbar, animações suaves

---

## 🛠️ Tecnologias

- HTML5 (SPA — Single Page Application)
- CSS3 puro (variáveis CSS, Grid, Flexbox, animações)
- JavaScript vanilla (ES6+)
- API REST: Albion Online Data Project

---

## 📂 Estrutura

```
albion-market-pro/
├── index.html          # Página principal (SPA)
├── css/
│   └── style.css       # Estilos completos
├── js/
│   └── app.js          # Lógica de todos os módulos
├── README.md           # Este arquivo
└── CONTEXT.md          # Estado atual do projeto
```

---

## 🚀 Como usar

1. Abra `index.html` no navegador
2. Navegue pelos módulos pelo menu superior
3. Digite o nome do item em português (ex: "claymore", "bolsa", "capa")
4. O sistema traduz automaticamente para o ID do jogo

---

> 💡 Veja `CONTEXT.md` para o estado atual e próximos passos do projeto.
