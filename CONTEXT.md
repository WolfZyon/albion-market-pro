# 📝 Contexto Atual — SilverForge

> **ATUALIZE este arquivo** a cada mudança no projeto.
> Serve para que o assistente (Kimi) entenda rapidamente o estado do código em novos chats.

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

### Craft & Refino (v3.1 — ATUAL)
- [x] **Refino:** 5 categorias × 7 tiers (T2-T8) com select de cidade
- [x] **Busca automática de preços via API** para bruto, refinado e tier anterior (T-1)
- [x] **Cálculo real do refino T4+** incluindo custo do material do tier anterior
- [x] **Descrição dinâmica com quantidades reais** conforme tier e quantidade
- [x] **Retorno de recursos composto realista** (88% do teórico, considerando refinamento em cadeia)
- [x] **Bônus de Cidade** com banner verde e RRR base automático
- [x] **Toggle "Usar Foco"** — quando ativado, RRR sobe para 43.5% (sem bônus) ou 53.9% (com bônus)
  - **Input RRR atualiza automaticamente** quando o toggle muda (via `atualizarDescRefino()`)
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

### 1. Spec / Especialização do Personagem
- ~~Foi implementado e depois removido~~ — **Spec NÃO afeta o RRR no Albion Online**
- Spec/Refining Mastery (0-100) só reduz o **custo de Focus** por craft (Focus Cost Efficiency)
- O RRR é fixo e depende apenas de: cidade + bônus de cidade + uso de focus
- **NÃO adicionar input de spec** — daria informação falsa pro usuário

### 2. Custo de Transporte entre Cidades
- A otimização de rotas mostra preços de 3 cidades diferentes, mas não calcula custo de viagem
- Transporte entre cidades reais custa tempo + risco de PvP (zona vermelha/preta)
- Poderia adicionar input manual de "custo de transporte por unidade" no futuro

### 3. Otimização Automática Completa
- O botão "Ver preço de venda" já busca preços em todas as cidades
- Mas não há scan automático das 343 combinações possíveis (7×7×7) de rotas
- Não há ranking automático das top N rotas com maior lucro

### Bônus de Cidade no Albion (Refino):
| Cidade | Bônus de Refino | RRR Total (sem foco) | RRR Total (com foco) |
|--------|-----------------|----------------------|----------------------|
| Bridgewatch | Pedra | 36.7% | 53.9% |
| Caerleon | Nenhum | 15.2% | 43.5% |
| Fort Sterling | Nenhum | 15.2% | 43.5% |
| Lymhurst | Fibra → Tecido | 36.7% | 53.9% |
| Martlock | Peles → Couro | 36.7% | 53.9% |
| Thetford | Minério → Metal | 36.7% | 53.9% |
| Brecilien | Nenhum | 15.2% | 43.5% |

**Valores oficiais do Albion:**
- Cidade sem bônus: **15.2%**
- Cidade com bônus/especializada: **36.7%**
- Com Foco (sem bônus): **43.5%**
- Com Foco (com bônus): **53.9%**

---

## 🚧 Próximo Upgrade — v3.2 / v4.0

### Fase 6 — Custo de Transporte
- [ ] Input manual de "custo de transporte por unidade" ou "custo por viagem"
- [ ] Checkbox "Considerar custo de transporte no lucro líquido"
- [ ] Aviso visual quando a rota envolver cidades de zona perigosa (Caerleon, Brecilien)

### Fase 7 — Scan Automático de Rotas
- [ ] Botão "🚀 Otimizar Rota" que busca preços nas 343 combinações possíveis
- [ ] Mostrar top 3 rotas com maior lucro líquido
- [ ] Card por rota: "Compre em X, refine em Y, venda em Z = Lucro: N"

### Fase 8 — Cache Local
- [ ] Salvar resultados de busca no `localStorage` por 5 minutos
- [ ] Evitar requisições repetidas à API para o mesmo item/cidade
- [ ] Indicador visual de "dados em cache" vs "dados frescos"

### Fase 9 — Gráficos de Histórico
- [ ] Gráfico de preço do item ao longo do tempo (se API permitir)
- [ ] Média móvel de 7 dias para identificar tendência

---

## 🐛 Bugs conhecidos
- [x] ~~Falta de conexão impedia dados de serem puxados~~ → Adicionado `testarAPI()` para diagnóstico
- [ ] Múltiplas tags `<base target="_blank">` duplicadas no `<head>` do `index.html` (5x) — não quebra funcionalidade, mas polui o markup
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

### Craft & Refino v3.1 — Foco + Otimização de Rotas
- **Fase 3 — Otimização de Rotas:**
  - Adicionados 3 selects independentes: Cidade do Bruto, Cidade do T-1, Cidade de Venda
  - Busca de preços nas 3 cidades separadamente via API
  - Seção visual destacada com fundo dourado e label "🗺️ Otimização de Rotas (Avançado)"

- **Fase 5 — Toggle de Foco:**
  - Toggle switch "Usar Foco" na aba Refino
  - Quando ativado, sobrescreve o RRR para 43.5% (sem bônus) ou 53.9% (com bônus)
  - **Correção de bug:** input RRR agora atualiza automaticamente quando o toggle muda (via `atualizarDescRefino()` chamando `getRRRBase()` e setando `rrrInput.value`)
  - Integrado com o botão "Aplicar RRR Automático" e o info text

- **Correção importante — Spec removido:**
  - Input "Spec do Personagem (0-400)" foi implementado e depois removido
  - Motivo: Spec/Refining Mastery NÃO afeta o RRR no Albion Online
  - Spec só reduz o custo de Focus por craft (Focus Cost Efficiency)
  - O RRR é fixo e depende apenas de: cidade + bônus + uso de focus
  - Removido para não passar informação falsa pro usuário

- **Try-catch em funções de refino:**
  - `buscarPrecosRefino()` — try-catch + reset de estado do botão em caso de erro
  - `aplicarRRRAutomatico()` — try-catch
  - `calcularRefino()` — try-catch completo
  - Previne travamento da interface se algum elemento DOM não for encontrado

---

## 📅 Última atualização

Data: 14/08/2026
Chat: Upgrade Refino v3.1 — Fase 3 (Otimização de Rotas) + Fase 5 (Toggle de Foco) + Correção (remoção de Spec falso + bug fix foco auto-update) + Try-catch