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

### Craft & Refino (v3.0 — ATUAL)
- [x] **Refino:** 5 categorias × 7 tiers (T2-T8) com select de cidade
- [x] **Busca automática de preços via API** para bruto, refinado e tier anterior (T-1)
- [x] **Cálculo real do refino T4+** incluindo custo do material do tier anterior
- [x] **Descrição dinâmica com quantidades reais** conforme tier e quantidade
- [x] **Retorno de recursos composto realista** (88% do teórico, considerando refinamento em cadeia)
- [x] **Bônus de Cidade** com banner verde e RRR base automático
- [x] **Botão "⚡ Aplicar RRR Automático"** que preenche o RRR real do jogo:
  - Sem bônus: **15.2%**
  - Com bônus de cidade: **36.7%**
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

### Geral
- [x] Navbar sticky com glassmorphism
- [x] Navegação SPA entre 4 páginas
- [x] Loading overlay
- [x] Sistema de tradução PT-BR → ID do jogo (200+ itens)
- [x] Formatação de prata (k, M, completo)
- [x] Design responsivo (mobile, tablet, desktop)
- [x] Footer com créditos
- [x] Teste de conectividade com a API (`testarAPI()`)
- [x] Fechar sugestões ao clicar fora do input
- [x] Atalho Enter nos inputs para acionar busca

---

## ❌ O que NÃO EXISTE ainda (gaps importantes)

### 1. Spec / Especialização
- Não há campo para nível de spec do personagem (0-100/400)
- Spec afeta diretamente o RRR real no jogo
- O RRR automático atual só considera base + bônus de cidade

### 2. Foco (Focus)
- Não há toggle "Usar Foco"
- Com foco ativado, o RRR sobe para 43.5% (sem bônus) ou 53.9% (com bônus)

### 3. Otimização de Rotas entre Cidades (completa)
- O botão "Ver preço de venda" já busca preços em todas as cidades
- Mas não há: comprar em X, refinar em Y, vender em Z — tudo é na mesma cidade
- Não há cálculo de custo de transporte entre cidades

### Bônus de Cidade no Albion (Refino):
| Cidade | Bônus de Refino | RRR Total |
|--------|-----------------|-----------|
| Bridgewatch | Pedra | 36.7% |
| Caerleon | Nenhum | 15.2% |
| Fort Sterling | Nenhum | 15.2% |
| Lymhurst | Fibra → Tecido | 36.7% |
| Martlock | Peles → Couro | 36.7% |
| Thetford | Minério → Metal | 36.7% |
| Brecilien | Nenhum | 15.2% |

**Valores oficiais do Albion:**
- Cidade sem bônus: **15.2%**
- Cidade com bônus/especializada: **36.7%**
- Com Foco (sem bônus): **43.5%**
- Com Foco (com bônus): **53.9%**

---

## 🚧 Próximo Upgrade — Refino Avançado v3.1 / v4.0

### Fase 3 — Otimização de Rotas Completa
- [ ] **Modo Simples** (padrão): tudo na mesma cidade (comportamento atual)
- [ ] **Modo Avançado** (toggle/expand): três selects independentes:
  - **Cidade de Compra do Bruto** — onde compra a matéria-prima bruta
  - **Cidade de Compra do Tier Anterior** — onde compra o catalisador (T-1)
  - **Cidade de Venda do Refinado** — onde vende o produto final
- [ ] **Custo de transporte** (input manual opcional): prata por slot de inventário ou por viagem
- [ ] **Scan de todas as combinações** de cidades possíveis (7×7×7 = 343 rotas)
- [ ] Mostrar as **top 3 rotas** com maior lucro líquido

### Fase 4 — Spec do Personagem
- [ ] **Input de Spec**: nível 0-400 que ajusta o RRR automaticamente
- [ ] Cada ponto de spec adiciona RRR conforme fórmula do jogo

### Fase 5 — Toggle de Foco
- [ ] **Toggle "Usar Foco"**: ON/OFF
- [ ] Quando ativado, aplica multiplicador de RRR do foco (43.5% ou 53.9%)

### Fase 6 — Otimização Automática (futuro)
- [ ] Integração real entre Refino e Flipper: sugestão automática de rota ótima
- [ ] Card de resumo por rota: "Compre em X, refine em Y, venda em Z = Lucro Líquido: N"

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

### Craft & Refino v3.0 — Refino Avançado
- **Fase 1 — Cálculo real do refino T4+:**
  - Adicionado campo "Preço do Tier Anterior" (T-1)
  - Cálculo inclui custo do material do tier anterior no custo total
  - Busca automática de 3 preços na API (bruto + refinado + T-1)
  - Detalhamento do resultado mostra linha separada para custo T-1
  - Descrição da receita mostra quantidades reais

- **Fase 2 — Bônus de Cidade + RRR Automático:**
  - Tabela `BONUS_CIDADE_REFINO` embutida no código (valores corrigidos)
  - Banner verde aparece quando a cidade tem bônus nativo para o material
  - Botão "⚡ Aplicar RRR Automático" calcula RRR real do jogo (15.2% / 36.7%)
  - Info "Base: X.X%" mostra o valor base abaixo do botão

- **Melhoria extra — Retorno composto realista:**
  - Retorno de recursos ajustado para 88% do valor composto teórico
  - Considera refinamento em cadeia, mas com margem para arredondamentos do jogo

- **Melhoria extra — Busca de preço de venda em todas as cidades:**
  - Botão "🔍 Ver preço de venda em todas as cidades"
  - Grid com preços do item refinado nas 7 cidades, ordenado do maior para o menor
  - Card de lucro se vender na cidade mais cara

---

## 📅 Última atualização

Data: 14/08/2026
Chat: Upgrade Refino Avançado v3.0 — Fase 1 (Tier Anterior) + Fase 2 (Bônus de Cidade + RRR Automático) + Retorno Composto Realista + Busca de Preço de Venda em Todas as Cidades