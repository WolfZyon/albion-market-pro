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

### Craft & Refino (v2.1 — ATUAL)
- [x] **Refino:** 5 categorias × 7 tiers (T2-T8) com select de cidade
- [x] **Busca automática de preços via API** para bruto e refinado no refino
- [x] **Busca automática de preço de venda** no craft pelo nome do item
- [x] **Busca individual por material** no craft (botão 🔍 em cada linha)
- [x] Descrição dinâmica da receita conforme tier selecionado
- [x] Simulação genérica de craft com múltiplos materiais customizáveis
- [x] RRR (Taxa de Retorno de Recursos) — slider/input numérico
- [x] Taxa da estação/lojinha de craft — valor em prata
- [x] Cálculo de lucro líquido com imposto de venda
- [x] Painel de resultado com grid e detalhamento completo
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

## 🚧 Próximo Upgrade — Refino Avançado v3.0

**Objetivo:** Tornar o cálculo de refino **matematicamente correto** e adicionar **otimização de rotas entre cidades**.

### Problema atual (v2.1)
O refino T4+ exige, além do material bruto do tier atual, **1 unidade do material refinado do tier anterior** (ex: para fazer Couro T6, precisa de 2× Pele T6 + 1× Couro T5). A ferramenta atual:
- ✅ Busca o preço do bruto (Pele T6)
- ✅ Busca o preço do refinado (Couro T6)
- ❌ **Não inclui o custo do material do tier anterior** (Couro T5) no cálculo
- ❌ **Só opera com uma cidade** — não permite otimizar rotas tipo "compro em Bridgewatch, refino em Martlock, vendo em Thetford"

### O que será implementado

#### 1. Cálculo real do refino (T4+)
- [ ] Adicionar **busca automática do material do tier anterior** na API
- [ ] Incluir o custo do tier anterior no **Custo Total** do detalhamento
- [ ] Ajustar a descrição da receita para mostrar os 3 componentes quando aplicável
- [ ] Para T2 e T3, manter o cálculo atual (sem tier anterior)

#### 2. Otimização de rotas entre cidades
- [ ] **Modo Simples** (padrão): tudo na mesma cidade (comportamento atual)
- [ ] **Modo Avançado** (toggle/expand): três selects independentes:
  - **Cidade de Compra do Bruto** — onde compra a matéria-prima bruta
  - **Cidade de Compra do Tier Anterior** — onde compra o catalisador (T-1)
  - **Cidade de Venda do Refinado** — onde vende o produto final
- [ ] **Botão "Otimizar Rota"**: busca os preços nas 3 cidades e calcula o lucro real da rota
- [ ] **Custo de transporte** (input manual opcional): prata por slot de inventário ou por viagem, para o jogador ajustar o lucro líquido real

#### 3. Otimização automática (futuro)
- [ ] **Scan de todas as combinações** de cidades possíveis (7 cidades × 7 cidades × 7 cidades = 343 rotas)
- [ ] Mostrar as **top 3 rotas** com maior lucro líquido
- [ ] Card de resumo por rota: "Compre em X, refine em Y, venda em Z = Lucro Líquido: N"

### APIs necessárias
- `GET /api/v2/stats/prices/{item_id}.json?locations={city}&qualities=1` — já usada, só expandir para 3 chamadas independentes

### Itens a mapear adicionalmente
- IDs dos materiais refinados por tier (T2-T8) para cada categoria — **já mapeados em `REFINO_IDS`**

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

- **Craft & Refino v2.1**: preços automáticos via API
  - Refino: select de Tier + Cidade + botão "Buscar Preços da API"
  - Craft: select de Cidade + botão "Buscar Preço de Venda" + botão 🔍 por material
  - Dicionário `MATERIAL_NOME_PARA_ID` para traduzir nomes de materiais básicos
  - Funções assíncronas: `buscarPrecosRefino()`, `buscarPrecoVendaCraft()`, `buscarPrecoMaterial(n)`
- **CSS novo**: classes `.btn-api`, `.btn-api-buscar`, `.form-row-api`, `.form-group-api`
- **HTML reestruturado**: campos de cidade e botões de API adicionados sem quebrar layout existente

---

## 📅 Última atualização

Data: 13/08/2026
Chat: Upgrade Craft & Refino com valores automáticos via API