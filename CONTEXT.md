# 📝 Contexto Atual — SilverForge

&gt; **ATUALIZE este arquivo** a cada mudança no projeto.
&gt; Serve para que o assistente (Kimi) entenda rapidamente o estado do código em novos chats.

---

## ✅ O que está PRONTO

### Flipper
- [x] Busca por nome em português com autocomplete
- [x] Comparação de preços entre 7 cidades + Brecilien
- [x] Cálculo de lucro líquido com taxa de venda (4% Premium / 8% normal)
- [x] Tabela de resultados com ícones, rotas e lucro
- [x] Stats cards no topo (melhor flip, lucro somado, margem média)
- [x] Toggle Premium

### Buscar Item
- [x] Lista de itens populares pré-carregada
- [x] Busca com sugestões em português
- [x] Exibição de preços por qualidade (Normal a Lendário)
- [x] Cards de preço por cidade
- [x] Ícones dos itens via API do Albion

### Black Market Scanner
- [x] Scan automático de ~60 itens populares
- [x] Filtro por nome em tempo real
- [x] Slider de lucro mínimo (até 5M)
- [x] Cards com: preço de compra, preço BM, taxa, lucro líquido
- [x] Toggle Premium
- [x] Cache de resultados para filtro rápido

### Craft & Refino
- [x] **Refino:** 25 receitas (Metal, Couro, Tecido, Tábua, Pedra) T2-T8
- [x] **Craft:** Simulação genérica com múltiplos materiais customizáveis (adicionar/remover linhas dinamicamente)
- [x] Simulação com RRR (Taxa de Retorno de Recursos)
- [x] Taxa de estação customizável (slider/input)
- [x] Cálculo de lucro líquido com imposto de venda
- [x] Painel de resultado com grid e detalhamento completo
- [x] Toggle Premium
- [x] Abas separadas: Refino / Craft

### Geral
- [x] Navbar sticky com glassmorphism
- [x] Navegação SPA entre 4 páginas
- [x] Loading overlay
- [x] Sistema de tradução PT-BR → ID do jogo (200+ itens, dicionário embutido no HTML)
- [x] Formatação de prata (k, M, completo)
- [x] Design responsivo (mobile, tablet, desktop)
- [x] Footer com créditos
- [x] Teste de conectividade com a API (`testarAPI()`)
- [x] Fechar sugestões ao clicar fora do input
- [x] Atalho Enter nos inputs para acionar busca

---

## 🚧 Em andamento / Melhorias futuras

- [ ] Adicionar mais itens ao dicionário de tradução
- [ ] Gráficos de histórico de preços
- [ ] Página de "Sobre" / tutorial
- [ ] Sistema de favoritos / watchlist
- [ ] Exportar resultados (CSV/JSON)
- [ ] Cache local dos dados da API (localStorage)
- [ ] Animações de entrada mais elaboradas
- [ ] Tema claro (light mode)

## 🔄 Integração Automática — Craft & Refino

**Objetivo:** O módulo **Craft & Refino** deve puxar os preços de mercado em tempo real via API do Albion Online Data Project, eliminando a necessidade de digitar valores manualmente.

### O que ficará automático (API)
- [ ] Preço do material **bruto** (ex: Minério de Cobre T4)
- [ ] Preço do material **refinado** (ex: Barra de Aço T4)
- [ ] Preço de **múltiplos materiais** no módulo Craft

### O que continuará manual (input do usuário)
- [ ] Toggle **Premium** (imposto 4% vs 8%)
- [ ] **Taxa de Retorno de Recursos (RRR)** — slider/input numérico
- [ ] **Taxa da estação/lojinha de craft** — valor em prata
- [ ] **Quantidade** do lote a produzir
- [ ] **Nível/tier** da receita selecionada

### Como funciona
1. Usuário seleciona a receita (ex: Metal T4 → T5) e a cidade de referência
2. Sistema consulta a API para buscar o preço atual do bruto e do refinado naquela cidade
3. Preços são preenchidos automaticamente nos campos (com opção de override manual)
4. Cálculo de lucro usa os valores da API + inputs manuais do usuário

### APIs necessárias
- `GET /api/v2/stats/prices/{item_id}.json?locations={city}&qualities=1` — preço do material bruto
- `GET /api/v2/stats/prices/{item_id}.json?locations={city}&qualities=1` — preço do material refinado

### Itens a mapear
- Dicionário de IDs dos materiais brutos e refinados por tier (T2-T8) para cada categoria: Metal, Couro, Tecido, Tábua, Pedra

&gt; 💡 **Nota:** Essa integração será implementada em chat futuro. Manter os campos manuais como fallback caso a API falhe ou o usuário queira simular com preços hipotéticos.
---

## 🐛 Bugs conhecidos

- [x] ~~Falta de conexão impedia dados de serem puxados~~ → Adicionado `testarAPI()` para diagnóstico
- [ ] Múltiplas tags `&lt;base target="_blank"&gt;` duplicadas no `&lt;head&gt;` do `index.html` (5x) — não quebra funcionalidade, mas polui o markup
- [ ] Em conexões lentas, o loading pode travar se a API demorar muito — considerar timeout

---

## 🎨 Decisões de Design

- **Fontes:** Cinzel (títulos), Inter (corpo)
- **Cores principais:**
  - Fundo: `#0b0f19`
  - Cards: `#111827`
  - Dourado: `#c9a84c`
  - Verde lucro: `#4ade80`
  - Vermelho prejuízo: `#ef4444`
- **Bordas arredondadas:** 12px (cards), 8px (inputs)
- **Sombras:** `0 4px 24px rgba(0,0,0,0.5)`
- **Arquitetura:** Arquivo monolítico (`index.html` com todo o JS embutido) para facilitar deploy local e evitar problemas de CORS/path

---

## 🏗️ Mudanças Recentes (último commit)

- **Removido `js/app.js`**: toda a lógica JavaScript foi embutida no `index.html`
- **Projeto monolítico**: agora basta abrir `index.html` no navegador, sem dependências de arquivo JS externo
- **Adicionado módulo Craft**: simulação genérica com múltiplos materiais, além do Refino já existente
- **Adicionado teste de conectividade** (`testarAPI`) para diagnóstico de problemas de rede
- **Navbar atualizada**: removido botão de "dados reais" (agora todos os dados são sempre reais)

---

## 📅 Última atualização

Data: 13/08/2026
Chat: Atualização de README e CONTEXT