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
- [x] Exibição de preços por qualidade (Normal a Obra-prima)
- [x] Cards de preço por cidade
- [x] Ícones dos itens via API do Albion
- [x] **Fase 9 — Gráfico de Histórico de Preços:**
  - [x] Botão "📈 Histórico de Preços" aparece ao selecionar item
  - [x] Busca real na API do Albion (`/api/v2/stats/history/`)
  - [x] Gráfico de linha SVG puro com evolução do preço mín. de venda (últimos 30 dias)
  - [x] Média móvel de 7 dias como linha tracejada verde
  - [x] Select para alternar entre 7 cidades + Brecilien
  - [x] Tooltip interativo ao passar o mouse
  - [x] Indicador de tendência com variação percentual (▲/▼)
  - [x] Cache de 5 minutos no localStorage

### Black Market Scanner
- [x] Scan automático de ~60 itens populares
- [x] Filtro por nome em tempo real
- [x] Slider de lucro mínimo (até 5M)
- [x] Cards com: preço de compra, preço BM, taxa, lucro líquido
- [x] Toggle Premium
- [x] Cache de resultados para filtro rápido

### Craft & Refino (v4.1)
- [x] **Refino:** 5 categorias × 7 tiers (T2-T8) com select de cidade
- [x] **Busca automática de preços via API** para bruto, refinado e tier anterior (T-1)
- [x] **Cálculo real do refino T4+** incluindo custo do material do tier anterior
- [x] **Descrição dinâmica com quantidades reais** conforme tier e quantidade
- [x] **Retorno de recursos composto realista** (88% do teórico, considerando refinamento em cadeia)
- [x] **Bônus de Cidade** com banner verde e RRR base automático
- [x] **Toggle "Usar Foco"** — quando ativado, RRR sobe para 43.5% (sem bônus) ou 53.9% (com bônus)
- [x] **Otimização de Rotas (Avançado)** — 3 selects independentes:
  - Cidade de Compra do Bruto
  - Cidade de Compra do Tier Anterior (T-1)
  - Cidade de Venda do Refinado
- [x] **Botão "⚡ Aplicar RRR Automático"** que preenche o RRR real do jogo:
  - Sem bônus: **15.2%**
  - Com bônus de cidade: **36.7%**
  - Com Foco (sem bônus): **43.5%**
  - Com Foco (com bônus): **53.9%**
- [x] **Botão "🔍 Ver preço de venda em todas as cidades"** — busca o preço do refinado nas 7 cidades e mostra o lucro se vender na mais cara
- [x] **Tabela de bônus de cidade embutida** no código (corrigida conforme dados oficiais)
- [x] Simulação genérica de craft com múltiplos materiais customizáveis
- [x] RRR (Taxa de Retorno de Recursos) — slider/input numérico com opção de override manual
- [x] Taxa da estação/lojinha de craft — valor em prata
- [x] Cálculo de lucro líquido com imposto de venda
- [x] Painel de resultado com grid e detalhamento completo (inclui linha do T-1)
- [x] Toggle Premium
- [x] Abas separadas: Refino / Craft
- [x] Fallback manual em todos os campos de preço
- [x] **Try-catch** em todas as funções que manipulam DOM no módulo de refino

### Fase 6 — Custo de Transporte (v3.2)
- [x] **Input numérico** "Custo por viagem (prata)" — opcional
- [x] **Checkbox toggle** "Descontar transporte do lucro" — quando ativado, subtrai do lucro líquido final
- [x] **Aviso visual 🚨** automático quando a rota envolve Caerleon ou Brecilien (cidades de zona perigosa)
- [x] Linha de detalhamento no resultado mostrando o custo de transporte
- [x] Funciona tanto em **Refino** quanto em **Craft**

### Fase 7 — Scan Automático de Rotas (v4.0)
- [x] **Botão "🚀 Otimizar Rota (343 combinações)"** na aba Refino
- [x] Busca preços do bruto, refinado e T-1 nas **7 cidades em paralelo** (apenas 2-3 requisições à API)
- [x] Calcula localmente as **343 combinações** possíveis (7×7×7)
- [x] Mostra **top 3 rotas** em cards com medalhas 🥇🥈🥉
- [x] Cada card exibe: cidade de compra + preço, cidade T-1 + preço, cidade de venda + preço, RRR aplicado, transporte, lucro líquido, margem %
- [x] **Respeita todos os toggles existentes**: Premium, Foco, Custo de Transporte
- [x] **Aviso 🚨 automático** em rotas que passam por Caerleon/Brecilien
- [x] **Botão "✕ Cancelar Otimização"** — permite abortar o scan a qualquer momento

### Fase 8 — Cache Local (v4.1)
- [x] **Cache automático** de resultados da API no `localStorage` com TTL de **5 minutos**
- [x] `fetchPrices()` verifica cache **antes** de bater na API — retorna dados em cache se válidos
- [x] **Indicador visual** 🟢 "Fresco" / 🟡 "Cache" nos resultados (Flipper, Black Market, Buscar Item, Refino)
- [x] **Botão "🗑️ Limpar Cache"** no footer — remove todas as entradas manualmente
- [x] **Limpeza automática** de entradas expiradas quando o `localStorage` enche
- [x] Chave de cache baseada em hash dos parâmetros (item IDs + cidades + qualidades)

