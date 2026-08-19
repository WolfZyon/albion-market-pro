# 🏛️ SilverForge — Albion Market Tools

&gt; Ferramenta não oficial para **Albion Online** que transforma diferença de preço em prata.  
&gt; Dados reais via [Albion Online Data Project](https://www.albion-online-data.com/).

![Versão](https://img.shields.io/badge/versão-v4.2-gold)
![Status](https://img.shields.io/badge/status-ativo-success)
![Dados](https://img.shields.io/badge/dados-reais-blue)

---

## ✨ Funcionalidades

### 📊 Flipper
- Busca por nome em **português** com autocomplete
- Comparação de preços entre **7 cidades + Brecilien**
- Cálculo de lucro líquido com taxa de venda (4% Premium / 8% normal)
- Tabela de resultados com ícones, rotas e lucro
- Stats cards no topo: melhor flip, lucro somado, margem média

### 🔍 Buscar Item
- Lista de itens populares pré-carregada
- Busca com sugestões em português
- Exibição de preços por qualidade (Normal a Obra-prima)
- Cards de preço por cidade + Black Market
- Ícones dos itens via API do Albion
- **📈 Gráfico de Histórico de Preços** (Fase 9)

### 🖤 Black Market Scanner
- Scan automático de ~60 itens populares
- Filtro por nome em tempo real
- Slider de lucro mínimo
- Cards com preço de compra, preço BM, taxa, lucro líquido

### ⚒️ Craft & Refino
- **Refino:** 5 categorias × 7 tiers (T2-T8) com cálculo real
- **Craft:** Simulação com múltiplos materiais customizáveis
- Busca automática de preços via API
- RRR (Taxa de Retorno de Recursos) com bônus de cidade
- Toggle "Usar Foco" para RRR aumentado
- **Otimização de Rotas:** scan de 343 combinações com top 3 resultados
- **Custo de Transporte:** input opcional com aviso de zona perigosa

---

## 🚀 Como usar

### Opção 1: Abrir direto no navegador
1. Baixe o arquivo `index.html`
2. Dê dois cliques para abrir no navegador
3. Pronto! Não precisa de servidor

### Opção 2: Deploy no GitHub Pages
1. Faça um fork deste repositório
2. Vá em **Settings &gt; Pages**
3. Selecione a branch `main` e a pasta `/ (root)`
4. Seu site estará em `https://seu-usuario.github.io/albion-market-pro/`

---

## 🗺️ Roadmap

| Fase | Funcionalidade | Status |
|------|---------------|--------|
| v1.0 | Flipper básico | ✅ |
| v2.0 | Buscar Item + Black Market | ✅ |
| v3.0 | Craft & Refino com bônus de cidade | ✅ |
| v3.1 | RRR automático + Foco | ✅ |
| v3.2 | Custo de Transporte | ✅ |
| v4.0 | Scan Automático de Rotas (343 combinações) | ✅ |
| v4.1 | Cache Local (localStorage, TTL 5min) | ✅ |
| **v4.2** | **Gráficos de Histórico de Preços** | ✅ |
| v5.0 | Flipper Automático (scan sem digitar item) | 🔄 |
| v5.1 | Exportar dados (CSV / copiar texto) | 🔄 |

---

## 🎨 Stack Tecnológica

- **HTML5** — estrutura monolítica (arquivo único)
- **CSS3** — design system customizado, glassmorphism, responsivo
- **Vanilla JavaScript** — sem frameworks, sem dependências externas
- **SVG** — gráficos de histórico renderizados nativamente
- **Albion Online Data Project API** — dados reais do mercado

---

## 🖼️ Screenshots

&gt; *Adicione screenshots das 4 abas aqui*

---

## ⚠️ Avisos

- **Não é afiliado ao Albion Online** — ferramenta feita pela comunidade
- Dados podem ter delay de alguns minutos (dependem da API pública)
- Sempre confirme preços no jogo antes de fazer trades de alto valor
- O uso de dados da API está sujeito aos [termos do Albion Online Data Project](https://www.albion-online-data.com/)

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: minha feature'`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📜 Licença

MIT License — use à vontade, mas sem garantias.

---

## 🙏 Créditos

- **Albion Online Data Project** — por disponibilizar a API pública
- **Albion Online** — Sandbox Interactive GmbH

---

&lt;p align="center"&gt;
  &lt;strong&gt;SilverForge&lt;/strong&gt; — Transforme diferença de preço em prata.
&lt;/p&gt;