### Geral
- [x] Navbar sticky com glassmorphism
- [x] Navegação SPA entre 4 páginas
- [x] Loading overlay com **timeout automático de 15s** (bug fix)
- [x] Sistema de tradução PT-BR → ID do jogo (200+ itens)
- [x] Formatação de prata (k, M, completo)
- [x] Design responsivo (mobile, tablet, desktop)
- [x] Footer com créditos + botão limpar cache
- [x] Teste de conectividade com a API (`testarAPI()`)
- [x] Fechar sugestões ao clicar fora do input
- [x] Atalho Enter nos inputs para acionar busca
- [x] **`&lt;base target="_blank"&gt;` única** no `&lt;head&gt;` (bug fix — removidas 6 duplicatas)

---

## ❌ O que NÃO EXISTE ainda (gaps importantes)

### 1. Spec / Especialização do Personagem
- ~~Foi implementado e depois removido~~ — **Spec NÃO afeta o RRR no Albion Online**
- Spec/Refining Mastery (0-100) só reduz o **custo de Focus** por craft (Focus Cost Efficiency)
- O RRR é fixo e depende apenas de: cidade + bônus de cidade + uso de focus
- **NÃO adicionar input de spec** — daria informação falsa pro usuário

### 2. Flipper Automático
- [ ] Scan automático de flips entre todas as cidades (sem precisar digitar item)
- [ ] Lista as melhores oportunidades do momento

### 3. Exportar Dados
- [ ] Botão para copiar resultados como texto ou exportar CSV das rotas/scans

---

## 🐛 Bugs Conhecidos

- [x] ~~Falta de conexão impedia dados de serem puxados~~ → Adicionado `testarAPI()` para diagnóstico
- [x] ~~Múltiplas tags `&lt;base target="_blank"&gt;` duplicadas no `&lt;head&gt;`~~ → Corrigido (7x → 1x)
- [x] ~~Em conexões lentas, o loading podia travar se a API demorar muito~~ → Adicionado timeout de 15s no `setLoading()`

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

### v4.2 — Fase 9 (Gráficos de Histórico)
- **Fase 9 — Gráfico de Histórico de Preços:**
  - Botão "📈 Histórico de Preços" na aba Buscar Item (aparece ao selecionar item)
  - Busca real na API do Albion (`/api/v2/stats/history/{itemId}.json`)
  - Gráfico de linha SVG puro com evolução do preço mín. de venda (últimos 30 dias)
  - Média móvel de 7 dias como linha tracejada verde
  - Select para alternar entre 7 cidades + Brecilien
  - Tooltip interativo ao passar o mouse (preço + média)
  - Indicador de tendência com variação percentual (▲ verde / ▼ vermelho)
  - Cache de 5 minutos no localStorage (mesmo padrão do resto do app)
  - Design escuro combinando com o tema (#0b0f19, #c9a84c, #4ade80, #ef4444)
- **Bug fix extra:** removida tag `&lt;base target="_blank"&gt;` duplicada

### v4.1 — Fase 8 (Cache Local)
- **Fase 8 — Cache Local:**
  - Cache automático de resultados da API no `localStorage` (TTL 5 minutos)
  - `fetchPrices()` verifica cache antes de bater na API
  - Indicador visual 🟢 "Fresco" / 🟡 "Cache" nos resultados
  - Botão "🗑️ Limpar Cache" no footer
  - Limpeza automática de entradas expiradas

### v4.0 — Fase 7 (Scan Automático de Rotas)
- **Fase 7 — Otimização Automática Completa:**
  - Botão "🚀 Otimizar Rota (343 combinações)" na aba Refino
  - Busca paralela de preços nas 7 cidades (2-3 requisições apenas)
  - Cálculo local de todas as 343 combinações possíveis
  - Top 3 rotas exibidas em cards com medalhas, lucro líquido e margem %
  - Respeita toggles Premium, Foco e Custo de Transporte
  - Aviso 🚨 automático para rotas com Caerleon/Brecilien
  - Botão "✕ Cancelar Otimização" para abortar o scan

### v3.2 — Fase 6 (Custo de Transporte) + Bug Fixes
- **Fase 6 — Custo de Transporte:**
  - Input numérico opcional "Custo por viagem (prata)" em Refino e Craft
  - Toggle "Descontar transporte do lucro" — subtrai do lucro líquido final quando ativo
  - Aviso visual 🚨 automático quando rota envolve Caerleon ou Brecilien
  - Linha de detalhamento no resultado mostrando custo de transporte

- **Bug Fixes:**
  - Removidas 6 tags `&lt;base target="_blank"&gt;` duplicadas no `&lt;head&gt;`
  - Adicionado timeout de 15 segundos no `setLoading()` para evitar travamento em conexões lentas

---

## 📅 Última atualização

Data: 19/08/2026
Chat: Upgrade v4.2 — Fase 9 (Gráficos de Histórico de Preços)