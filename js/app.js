// ============================================
// SILVERFORGE — ALBION MARKET TOOLS v2.1
// ============================================

const API_BASE = 'https://west.albion-online-data.com/api/v2/stats/prices';
const CIDADES = ['Bridgewatch','Caerleon','Fort Sterling','Lymhurst','Martlock','Thetford'];
const CIDADES_COM_BRECILIEN = ['Bridgewatch','Caerleon','Fort Sterling','Lymhurst','Martlock','Thetford','Brecilien'];
let usarDadosExemplo = true;

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  const btn = document.querySelector('.nav-btn[data-page="' + page + '"]');
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'blackmarket') carregarBM();
  if (page === 'buscar') initBuscar();
}

function toggleDadosExemplo() {
  const btn = document.getElementById('btnDadosExemplo');
  usarDadosExemplo = !usarDadosExemplo;
  btn.textContent = usarDadosExemplo ? 'Dados de exemplo' : 'Usar API real';
  btn.style.borderColor = usarDadosExemplo ? 'var(--gold-dark)' : 'var(--green)';
  btn.style.color = usarDadosExemplo ? 'var(--gold)' : 'var(--green)';
}

function setLoading(show) {
  const el = document.getElementById('loading');
  if (el) el.classList.toggle('active', show);
}

function formatSilver(n) {
  if (n === null || n === undefined || n <= 0) return '-';
  if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toLocaleString('pt-BR');
}

function formatSilverFull(n) {
  if (n === null || n === undefined || n <= 0) return '-';
  return n.toLocaleString('pt-BR');
}

function formatPercent(n) {
  if (n === null || n === undefined) return '-';
  return (n * 100).toFixed(1) + '%';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getItemIconUrl(id) {
  return 'https://render.albiononline.com/v1/item/' + id + '.png';
}

async function fetchPrices(items, locations, qualities) {
  if (usarDadosExemplo) return [];
  if (!items || !items.length) return [];
  const locStr = locations.join(',');
  const qualStr = (qualities || [1]).join(',');
  const chunkSize = 200;
  const allData = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const url = API_BASE + '/' + chunk.join(',') + '.json?locations=' + encodeURIComponent(locStr) + '&qualities=' + qualStr;
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const data = await r.json();
      if (Array.isArray(data)) allData.push(...data);
    } catch (e) {
      console.warn('Fetch error:', e.message);
    }
  }
  return allData;
}

function getPrice(data, itemId, city, quality) {
  const entries = data.filter(e => e.item_id === itemId && e.city === city && e.quality === (quality || 1));
  if (!entries.length) return null;
  return {
    sell: entries[0].sell_price_min || 0,
    buy: entries[0].buy_price_max || 0,
    sellDate: entries[0].sell_price_min_date,
    buyDate: entries[0].buy_price_max_date
  };
}

const NOMES_ITENS = {
  'T2_BAG':'Bolsa T2','T3_BAG':'Bolsa T3','T4_BAG':'Bolsa T4','T5_BAG':'Bolsa T5','T6_BAG':'Bolsa T6','T7_BAG':'Bolsa T7','T8_BAG':'Bolsa T8',
  'T2_CAPE':'Capa T2','T3_CAPE':'Capa T3','T4_CAPE':'Capa T4','T5_CAPE':'Capa T5','T6_CAPE':'Capa T6','T7_CAPE':'Capa T7','T8_CAPE':'Capa T8',
  'T4_CAPEITEM_FW_BRIDGEWATCH':'Capa Bridgewatch','T4_CAPEITEM_FW_CAERLEON':'Capa Caerleon','T4_CAPEITEM_FW_FORTSTERLING':'Capa Fort Sterling','T4_CAPEITEM_FW_LYMHURST':'Capa Lymhurst','T4_CAPEITEM_FW_MARTLOCK':'Capa Martlock','T4_CAPEITEM_FW_THETFORD':'Capa Thetford',
  'T4_MAIN_SWORD':'Broadsword T4','T5_MAIN_SWORD':'Broadsword T5','T6_MAIN_SWORD':'Broadsword T6',
  'T4_2H_CLAYMORE':'Claymore T4','T5_2H_CLAYMORE':'Claymore T5','T6_2H_CLAYMORE':'Claymore T6','T7_2H_CLAYMORE':'Claymore T7','T8_2H_CLAYMORE':'Claymore T8',
  'T4_2H_DUALSWORD':'Dual Swords T4','T4_2H_CLAYMORE_AVALON':'Clarent Blade T4',
  'T4_2H_AXE':'Battleaxe T4','T5_2H_AXE':'Battleaxe T5','T4_2H_GREATAXE':'Greataxe T4','T4_2H_HALBERD':'Halberd T4',
  'T4_MAIN_MACE':'Maca T4','T4_2H_MACE':'Maca Pesada T4','T4_2H_FLAIL':'Morning Star T4',
  'T4_2H_SPEAR':'Lanca T4','T4_2H_PIKE':'Pique T4','T4_2H_GLAIVE':'Glaive T4',
  'T4_2H_FIRESTAFF':'Cajado de Fogo T4','T5_2H_FIRESTAFF':'Cajado de Fogo T5','T6_2H_FIRESTAFF':'Cajado de Fogo T6','T7_2H_FIRESTAFF':'Cajado de Fogo T7','T8_2H_FIRESTAFF':'Cajado de Fogo T8','T4_2H_INFERNOSTAFF':'Grande Fogo T4',
  'T4_2H_FROSTSTAFF':'Cajado de Gelo T4','T5_2H_FROSTSTAFF':'Cajado de Gelo T5','T6_2H_FROSTSTAFF':'Cajado de Gelo T6','T7_2H_FROSTSTAFF':'Cajado de Gelo T7','T8_2H_FROSTSTAFF':'Cajado de Gelo T8','T4_2H_GLACIALSTAFF':'Grande Gelo T4',
  'T4_2H_ARCANESTAFF':'Cajado Arcano T4','T5_2H_ARCANESTAFF':'Cajado Arcano T5','T6_2H_ARCANESTAFF':'Cajado Arcano T6','T7_2H_ARCANESTAFF':'Cajado Arcano T7','T8_2H_ARCANESTAFF':'Cajado Arcano T8','T4_2H_ENIGMATICSTAFF':'Grande Arcano T4',
  'T4_2H_HOLYSTAFF':'Cajado Sagrado T4','T5_2H_HOLYSTAFF':'Cajado Sagrado T5','T6_2H_HOLYSTAFF':'Cajado Sagrado T6','T7_2H_HOLYSTAFF':'Cajado Sagrado T7','T8_2H_HOLYSTAFF':'Cajado Sagrado T8','T4_2H_DIVINESTAFF':'Grande Sagrado T4',
  'T4_2H_CURSESTAFF':'Cajado Maldito T4','T5_2H_CURSESTAFF':'Cajado Maldito T5','T6_2H_CURSESTAFF':'Cajado Maldito T6','T7_2H_CURSESTAFF':'Cajado Maldito T7','T8_2H_CURSESTAFF':'Cajado Maldito T8','T4_2H_DEMONICSTAFF':'Grande Maldito T4',
  'T4_2H_NATURESTAFF':'Cajado da Natureza T4','T5_2H_NATURESTAFF':'Cajado da Natureza T5','T6_2H_NATURESTAFF':'Cajado da Natureza T6','T7_2H_NATURESTAFF':'Cajado da Natureza T7','T8_2H_NATURESTAFF':'Cajado da Natureza T8','T4_2H_WILDSTAFF':'Grande Natureza T4',
  'T4_2H_SHAPESHIFTER_SET1':'Prowling Staff T4 (Pantera)','T5_2H_SHAPESHIFTER_SET1':'Prowling Staff T5 (Pantera)','T6_2H_SHAPESHIFTER_SET1':'Prowling Staff T6 (Pantera)','T7_2H_SHAPESHIFTER_SET1':'Prowling Staff T7 (Pantera)','T8_2H_SHAPESHIFTER_SET1':'Prowling Staff T8 (Pantera)',
  'T4_2H_SHAPESHIFTER_MORGANA':'Bloodmoon Staff T4 (Lobisomem)','T5_2H_SHAPESHIFTER_MORGANA':'Bloodmoon Staff T5 (Lobisomem)','T6_2H_SHAPESHIFTER_MORGANA':'Bloodmoon Staff T6 (Lobisomem)','T7_2H_SHAPESHIFTER_MORGANA':'Bloodmoon Staff T7 (Lobisomem)','T8_2H_SHAPESHIFTER_MORGANA':'Bloodmoon Staff T8 (Lobisomem)',
  'T4_2H_SHAPESHIFTER_HELL':'Hellspawn Staff T4 (Demonio)','T5_2H_SHAPESHIFTER_HELL':'Hellspawn Staff T5 (Demonio)','T6_2H_SHAPESHIFTER_HELL':'Hellspawn Staff T6 (Demonio)','T7_2H_SHAPESHIFTER_HELL':'Hellspawn Staff T7 (Demonio)','T8_2H_SHAPESHIFTER_HELL':'Hellspawn Staff T8 (Demonio)',
  'T4_2H_SHAPESHIFTER_SET3':'Earthrune Staff T4 (Ent)','T5_2H_SHAPESHIFTER_SET3':'Earthrune Staff T5 (Ent)','T6_2H_SHAPESHIFTER_SET3':'Earthrune Staff T6 (Ent)','T7_2H_SHAPESHIFTER_SET3':'Earthrune Staff T7 (Ent)','T8_2H_SHAPESHIFTER_SET3':'Earthrune Staff T8 (Ent)',
  'T4_2H_SHAPESHIFTER_SET4':'Hellspawn Staff T4 (Demonio)','T5_2H_SHAPESHIFTER_SET4':'Hellspawn Staff T5 (Demonio)','T6_2H_SHAPESHIFTER_SET4':'Hellspawn Staff T6 (Demonio)','T7_2H_SHAPESHIFTER_SET4':'Hellspawn Staff T7 (Demonio)','T8_2H_SHAPESHIFTER_SET4':'Hellspawn Staff T8 (Demonio)',
  'T4_2H_SHAPESHIFTER_SET5':'Primal Staff T4 (Urso)','T5_2H_SHAPESHIFTER_SET5':'Primal Staff T5 (Urso)','T6_2H_SHAPESHIFTER_SET5':'Primal Staff T6 (Urso)','T7_2H_SHAPESHIFTER_SET5':'Primal Staff T7 (Urso)','T8_2H_SHAPESHIFTER_SET5':'Primal Staff T8 (Urso)',
  'T4_2H_SHAPESHIFTER_AVALON':'Lightcaller T4 (Falcao)','T5_2H_SHAPESHIFTER_AVALON':'Lightcaller T5 (Falcao)','T6_2H_SHAPESHIFTER_AVALON':'Lightcaller T6 (Falcao)','T7_2H_SHAPESHIFTER_AVALON':'Lightcaller T7 (Falcao)','T8_2H_SHAPESHIFTER_AVALON':'Lightcaller T8 (Falcao)',
  'T4_HEAD_PLATE_SET1':'Capacete Soldier T4','T4_ARMOR_PLATE_SET1':'Armadura Soldier T4','T4_SHOES_PLATE_SET1':'Botas Soldier T4','T5_HEAD_PLATE_SET1':'Capacete Soldier T5','T5_ARMOR_PLATE_SET1':'Armadura Soldier T5','T5_SHOES_PLATE_SET1':'Botas Soldier T5',
  'T4_HEAD_LEATHER_SET1':'Capuz Mercenary T4','T4_ARMOR_LEATHER_SET1':'Jaqueta Mercenary T4','T4_SHOES_LEATHER_SET1':'Sapatos Mercenary T4','T5_HEAD_LEATHER_SET1':'Capuz Mercenary T5','T5_ARMOR_LEATHER_SET1':'Jaqueta Mercenary T5','T5_SHOES_LEATHER_SET1':'Sapatos Mercenary T5',
  'T4_HEAD_CLOTH_SET1':'Capuz Scholar T4','T4_ARMOR_CLOTH_SET1':'Veste Scholar T4','T4_SHOES_CLOTH_SET1':'Sandalias Scholar T4','T5_HEAD_CLOTH_SET1':'Capuz Scholar T5','T5_ARMOR_CLOTH_SET1':'Veste Scholar T5','T5_SHOES_CLOTH_SET1':'Sandalias Scholar T5',
  'T2_METALBAR':'Barra de Metal T2','T3_METALBAR':'Barra de Metal T3','T4_METALBAR':'Barra de Metal T4','T5_METALBAR':'Barra de Metal T5','T6_METALBAR':'Barra de Metal T6','T7_METALBAR':'Barra de Metal T7','T8_METALBAR':'Barra de Metal T8',
  'T2_LEATHER':'Couro T2','T3_LEATHER':'Couro T3','T4_LEATHER':'Couro T4','T5_LEATHER':'Couro T5','T6_LEATHER':'Couro T6','T7_LEATHER':'Couro T7','T8_LEATHER':'Couro T8',
  'T2_CLOTH':'Tecido T2','T3_CLOTH':'Tecido T3','T4_CLOTH':'Tecido T4','T5_CLOTH':'Tecido T5','T6_CLOTH':'Tecido T6','T7_CLOTH':'Tecido T7','T8_CLOTH':'Tecido T8',
  'T2_PLANKS':'Tabua T2','T3_PLANKS':'Tabua T3','T4_PLANKS':'Tabua T4','T5_PLANKS':'Tabua T5','T6_PLANKS':'Tabua T6','T7_PLANKS':'Tabua T7','T8_PLANKS':'Tabua T8',
  'T2_STONEBLOCK':'Bloco de Pedra T2','T3_STONEBLOCK':'Bloco de Pedra T3','T4_STONEBLOCK':'Bloco de Pedra T4','T5_STONEBLOCK':'Bloco de Pedra T5','T6_STONEBLOCK':'Bloco de Pedra T6','T7_STONEBLOCK':'Bloco de Pedra T7','T8_STONEBLOCK':'Bloco de Pedra T8',
  'T2_ORE':'Minerio T2','T3_ORE':'Minerio T3','T4_ORE':'Minerio T4','T5_ORE':'Minerio T5','T6_ORE':'Minerio T6','T7_ORE':'Minerio T7','T8_ORE':'Minerio T8',
  'T2_HIDE':'Pele T2','T3_HIDE':'Pele T3','T4_HIDE':'Pele T4','T5_HIDE':'Pele T5','T6_HIDE':'Pele T6','T7_HIDE':'Pele T7','T8_HIDE':'Pele T8',
  'T2_FIBER':'Fibra T2','T3_FIBER':'Fibra T3','T4_FIBER':'Fibra T4','T5_FIBER':'Fibra T5','T6_FIBER':'Fibra T6','T7_FIBER':'Fibra T7','T8_FIBER':'Fibra T8',
  'T2_WOOD':'Tronco T2','T3_WOOD':'Tronco T3','T4_WOOD':'Tronco T4','T5_WOOD':'Tronco T5','T6_WOOD':'Tronco T6','T7_WOOD':'Tronco T7','T8_WOOD':'Tronco T8',
  'T2_ROCK':'Pedra Bruta T2','T3_ROCK':'Pedra Bruta T3','T4_ROCK':'Pedra Bruta T4','T5_ROCK':'Pedra Bruta T5','T6_ROCK':'Pedra Bruta T6','T7_ROCK':'Pedra Bruta T7','T8_ROCK':'Pedra Bruta T8',
  'T4_POTION_HEAL':'Pocao de Cura T4','T5_POTION_HEAL':'Pocao de Cura T5','T6_POTION_HEAL':'Pocao de Cura T6','T7_POTION_HEAL':'Pocao de Cura T7','T8_POTION_HEAL':'Pocao de Cura T8',
  'T4_POTION_ENERGY':'Pocao de Energia T4','T4_POTION_STONESKIN':'Pocao de Invisibilidade T4',
  'T4_MEAL_STEW':'Ensopado T4','T4_MEAL_SANDWICH':'Sanduiche T4','T4_MEAL_PIE':'Torta T4','T4_MEAL_OMELETTE':'Omelete T4','T4_MEAL_ROAST':'Assado T4','T4_MEAL_SOUP':'Sopa T4','T4_MEAL_SALAD':'Salada T4',
  'T4_MOUNT_HORSE':'Cavalo T4','T5_MOUNT_HORSE':'Cavalo T5','T6_MOUNT_HORSE':'Cavalo T6','T7_MOUNT_HORSE':'Cavalo T7','T8_MOUNT_HORSE':'Cavalo T8',
  'T4_MOUNT_ARMORED_HORSE':'Cavalo Blindado T4','T4_MOUNT_OX':'Boi T4','T5_MOUNT_OX':'Boi T5','T6_MOUNT_OX':'Boi T6','T7_MOUNT_OX':'Boi T7','T8_MOUNT_OX':'Boi T8',
  'T4_TOOL_PICK':'Picareta T4','T4_TOOL_AXE':'Machado de Coleta T4','T4_TOOL_SICKLE':'Foice T4','T4_TOOL_HAMMER':'Martelo de Coleta T4','T4_TOOL_KNIFE':'Facao T4',
  'T4_MOUNT_GIANTSTAG':'Gigante T4','T4_MOUNT_DIREWOLF':'Lobo T4','T4_MOUNT_DIREBOAR':'Javali T4','T6_MOUNT_MAMMOTH_TRANSPORT':'Mamute T6','T4_MOUNT_COUGAR_KEEPER':'Besouro T4','T4_MOUNT_SWAMPDRAGON':'Ave T4',
  'T4_SKILLBOOK_STANDARD':'Livro de Habilidade T4','T5_SKILLBOOK_STANDARD':'Livro de Habilidade T5','T6_SKILLBOOK_STANDARD':'Livro de Habilidade T6','T7_SKILLBOOK_STANDARD':'Livro de Habilidade T7','T8_SKILLBOOK_STANDARD':'Livro de Habilidade T8',
  'T4_RUNE':'Runa T4','T4_SOUL':'Alma T4','T4_RELIC':'Reliquia T4','T4_SHARD_AVALONIAN':'Fragmento Avaloniano T4',
  'T4_OFF_SHIELD':'Escudo T4','T4_OFF_TORCH':'Tocha T4','T4_OFF_BOOK':'Livro T4','T4_OFF_ORB_MORGANA':'Coracao T4','T4_OFF_TOTEM_KEEPER':'Totem T4','T4_OFF_HORN_KEEPER':'Chifre T4',
  'T4_2H_BOW':'Arco T4','T5_2H_BOW':'Arco T5','T6_2H_BOW':'Arco T6','T7_2H_BOW':'Arco T7','T8_2H_BOW':'Arco T8','T4_2H_WARBOW':'Arco de Guerra T4','T4_2H_LONGBOW':'Arco Longo T4',
  'T4_2H_CROSSBOW':'Besta T4','T5_2H_CROSSBOW':'Besta T5','T4_MAIN_CROSSBOW':'Besta Leve T4','T4_2H_CROSSBOWLARGE':'Besta Pesada T4',
  'T4_2H_DAGGER':'Adaga T4','T5_2H_DAGGER':'Adaga T5','T4_2H_CLAWPAIR':'Garras T4','T4_MAIN_DAGGER_HELL':'Carta Sangrenta T4',
  'T4_2H_HAMMER':'Martelo T4','T5_2H_HAMMER':'Martelo T5','T4_2H_POLEHAMMER':'Martelo de Haste T4','T4_2H_RAM_KEEPER':'Grande Martelo T4'
};

const TRADUCOES = {
  'bolsa':'T4_BAG','bolsa t4':'T4_BAG','bolsa tier 4':'T4_BAG','bolsa t5':'T5_BAG','bolsa t6':'T6_BAG','bolsa t7':'T7_BAG','bolsa t8':'T8_BAG','bag':'T4_BAG','mochila':'T4_BAG','saco':'T4_BAG',
  'capa':'T4_CAPE','capa t4':'T4_CAPE','capa t5':'T5_CAPE','capa t6':'T6_CAPE','capa t7':'T7_CAPE','capa t8':'T8_CAPE','cape':'T4_CAPE',
  'capa bridgewatch':'T4_CAPEITEM_FW_BRIDGEWATCH','capa caerleon':'T4_CAPEITEM_FW_CAERLEON','capa fort sterling':'T4_CAPEITEM_FW_FORTSTERLING','capa lymhurst':'T4_CAPEITEM_FW_LYMHURST','capa martlock':'T4_CAPEITEM_FW_MARTLOCK','capa thetford':'T4_CAPEITEM_FW_THETFORD',
  'espada':'T4_2H_CLAYMORE','claymore':'T4_2H_CLAYMORE','espada t4':'T4_2H_CLAYMORE','espada t5':'T5_2H_CLAYMORE','espada t6':'T6_2H_CLAYMORE','espada t7':'T7_2H_CLAYMORE','espada t8':'T8_2H_CLAYMORE','broadsword':'T4_MAIN_SWORD','espada larga':'T4_MAIN_SWORD','dual swords':'T4_2H_DUALSWORD','espadas duplas':'T4_2H_DUALSWORD','clarent blade':'T4_2H_CLAYMORE_AVALON','lamina clarent':'T4_2H_CLAYMORE_AVALON',
  'machado':'T4_2H_AXE','battleaxe':'T4_2H_AXE','machado t4':'T4_2H_AXE','machado t5':'T5_2H_AXE','greataxe':'T4_2H_GREATAXE','machado grande':'T4_2H_GREATAXE','halberd':'T4_2H_HALBERD','halberde':'T4_2H_HALBERD',
  'mace':'T4_MAIN_MACE','marco':'T4_MAIN_MACE','maca':'T4_MAIN_MACE','heavy mace':'T4_2H_MACE','maca pesada':'T4_2H_MACE','morning star':'T4_2H_FLAIL','estrela da manha':'T4_2H_FLAIL',
  'lanca':'T4_2H_SPEAR','spear':'T4_2H_SPEAR','pike':'T4_2H_PIKE','pique':'T4_2H_PIKE','glaive':'T4_2H_GLAIVE',
  'fire staff':'T4_2H_FIRESTAFF','cajado de fogo':'T4_2H_FIRESTAFF','fogo t4':'T4_2H_FIRESTAFF','fogo t5':'T5_2H_FIRESTAFF','fogo t6':'T6_2H_FIRESTAFF','fogo t7':'T7_2H_FIRESTAFF','fogo t8':'T8_2H_FIRESTAFF','great fire':'T4_2H_INFERNOSTAFF','grande fogo':'T4_2H_INFERNOSTAFF',
  'frost staff':'T4_2H_FROSTSTAFF','cajado de gelo':'T4_2H_FROSTSTAFF','gelo t4':'T4_2H_FROSTSTAFF','gelo t5':'T5_2H_FROSTSTAFF','great frost':'T4_2H_GLACIALSTAFF','grande gelo':'T4_2H_GLACIALSTAFF',
  'arcane staff':'T4_2H_ARCANESTAFF','cajado arcano':'T4_2H_ARCANESTAFF','arcano t4':'T4_2H_ARCANESTAFF','arcano t5':'T5_2H_ARCANESTAFF','arcano t6':'T6_2H_ARCANESTAFF','arcano t7':'T7_2H_ARCANESTAFF','arcano t8':'T8_2H_ARCANESTAFF','great arcane':'T4_2H_ENIGMATICSTAFF','grande arcano':'T4_2H_ENIGMATICSTAFF',
  'holy staff':'T4_2H_HOLYSTAFF','cajado sagrado':'T4_2H_HOLYSTAFF','sagrado t4':'T4_2H_HOLYSTAFF','sagrado t5':'T5_2H_HOLYSTAFF','sagrado t6':'T6_2H_HOLYSTAFF','sagrado t7':'T7_2H_HOLYSTAFF','sagrado t8':'T8_2H_HOLYSTAFF','great holy':'T4_2H_DIVINESTAFF','grande sagrado':'T4_2H_DIVINESTAFF',
  'curse staff':'T4_2H_CURSESTAFF','cajado maldito':'T4_2H_CURSESTAFF','maldito t4':'T4_2H_CURSESTAFF','maldito t5':'T5_2H_CURSESTAFF','maldito t6':'T6_2H_CURSESTAFF','maldito t7':'T7_2H_CURSESTAFF','maldito t8':'T8_2H_CURSESTAFF','great curse':'T4_2H_DEMONICSTAFF','grande maldito':'T4_2H_DEMONICSTAFF',
  'nature staff':'T4_2H_NATURESTAFF','cajado da natureza':'T4_2H_NATURESTAFF','natureza t4':'T4_2H_NATURESTAFF','natureza t5':'T5_2H_NATURESTAFF','natureza t6':'T6_2H_NATURESTAFF','natureza t7':'T7_2H_NATURESTAFF','natureza t8':'T8_2H_NATURESTAFF','great nature':'T4_2H_WILDSTAFF','grande natureza':'T4_2H_WILDSTAFF',
  'shapeshifter':'T4_2H_SHAPESHIFTER_SET1','metamorfo':'T4_2H_SHAPESHIFTER_SET1','cajado do metamorfo':'T4_2H_SHAPESHIFTER_SET1','cajado metamorfo':'T4_2H_SHAPESHIFTER_SET1','prowling staff':'T4_2H_SHAPESHIFTER_SET1','prowling':'T4_2H_SHAPESHIFTER_SET1','pantera':'T4_2H_SHAPESHIFTER_SET1','cajado da pantera':'T4_2H_SHAPESHIFTER_SET1','cajado prowling':'T4_2H_SHAPESHIFTER_SET1',
  'bloodmoon staff':'T4_2H_SHAPESHIFTER_MORGANA','bloodmoon':'T4_2H_SHAPESHIFTER_MORGANA','lobisomem':'T4_2H_SHAPESHIFTER_MORGANA','cajado lua de sangue':'T4_2H_SHAPESHIFTER_MORGANA','lua de sangue':'T4_2H_SHAPESHIFTER_MORGANA','cajado de sangue':'T4_2H_SHAPESHIFTER_MORGANA',
  'earthrune staff':'T4_2H_SHAPESHIFTER_SET3','earthrune':'T4_2H_SHAPESHIFTER_SET3','ent':'T4_2H_SHAPESHIFTER_SET3','cajado ent':'T4_2H_SHAPESHIFTER_SET3','cajado earthrune':'T4_2H_SHAPESHIFTER_SET3',
  'hellspawn staff':'T4_2H_SHAPESHIFTER_SET4','hellspawn':'T4_2H_SHAPESHIFTER_SET4','demonio':'T4_2H_SHAPESHIFTER_SET4','cajado demonio':'T4_2H_SHAPESHIFTER_SET4','cajado hellspawn':'T4_2H_SHAPESHIFTER_SET4',
  'primal staff':'T4_2H_SHAPESHIFTER_SET5','primal':'T4_2H_SHAPESHIFTER_SET5','urso':'T4_2H_SHAPESHIFTER_SET5','cajado urso':'T4_2H_SHAPESHIFTER_SET5','cajado primal':'T4_2H_SHAPESHIFTER_SET5',
  'lightcaller':'T4_2H_SHAPESHIFTER_AVALON','falcao':'T4_2H_SHAPESHIFTER_AVALON','cajado falcao':'T4_2H_SHAPESHIFTER_AVALON','cajado lightcaller':'T4_2H_SHAPESHIFTER_AVALON',
  'arco':'T4_2H_BOW','bow':'T4_2H_BOW','arco t4':'T4_2H_BOW','arco t5':'T5_2H_BOW','arco t6':'T6_2H_BOW','arco t7':'T7_2H_BOW','arco t8':'T8_2H_BOW','warbow':'T4_2H_WARBOW','arco de guerra':'T4_2H_WARBOW','longbow':'T4_2H_LONGBOW','arco longo':'T4_2H_LONGBOW',
  'besta':'T4_2H_CROSSBOW','crossbow':'T4_2H_CROSSBOW','besta t4':'T4_2H_CROSSBOW','besta t5':'T5_2H_CROSSBOW','light crossbow':'T4_MAIN_CROSSBOW','besta leve':'T4_MAIN_CROSSBOW','heavy crossbow':'T4_2H_CROSSBOWLARGE','besta pesada':'T4_2H_CROSSBOWLARGE',
  'adaga':'T4_2H_DAGGER','dagger':'T4_2H_DAGGER','adaga t4':'T4_2H_DAGGER','adaga t5':'T5_2H_DAGGER','claws':'T4_2H_CLAWPAIR','garras':'T4_2H_CLAWPAIR','bloodletter':'T4_MAIN_DAGGER_HELL','carta sangrenta':'T4_MAIN_DAGGER_HELL',
  'martelo':'T4_2H_HAMMER','hammer':'T4_2H_HAMMER','martelo t4':'T4_2H_HAMMER','martelo t5':'T5_2H_HAMMER','polehammer':'T4_2H_POLEHAMMER','martelo de haste':'T4_2H_POLEHAMMER','great hammer':'T4_2H_RAM_KEEPER','grande martelo':'T4_2H_RAM_KEEPER',
  'capacete soldier':'T4_HEAD_PLATE_SET1','soldier helmet':'T4_HEAD_PLATE_SET1','armadura soldier':'T4_ARMOR_PLATE_SET1','soldier armor':'T4_ARMOR_PLATE_SET1','bota soldier':'T4_SHOES_PLATE_SET1','soldier boots':'T4_SHOES_PLATE_SET1','placa t4 cabeca':'T4_HEAD_PLATE_SET1','placa t4 peito':'T4_ARMOR_PLATE_SET1','placa t4 pe':'T4_SHOES_PLATE_SET1','plate helmet':'T4_HEAD_PLATE_SET1','plate armor':'T4_ARMOR_PLATE_SET1','plate boots':'T4_SHOES_PLATE_SET1',
  'capuz mercenary':'T4_HEAD_LEATHER_SET1','mercenary hood':'T4_HEAD_LEATHER_SET1','jaqueta mercenary':'T4_ARMOR_LEATHER_SET1','mercenary jacket':'T4_ARMOR_LEATHER_SET1','sapato mercenary':'T4_SHOES_LEATHER_SET1','mercenary shoes':'T4_SHOES_LEATHER_SET1','couro t4 cabeca':'T4_HEAD_LEATHER_SET1','couro t4 peito':'T4_ARMOR_LEATHER_SET1','couro t4 pe':'T4_SHOES_LEATHER_SET1','leather hood':'T4_HEAD_LEATHER_SET1','leather jacket':'T4_ARMOR_LEATHER_SET1','leather shoes':'T4_SHOES_LEATHER_SET1',
  'capuz scholar':'T4_HEAD_CLOTH_SET1','scholar cowl':'T4_HEAD_CLOTH_SET1','veste scholar':'T4_ARMOR_CLOTH_SET1','scholar robe':'T4_ARMOR_CLOTH_SET1','sandalia scholar':'T4_SHOES_CLOTH_SET1','scholar sandals':'T4_SHOES_CLOTH_SET1','tecido t4 cabeca':'T4_HEAD_CLOTH_SET1','tecido t4 peito':'T4_ARMOR_CLOTH_SET1','tecido t4 pe':'T4_SHOES_CLOTH_SET1','cloth cowl':'T4_HEAD_CLOTH_SET1','cloth robe':'T4_ARMOR_CLOTH_SET1','cloth sandals':'T4_SHOES_CLOTH_SET1',
  'metal bar':'T4_METALBAR','barra de metal':'T4_METALBAR','metalbar':'T4_METALBAR','metal t4':'T4_METALBAR','metal t5':'T5_METALBAR','metal t6':'T6_METALBAR','metal t7':'T7_METALBAR','metal t8':'T8_METALBAR',
  'leather':'T4_LEATHER','couro':'T4_LEATHER','couro t4':'T4_LEATHER','couro t5':'T5_LEATHER','couro t6':'T6_LEATHER','couro t7':'T7_LEATHER','couro t8':'T8_LEATHER',
  'cloth':'T4_CLOTH','tecido':'T4_CLOTH','tecido t4':'T4_CLOTH','tecido t5':'T5_CLOTH','tecido t6':'T6_CLOTH','tecido t7':'T7_CLOTH','tecido t8':'T8_CLOTH',
  'planks':'T4_PLANKS','tabua':'T4_PLANKS','tabuas':'T4_PLANKS','tabua t4':'T4_PLANKS','tabua t5':'T5_PLANKS','tabua t6':'T6_PLANKS','tabua t7':'T7_PLANKS','tabua t8':'T8_PLANKS',
  'stone block':'T4_STONEBLOCK','bloco de pedra':'T4_STONEBLOCK','pedra t4':'T4_STONEBLOCK','pedra t5':'T5_STONEBLOCK','pedra t6':'T6_STONEBLOCK','pedra t7':'T7_STONEBLOCK','pedra t8':'T8_STONEBLOCK',
  'ore':'T4_ORE','minerio':'T4_ORE','minério':'T4_ORE','minerio t4':'T4_ORE','minerio t5':'T5_ORE','minerio t6':'T6_ORE','minerio t7':'T7_ORE','minerio t8':'T8_ORE',
  'hide':'T4_HIDE','pele':'T4_HIDE','pele t4':'T4_HIDE','pele t5':'T5_HIDE','pele t6':'T6_HIDE','pele t7':'T7_HIDE','pele t8':'T8_HIDE',
  'fiber':'T4_FIBER','fibra':'T4_FIBER','fibra t4':'T4_FIBER','fibra t5':'T5_FIBER','fibra t6':'T6_FIBER','fibra t7':'T7_FIBER','fibra t8':'T8_FIBER',
  'wood':'T4_WOOD','tronco':'T4_WOOD','madeira':'T4_WOOD','tronco t4':'T4_WOOD','tronco t5':'T5_WOOD','tronco t6':'T6_WOOD','tronco t7':'T7_WOOD','tronco t8':'T8_WOOD',
  'rock':'T4_ROCK','pedra bruta':'T4_ROCK','pedra bruta t4':'T4_ROCK','pedra bruta t5':'T5_ROCK','pedra bruta t6':'T6_ROCK','pedra bruta t7':'T7_ROCK','pedra bruta t8':'T8_ROCK',
  'pocao':'T4_POTION_HEAL','pocao de cura':'T4_POTION_HEAL','healing potion':'T4_POTION_HEAL','pocao t4':'T4_POTION_HEAL','pocao t5':'T5_POTION_HEAL','pocao t6':'T6_POTION_HEAL','pocao t7':'T7_POTION_HEAL','pocao t8':'T8_POTION_HEAL','pocao de energia':'T4_POTION_ENERGY','energy potion':'T4_POTION_ENERGY','pocao de invisibilidade':'T4_POTION_STONESKIN',
  'stew':'T4_MEAL_STEW','ensopado':'T4_MEAL_STEW','sandwich':'T4_MEAL_SANDWICH','sanduiche':'T4_MEAL_SANDWICH','sanduíche':'T4_MEAL_SANDWICH','pie':'T4_MEAL_PIE','torta':'T4_MEAL_PIE','omelette':'T4_MEAL_OMELETTE','omelete':'T4_MEAL_OMELETTE','roast':'T4_MEAL_ROAST','assado':'T4_MEAL_ROAST','soup':'T4_MEAL_SOUP','sopa':'T4_MEAL_SOUP','salad':'T4_MEAL_SALAD','salada':'T4_MEAL_SALAD',
  'cavalo':'T4_MOUNT_HORSE','horse':'T4_MOUNT_HORSE','cavalo t4':'T4_MOUNT_HORSE','cavalo t5':'T5_MOUNT_HORSE','cavalo t6':'T6_MOUNT_HORSE','cavalo t7':'T7_MOUNT_HORSE','cavalo t8':'T8_MOUNT_HORSE','armored horse':'T4_MOUNT_ARMORED_HORSE','cavalo blindado':'T4_MOUNT_ARMORED_HORSE','ox':'T4_MOUNT_OX','boi':'T4_MOUNT_OX','boi t4':'T4_MOUNT_OX','boi t5':'T5_MOUNT_OX','boi t6':'T6_MOUNT_OX','boi t7':'T7_MOUNT_OX','boi t8':'T8_MOUNT_OX',
  'picareta':'T4_TOOL_PICK','pickaxe':'T4_TOOL_PICK','machado de coleta':'T4_TOOL_AXE','axe tool':'T4_TOOL_AXE','foice':'T4_TOOL_SICKLE','sickle':'T4_TOOL_SICKLE','martelo de coleta':'T4_TOOL_HAMMER','hammer tool':'T4_TOOL_HAMMER','facao':'T4_TOOL_KNIFE','knife tool':'T4_TOOL_KNIFE',
  'gigante':'T4_MOUNT_GIANTSTAG','giant stag':'T4_MOUNT_GIANTSTAG','lobo':'T4_MOUNT_DIREWOLF','direwolf':'T4_MOUNT_DIREWOLF','javali':'T4_MOUNT_DIREBOAR','direboar':'T4_MOUNT_DIREBOAR','mamute':'T6_MOUNT_MAMMOTH_TRANSPORT','mammoth':'T6_MOUNT_MAMMOTH_TRANSPORT','besouro':'T4_MOUNT_COUGAR_KEEPER','beetle':'T4_MOUNT_COUGAR_KEEPER','ave':'T4_MOUNT_SWAMPDRAGON','swamp dragon':'T4_MOUNT_SWAMPDRAGON',
  'tome':'T4_SKILLBOOK_STANDARD','livro de habilidade':'T4_SKILLBOOK_STANDARD','tome t4':'T4_SKILLBOOK_STANDARD','tome t5':'T5_SKILLBOOK_STANDARD','tome t6':'T6_SKILLBOOK_STANDARD','tome t7':'T7_SKILLBOOK_STANDARD','tome t8':'T8_SKILLBOOK_STANDARD',
  'rune':'T4_RUNE','runa':'T4_RUNE','soul':'T4_SOUL','alma':'T4_SOUL','relic':'T4_RELIC','reliquia':'T4_RELIC','relíquia':'T4_RELIC','avalonian shard':'T4_SHARD_AVALONIAN','fragmento avaloniano':'T4_SHARD_AVALONIAN',
  'escudo':'T4_OFF_SHIELD','shield':'T4_OFF_SHIELD','tocha':'T4_OFF_TORCH','torch':'T4_OFF_TORCH','livro':'T4_OFF_BOOK','book':'T4_OFF_BOOK','coracao':'T4_OFF_ORB_MORGANA','heart':'T4_OFF_ORB_MORGANA','totem':'T4_OFF_TOTEM_KEEPER','horn':'T4_OFF_HORN_KEEPER','chifre':'T4_OFF_HORN_KEEPER'
};

const SUGESTOES_LISTA = Object.keys(TRADUCOES).sort();

function extrairTier(texto) {
  const limpo = texto.toLowerCase().trim();
  const match = limpo.match(/(?:tier\s*|t)([4-8])\b/) || limpo.match(/\b([4-8])\b/);
  return match ? parseInt(match[1]) : null;
}

function extrairEnchant(texto) {
  const limpo = texto.toLowerCase().trim();
  const match = limpo.match(/\.([1-3])\b/);
  return match ? parseInt(match[1]) : null;
}

function removerTierEEnchant(texto) {
  return texto.toLowerCase().trim()
    .replace(/\btier\s*[4-8]\b/g, '')
    .replace(/\bt[4-8]\b/g, '')
    .replace(/\b[4-8]\b/g, '')
    .replace(/\.[1-3]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function aplicarTier(idBase, tier) {
  if (!tier || !idBase) return idBase;
  return idBase.replace(/^T[4-8]/, 'T' + tier);
}

function aplicarEnchant(idBase, enchant) {
  if (!enchant || !idBase) return idBase;
  return idBase + '@' + enchant;
}

function getNomeItem(itemId) {
  const idSemEnchant = itemId.replace(/@\d+$/, '');
  const nomeBase = NOMES_ITENS[idSemEnchant] || idSemEnchant;
  const enchantMatch = itemId.match(/@([1-3])$/);
  if (enchantMatch) return nomeBase + ' .' + enchantMatch[1];
  return nomeBase;
}

function getCategoria(id) {
  if (id.includes('BAG')) return 'Bolsas';
  if (id.includes('CAPE')) return 'Capas';
  if (id.includes('SWORD') || id.includes('AXE') || id.includes('DAGGER') || id.includes('SPEAR') || id.includes('HAMMER') || id.includes('MACE')) return 'Armas Melee';
  if (id.includes('STAFF') || id.includes('BOW') || id.includes('CROSSBOW')) return 'Armas Magicas/Distancia';
  if (id.includes('PLATE')) return 'Armadura Placa';
  if (id.includes('LEATHER')) return 'Armadura Couro';
  if (id.includes('CLOTH')) return 'Armadura Tecido';
  if (id.includes('MOUNT')) return 'Montarias';
  if (id.includes('POTION')) return 'Pocoes';
  if (id.includes('MEAL')) return 'Comida';
  if (id.includes('METALBAR') || id.includes('LEATHER') || id.includes('CLOTH') || id.includes('PLANKS') || id.includes('STONEBLOCK')) return 'Recursos Refinados';
  if (id.includes('ORE') || id.includes('HIDE') || id.includes('FIBER') || id.includes('WOOD') || id.includes('ROCK')) return 'Recursos Brutos';
  return 'Itens';
}

function traduzirParaId(texto) {
  const limpo = texto.toLowerCase().trim();
  const tierDigitado = extrairTier(limpo);
  const enchantDigitado = extrairEnchant(limpo);
  const semTierEnchant = removerTierEEnchant(limpo);
  if (/^T\d+_/.test(limpo)) return limpo;
  if (TRADUCOES[limpo]) {
    let id = TRADUCOES[limpo];
    id = aplicarTier(id, tierDigitado);
    id = aplicarEnchant(id, enchantDigitado);
    return id;
  }
  if (semTierEnchant && TRADUCOES[semTierEnchant]) {
    let id = TRADUCOES[semTierEnchant];
    id = aplicarTier(id, tierDigitado);
    id = aplicarEnchant(id, enchantDigitado);
    return id;
  }
  let melhorMatch = null, melhorScore = 0;
  for (const [pt, id] of Object.entries(TRADUCOES)) {
    const ptSem = removerTierEEnchant(pt);
    const score = calcularScore(ptSem, semTierEnchant || limpo);
    if (score > melhorScore) { melhorScore = score; melhorMatch = id; }
  }
  if (melhorMatch && melhorScore > 0.3) {
    let id = melhorMatch;
    id = aplicarTier(id, tierDigitado);
    id = aplicarEnchant(id, enchantDigitado);
    return id;
  }
  return null;
}

function calcularScore(chave, busca) {
  if (chave === busca) return 1;
  if (chave.includes(busca)) return 0.8;
  if (busca.includes(chave)) return 0.6;
  const palavrasChave = chave.split(' ');
  const palavrasBusca = busca.split(' ');
  const comuns = palavrasChave.filter(p => palavrasBusca.includes(p));
  return comuns.length / Math.max(palavrasChave.length, palavrasBusca.length) * 0.5;
}

function buscarSugestoes(texto) {
  if (!texto || texto.length < 2) return [];
  const limpo = texto.toLowerCase().trim();
  if (/^T\d+_/.test(limpo)) return [];
  const semTE = removerTierEEnchant(limpo);
  const scored = SUGESTOES_LISTA
    .map(s => { const sSem = removerTierEEnchant(s); const score = calcularScore(sSem, semTE || limpo); return { sugestao: s, score }; })
    .filter(s => s.score > 0.1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  return scored.map(s => s.sugestao);
}

// ============================================
// FLIPPER
// ============================================

const FLIP_EXEMPLOS = [
  { itemId: 'T8_MOUNT_DIREWOLF', fromCity: 'Bridgewatch', toCity: 'Thetford', buy: 3410000, sell: 5830000, profit: 1290000, profitPct: 0.378, volume: 27, updated: '78min' },
  { itemId: 'T8_2H_CAPEITEM_FW_THETFORD', fromCity: 'Brecilien', toCity: 'Fort Sterling', buy: 1360000, sell: 2350000, profit: 831700, profitPct: 0.611, volume: 65, updated: '126min' },
  { itemId: 'T6_3_2H_FIRESTAFF', fromCity: 'Martlock', toCity: 'Caerleon', buy: 2270000, sell: 3270000, profit: 787700, profitPct: 0.347, volume: 39, updated: '161min' },
  { itemId: 'T8_2H_AXE', fromCity: 'Lymhurst', toCity: 'Thetford', buy: 1680000, sell: 2230000, profit: 490200, profitPct: 0.387, volume: 97, updated: '72min' },
  { itemId: 'T7_2_2H_DAGGER', fromCity: 'Caerleon', toCity: 'Martlock', buy: 1820000, sell: 1480000, profit: 366100, profitPct: 0.359, volume: 400, updated: '168min' },
  { itemId: 'T7_1_2H_HAMMER', fromCity: 'Bridgewatch', toCity: 'Brecilien', buy: 1120000, sell: 1510000, profit: 292100, profitPct: 0.261, volume: 217, updated: '99min' },
  { itemId: 'T7_1_SHOES_LEATHER_SET1', fromCity: 'Fort Sterling', toCity: 'Thetford', buy: 587900, sell: 838100, profit: 195800, profitPct: 0.333, volume: 180, updated: '172min' },
  { itemId: 'T6_2_HEAD_LEATHER_SET1', fromCity: 'Thetford', toCity: 'Caerleon', buy: 444600, sell: 647500, profit: 160800, profitPct: 0.362, volume: 226, updated: '179min' },
  { itemId: 'T6_1_ARMOR_CLOTH_SET1', fromCity: 'Fort Sterling', toCity: 'Thetford', buy: 245400, sell: 432500, profit: 159000, profitPct: 0.648, volume: 217, updated: '131min' },
  { itemId: 'T6_1_2H_BOW', fromCity: 'Caerleon', toCity: 'Bridgewatch', buy: 397700, sell: 559900, profit: 125800, profitPct: 0.316, volume: 148, updated: '145min' }
];

function onFlipInput(val) {
  const sugestoesBox = document.getElementById('flipSugestoes');
  const sugestoes = buscarSugestoes(val);
  if (sugestoes.length > 0) {
    sugestoesBox.innerHTML = sugestoes.map(s => {
      const id = TRADUCOES[s];
      const nome = getNomeItem(id);
      return '<div class="sugestao-item" onclick="selecionarFlipSugestao(\'' + escapeHtml(s) + '\')">' + nome + '<span class="sugestao-id">' + id + '</span></div>';
    }).join('');
    sugestoesBox.style.display = 'block';
  } else {
    sugestoesBox.innerHTML = '';
    sugestoesBox.style.display = 'none';
  }
}

function selecionarFlipSugestao(texto) {
  document.getElementById('flipItemInput').value = texto;
  document.getElementById('flipSugestoes').style.display = 'none';
  scanFlips();
}

function updateFlipPremiumLabel() {
  const toggle = document.getElementById('flipPremiumToggle');
  const label = toggle.querySelector('.toggle-label');
  label.textContent = toggle.classList.contains('active') ? 'Conta Premium' : 'Sem Premium';
}

function getTaxaVenda() {
  const premium = document.getElementById('flipPremiumToggle')?.classList.contains('active');
  return premium ? 0.04 : 0.08;
}

async function scanFlips() {
  const inputRaw = document.getElementById('flipItemInput').value.trim();
  const fromCity = document.getElementById('flipFrom').value;
  const toCity = document.getElementById('flipTo').value;
  const tbody = document.getElementById('flipTableBody');
  const tax = getTaxaVenda();

  if (!inputRaw) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state small"><p>Escolha o item e clique em <strong>Escanear</strong></p><span>Ex: claymore, bolsa, capa, cajado de fogo...</span></div></td></tr>';
    return;
  }

  let itemId = traduzirParaId(inputRaw);
  if (!itemId) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state small"><p>Item nao encontrado: "' + escapeHtml(inputRaw) + '"</p></div></td></tr>';
    return;
  }

  setLoading(true);

  if (usarDadosExemplo) {
    setTimeout(() => {
      const dados = FLIP_EXEMPLOS.filter(e => e.itemId === itemId || itemId.includes('BAG') || itemId.includes('CAPE') || itemId.includes('SWORD') || itemId.includes('AXE') || itemId.includes('DAGGER') || itemId.includes('HAMMER') || itemId.includes('STAFF') || itemId.includes('BOW'));
      const oportunidades = dados.length ? dados : FLIP_EXEMPLOS.slice(0, 5);
      renderFlipResults(oportunidades, tax);
      setLoading(false);
    }, 600);
    return;
  }

  let fromCities = fromCity === 'Todas' ? CIDADES_COM_BRECILIEN : [fromCity];
  let toCities = toCity === 'Todas' ? CIDADES_COM_BRECILIEN : [toCity];

  try {
    const allCities = [...new Set([...fromCities, ...toCities])];
    const data = await fetchPrices([itemId], allCities, [1]);

    const oportunidades = [];
    for (const fc of fromCities) {
      for (const tc of toCities) {
        if (fc === tc) continue;
        const fromPrice = getPrice(data, itemId, fc, 1);
        const toPrice = getPrice(data, itemId, tc, 1);
        if (!fromPrice || !toPrice || !fromPrice.sell || !toPrice.buy) continue;

        const buyCost = fromPrice.sell;
        const sellRevenue = toPrice.buy;
        const sellFee = Math.ceil(sellRevenue * tax);
        const netRevenue = sellRevenue - sellFee;
        const profit = netRevenue - buyCost;
        const profitPct = buyCost > 0 ? (profit / buyCost) : 0;

        if (profit > 0) {
          oportunidades.push({
            itemId, fromCity: fc, toCity: tc,
            buy: buyCost, sell: sellRevenue,
            profit, profitPct,
            volume: '-', updated: 'Agora'
          });
        }
      }
    }

    oportunidades.sort((a, b) => b.profit - a.profit);
    renderFlipResults(oportunidades, tax);
  } catch (e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state small"><p>Erro ao buscar dados</p><span>Tente novamente mais tarde</span></div></td></tr>';
  } finally {
    setLoading(false);
  }
}

function renderFlipResults(oportunidades, tax) {
  const tbody = document.getElementById('flipTableBody');

  if (oportunidades.length > 0) {
    const best = oportunidades[0];
    document.getElementById('flipStatBest').textContent = formatSilver(best.profit);
    document.getElementById('flipStatBestRoute').textContent = best.fromCity + ' \u2192 ' + best.toCity;
    const totalProfit = oportunidades.reduce((s, o) => s + o.profit, 0);
    document.getElementById('flipStatTotal').textContent = formatSilver(totalProfit);
    document.getElementById('flipStatCount').textContent = oportunidades.length + ' rotas listadas';
    const avgMargin = oportunidades.reduce((s, o) => s + o.profitPct, 0) / oportunidades.length;
    document.getElementById('flipStatMargin').textContent = formatPercent(avgMargin);
    document.getElementById('flipStatPremium').textContent = tax === 0.04 ? 'com Premium (4% imposto)' : 'sem Premium (8% imposto)';
  } else {
    document.getElementById('flipStatBest').textContent = '-';
    document.getElementById('flipStatBestRoute').textContent = 'Nenhuma oportunidade';
    document.getElementById('flipStatTotal').textContent = '-';
    document.getElementById('flipStatCount').textContent = '0 rotas';
    document.getElementById('flipStatMargin').textContent = '-';
  }

  if (!oportunidades.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state small"><p>Nenhuma oportunidade de lucro encontrada</p><span>Tente outras cidades ou verifique se o item tem volume no mercado</span></div></td></tr>';
  } else {
    tbody.innerHTML = oportunidades.map(o => {
      const nome = getNomeItem(o.itemId);
      const cat = getCategoria(o.itemId);
      const tier = o.itemId.match(/^T([4-8])/)?.[1] || '4';
      const enchant = o.itemId.match(/@([1-3])$/)?.[1] || '';
      const tierStr = 'T' + tier + (enchant ? '.' + enchant : '');
      const dotClass = o.updated === 'Agora' ? 'dot-green' : (parseInt(o.updated) < 60 ? 'dot-yellow' : 'dot-red');
      return '<tr>' +
        '<td><div class="item-cell"><span class="tier-badge">' + tierStr + '</span><div class="item-info"><span class="item-name">' + escapeHtml(nome) + '</span><span class="item-category">' + cat + '</span></div></div></td>' +
        '<td><div class="route-cell">' + o.fromCity + '<span class="arrow">\u2192</span>' + o.toCity + '</div></td>' +
        '<td class="price-sell price-val">' + formatSilver(o.buy) + '</td>' +
        '<td class="price-buy price-val">' + formatSilver(o.sell) + '</td>' +
        '<td class="profit-pos price-val">+' + formatSilver(o.profit) + ' <span style="font-size:11px;color:var(--green-dim)">(' + formatPercent(o.profitPct) + ')</span></td>' +
        '<td>' + o.volume + '</td>' +
        '<td><div class="timestamp"><span class="dot ' + dotClass + '"></span>' + o.updated + '</div></td>' +
        '</tr>';
    }).join('');
  }
}

// ============================================
// BUSCAR ITEM
// ============================================

const ITENS_POPULARES = [
  'T7_2_2H_DAGGER', 'T6_1_2H_BOW', 'T8_2H_AXE', 'T6_3_2H_FIRESTAFF',
  'T7_1_2H_HAMMER', 'T6_2_HEAD_LEATHER_SET1', 'T7_1_SHOES_LEATHER_SET1',
  'T5_HEAD_PLATE_SET1', 'T6_1_ARMOR_CLOTH_SET1', 'T5_2H_CLAYMORE',
  'T8_MOUNT_DIREWOLF', 'T8_2H_CAPEITEM_FW_THETFORD'
];

const BUSCAR_EXEMPLOS = {
  'T7_2_2H_DAGGER': {
    nome: 'Adaga Bruxa', categoria: 'Armas', tier: 'T7.2', qualidade: 'Qualidade 4',
    menorVenda: 1020190, maiorCompra: 1482630, blackMarket: 1387730,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 1020000, compraMax: 901500, volume: 489, updated: '168min' },
      { cidade: 'Bridgewatch', vendaMin: 1450000, compraMax: 1270000, volume: 84, updated: '9min' },
      { cidade: 'Lymhurst', vendaMin: 1740000, compraMax: 1480000, volume: 138, updated: '14min' },
      { cidade: 'Martlock', vendaMin: 1720000, compraMax: 1480000, volume: 400, updated: '7min' },
      { cidade: 'Fort Sterling', vendaMin: 1250000, compraMax: 931400, volume: 495, updated: '97min' },
      { cidade: 'Thetford', vendaMin: 1240000, compraMax: 975100, volume: 218, updated: '13min' },
      { cidade: 'Brecilien', vendaMin: 1610000, compraMax: 1290000, volume: 81, updated: '156min' }
    ]
  },
  'T6_1_2H_BOW': {
    nome: 'Arco Bruxo', categoria: 'Armas', tier: 'T6.1', qualidade: 'Qualidade 3',
    menorVenda: 397700, maiorCompra: 350000, blackMarket: 559900,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 397700, compraMax: 320000, volume: 148, updated: '145min' },
      { cidade: 'Bridgewatch', vendaMin: 450000, compraMax: 380000, volume: 92, updated: '22min' },
      { cidade: 'Lymhurst', vendaMin: 510000, compraMax: 420000, volume: 67, updated: '45min' },
      { cidade: 'Martlock', vendaMin: 480000, compraMax: 390000, volume: 112, updated: '18min' },
      { cidade: 'Fort Sterling', vendaMin: 420000, compraMax: 350000, volume: 203, updated: '33min' },
      { cidade: 'Thetford', vendaMin: 460000, compraMax: 370000, volume: 89, updated: '51min' },
      { cidade: 'Brecilien', vendaMin: 550000, compraMax: 410000, volume: 34, updated: '120min' }
    ]
  },
  'T8_2H_AXE': {
    nome: 'Machado Sanguinário', categoria: 'Armas', tier: 'T8', qualidade: 'Qualidade 1',
    menorVenda: 1680000, maiorCompra: 1400000, blackMarket: 2230000,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 1680000, compraMax: 1400000, volume: 97, updated: '72min' },
      { cidade: 'Bridgewatch', vendaMin: 1850000, compraMax: 1520000, volume: 45, updated: '15min' },
      { cidade: 'Lymhurst', vendaMin: 2100000, compraMax: 1650000, volume: 32, updated: '28min' },
      { cidade: 'Martlock', vendaMin: 1950000, compraMax: 1580000, volume: 78, updated: '41min' },
      { cidade: 'Fort Sterling', vendaMin: 1780000, compraMax: 1450000, volume: 156, updated: '8min' },
      { cidade: 'Thetford', vendaMin: 1900000, compraMax: 1500000, volume: 67, updated: '35min' },
      { cidade: 'Brecilien', vendaMin: 2200000, compraMax: 1600000, volume: 21, updated: '95min' }
    ]
  },
  'T6_3_2H_FIRESTAFF': {
    nome: 'Cajado da Grande Fogueira', categoria: 'Armas', tier: 'T6.3', qualidade: 'Qualidade 4',
    menorVenda: 2270000, maiorCompra: 1900000, blackMarket: 3270000,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 2270000, compraMax: 1900000, volume: 39, updated: '161min' },
      { cidade: 'Bridgewatch', vendaMin: 2500000, compraMax: 2050000, volume: 28, updated: '42min' },
      { cidade: 'Lymhurst', vendaMin: 2800000, compraMax: 2200000, volume: 15, updated: '55min' },
      { cidade: 'Martlock', vendaMin: 2600000, compraMax: 2100000, volume: 52, updated: '19min' },
      { cidade: 'Fort Sterling', vendaMin: 2350000, compraMax: 1950000, volume: 89, updated: '33min' },
      { cidade: 'Thetford', vendaMin: 2550000, compraMax: 2000000, volume: 41, updated: '48min' },
      { cidade: 'Brecilien', vendaMin: 2900000, compraMax: 2150000, volume: 12, updated: '110min' }
    ]
  },
  'T7_1_2H_HAMMER': {
    nome: 'Martelo de Guerra', categoria: 'Armas', tier: 'T7.1', qualidade: 'Qualidade 3',
    menorVenda: 1120000, maiorCompra: 950000, blackMarket: 1510000,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 1120000, compraMax: 950000, volume: 217, updated: '99min' },
      { cidade: 'Bridgewatch', vendaMin: 1250000, compraMax: 1000000, volume: 134, updated: '27min' },
      { cidade: 'Lymhurst', vendaMin: 1400000, compraMax: 1100000, volume: 78, updated: '38min' },
      { cidade: 'Martlock', vendaMin: 1300000, compraMax: 1050000, volume: 167, updated: '15min' },
      { cidade: 'Fort Sterling', vendaMin: 1180000, compraMax: 980000, volume: 245, updated: '22min' },
      { cidade: 'Thetford', vendaMin: 1280000, compraMax: 1020000, volume: 98, updated: '44min' },
      { cidade: 'Brecilien', vendaMin: 1450000, compraMax: 1080000, volume: 45, updated: '85min' }
    ]
  },
  'T6_2_HEAD_LEATHER_SET1': {
    nome: 'Capuz do Assassino', categoria: 'Armaduras', tier: 'T6.2', qualidade: 'Qualidade 4',
    menorVenda: 444600, maiorCompra: 380000, blackMarket: 647500,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 444600, compraMax: 380000, volume: 226, updated: '179min' },
      { cidade: 'Bridgewatch', vendaMin: 490000, compraMax: 400000, volume: 134, updated: '31min' },
      { cidade: 'Lymhurst', vendaMin: 550000, compraMax: 430000, volume: 89, updated: '42min' },
      { cidade: 'Martlock', vendaMin: 510000, compraMax: 410000, volume: 178, updated: '18min' },
      { cidade: 'Fort Sterling', vendaMin: 470000, compraMax: 390000, volume: 267, updated: '25min' },
      { cidade: 'Thetford', vendaMin: 500000, compraMax: 400000, volume: 112, updated: '48min' },
      { cidade: 'Brecilien', vendaMin: 570000, compraMax: 420000, volume: 56, updated: '92min' }
    ]
  },
  'T7_1_SHOES_LEATHER_SET1': {
    nome: 'Botas do Guardião', categoria: 'Armaduras', tier: 'T7.1', qualidade: 'Qualidade 3',
    menorVenda: 587900, maiorCompra: 500000, blackMarket: 838100,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 587900, compraMax: 500000, volume: 180, updated: '172min' },
      { cidade: 'Bridgewatch', vendaMin: 650000, compraMax: 530000, volume: 112, updated: '28min' },
      { cidade: 'Lymhurst', vendaMin: 720000, compraMax: 570000, volume: 67, updated: '41min' },
      { cidade: 'Martlock', vendaMin: 680000, compraMax: 550000, volume: 145, updated: '19min' },
      { cidade: 'Fort Sterling', vendaMin: 620000, compraMax: 520000, volume: 234, updated: '22min' },
      { cidade: 'Thetford', vendaMin: 670000, compraMax: 540000, volume: 98, updated: '45min' },
      { cidade: 'Brecilien', vendaMin: 750000, compraMax: 560000, volume: 43, updated: '88min' }
    ]
  },
  'T5_HEAD_PLATE_SET1': {
    nome: 'Capacete Soldier', categoria: 'Armaduras', tier: 'T5', qualidade: 'Qualidade 1',
    menorVenda: 95000, maiorCompra: 80000, blackMarket: 135000,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 95000, compraMax: 80000, volume: 520, updated: '12min' },
      { cidade: 'Bridgewatch', vendaMin: 105000, compraMax: 85000, volume: 340, updated: '8min' },
      { cidade: 'Lymhurst', vendaMin: 115000, compraMax: 90000, volume: 210, updated: '15min' },
      { cidade: 'Martlock', vendaMin: 108000, compraMax: 87000, volume: 420, updated: '10min' },
      { cidade: 'Fort Sterling', vendaMin: 100000, compraMax: 82000, volume: 580, updated: '6min' },
      { cidade: 'Thetford', vendaMin: 106000, compraMax: 86000, volume: 310, updated: '11min' },
      { cidade: 'Brecilien', vendaMin: 120000, compraMax: 88000, volume: 150, updated: '25min' }
    ]
  },
  'T6_1_ARMOR_CLOTH_SET1': {
    nome: 'Túnica do Clérigo', categoria: 'Armaduras', tier: 'T6.1', qualidade: 'Qualidade 3',
    menorVenda: 245400, maiorCompra: 210000, blackMarket: 432500,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 245400, compraMax: 210000, volume: 217, updated: '131min' },
      { cidade: 'Bridgewatch', vendaMin: 270000, compraMax: 220000, volume: 145, updated: '29min' },
      { cidade: 'Lymhurst', vendaMin: 300000, compraMax: 240000, volume: 89, updated: '42min' },
      { cidade: 'Martlock', vendaMin: 280000, compraMax: 230000, volume: 178, updated: '18min' },
      { cidade: 'Fort Sterling', vendaMin: 255000, compraMax: 215000, volume: 267, updated: '25min' },
      { cidade: 'Thetford', vendaMin: 275000, compraMax: 225000, volume: 112, updated: '48min' },
      { cidade: 'Brecilien', vendaMin: 310000, compraMax: 235000, volume: 56, updated: '92min' }
    ]
  },
  'T5_2H_CLAYMORE': {
    nome: 'Claymore', categoria: 'Armas', tier: 'T5', qualidade: 'Qualidade 1',
    menorVenda: 85000, maiorCompra: 72000, blackMarket: 120000,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 85000, compraMax: 72000, volume: 890, updated: '5min' },
      { cidade: 'Bridgewatch', vendaMin: 92000, compraMax: 78000, volume: 560, updated: '8min' },
      { cidade: 'Lymhurst', vendaMin: 100000, compraMax: 82000, volume: 340, updated: '12min' },
      { cidade: 'Martlock', vendaMin: 95000, compraMax: 80000, volume: 670, updated: '7min' },
      { cidade: 'Fort Sterling', vendaMin: 88000, compraMax: 75000, volume: 920, updated: '4min' },
      { cidade: 'Thetford', vendaMin: 93000, compraMax: 77000, volume: 480, updated: '9min' },
      { cidade: 'Brecilien', vendaMin: 105000, compraMax: 79000, volume: 210, updated: '18min' }
    ]
  },
  'T8_MOUNT_DIREWOLF': {
    nome: 'Lobo Direwolf', categoria: 'Montarias', tier: 'T8', qualidade: 'Qualidade 1',
    menorVenda: 3410000, maiorCompra: 3000000, blackMarket: 5830000,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 3410000, compraMax: 3000000, volume: 27, updated: '78min' },
      { cidade: 'Bridgewatch', vendaMin: 3800000, compraMax: 3200000, volume: 18, updated: '25min' },
      { cidade: 'Lymhurst', vendaMin: 4200000, compraMax: 3400000, volume: 12, updated: '38min' },
      { cidade: 'Martlock', vendaMin: 3900000, compraMax: 3300000, volume: 22, updated: '19min' },
      { cidade: 'Fort Sterling', vendaMin: 3600000, compraMax: 3100000, volume: 34, updated: '15min' },
      { cidade: 'Thetford', vendaMin: 3700000, compraMax: 3150000, volume: 20, updated: '28min' },
      { cidade: 'Brecilien', vendaMin: 4300000, compraMax: 3350000, volume: 8, updated: '65min' }
    ]
  },
  'T8_2H_CAPEITEM_FW_THETFORD': {
    nome: 'Capa de Thetford', categoria: 'Acessórios', tier: 'T8.2', qualidade: 'Qualidade 4',
    menorVenda: 1360000, maiorCompra: 1150000, blackMarket: 2350000,
    cidades: [
      { cidade: 'Caerleon', vendaMin: 1360000, compraMax: 1150000, volume: 65, updated: '126min' },
      { cidade: 'Bridgewatch', vendaMin: 1500000, compraMax: 1200000, volume: 42, updated: '32min' },
      { cidade: 'Lymhurst', vendaMin: 1680000, compraMax: 1300000, volume: 28, updated: '45min' },
      { cidade: 'Martlock', vendaMin: 1550000, compraMax: 1250000, volume: 56, updated: '22min' },
      { cidade: 'Fort Sterling', vendaMin: 1420000, compraMax: 1180000, volume: 78, updated: '18min' },
      { cidade: 'Thetford', vendaMin: 1480000, compraMax: 1220000, volume: 48, updated: '35min' },
      { cidade: 'Brecilien', vendaMin: 1700000, compraMax: 1280000, volume: 22, updated: '72min' }
    ]
  }
};

let buscarItemSelecionado = null;

function initBuscar() {
  const lista = document.getElementById('buscarListaItens');
  lista.innerHTML = ITENS_POPULARES.map(id => {
    const nome = getNomeItem(id);
    const tier = id.match(/^T([4-8])/)?.[1] || '4';
    const enchant = id.match(/@([1-3])$/)?.[1] || '';
    const tierStr = 'T' + tier + (enchant ? '.' + enchant : '');
    const cat = getCategoria(id);
    const active = buscarItemSelecionado === id ? 'active' : '';
    return '<div class="search-list-item ' + active + '" onclick="selecionarBuscarItem(\'' + id + '\')">' +
      '<span class="tier-badge">' + tierStr + '</span>' +
      '<div class="item-info"><span class="item-name">' + escapeHtml(nome) + '</span><span class="item-category">' + cat + '</span></div>' +
      '</div>';
  }).join('');
}

function onBuscarInput(val) {
  const sugestoesBox = document.getElementById('buscarSugestoes');
  const sugestoes = buscarSugestoes(val);
  if (sugestoes.length > 0) {
    sugestoesBox.innerHTML = sugestoes.map(s => {
      const id = TRADUCOES[s];
      const nome = getNomeItem(id);
      return '<div class="sugestao-item" onclick="selecionarBuscarSugestao(\'' + escapeHtml(s) + '\')">' + nome + '<span class="sugestao-id">' + id + '</span></div>';
    }).join('');
    sugestoesBox.style.display = 'block';
  } else {
    sugestoesBox.innerHTML = '';
    sugestoesBox.style.display = 'none';
  }
}

function selecionarBuscarSugestao(texto) {
  document.getElementById('buscarInput').value = texto;
  document.getElementById('buscarSugestoes').style.display = 'none';
  const itemId = traduzirParaId(texto);
  if (itemId) selecionarBuscarItem(itemId);
}

function selecionarBuscarItem(itemId) {
  buscarItemSelecionado = itemId;
  initBuscar();

  const detalhes = document.getElementById('buscarDetalhes');
  const dados = BUSCAR_EXEMPLOS[itemId];

  if (!dados) {
    detalhes.innerHTML = '<div class="empty-state"><p>Item selecionado: ' + escapeHtml(getNomeItem(itemId)) + '</p><span>Dados de exemplo disponíveis para itens populares. Use a API real para dados completos.</span></div>';
    return;
  }

  const tier = itemId.match(/^T([4-8])/)?.[1] || '4';
  const enchant = itemId.match(/@([1-3])$/)?.[1] || '';
  const tierStr = 'T' + tier + (enchant ? '.' + enchant : '');

  detalhes.innerHTML =
    '<div class="price-card">' +
      '<div class="item-detail-header">' +
        '<span class="tier-badge" style="font-size:12px;padding:4px 10px;">' + tierStr + '</span>' +
        '<div>' +
          '<div class="item-detail-title">' + escapeHtml(dados.nome.toUpperCase()) + '</div>' +
          '<div class="item-detail-category">' + dados.categoria + ' · ' + dados.qualidade + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="price-summary">' +
        '<div class="price-summary-box">' +
          '<div class="price-summary-label">Menor Venda</div>' +
          '<div class="price-summary-value" style="color:var(--green);">' + formatSilverFull(dados.menorVenda) + '</div>' +
        '</div>' +
        '<div class="price-summary-box">' +
          '<div class="price-summary-label">Maior Ordem de Compra</div>' +
          '<div class="price-summary-value">' + formatSilverFull(dados.maiorCompra) + '</div>' +
        '</div>' +
        '<div class="price-summary-box">' +
          '<div class="price-summary-label">Black Market</div>' +
          '<div class="price-summary-value" style="color:var(--gold);">' + formatSilverFull(dados.blackMarket) + '</div>' +
        '</div>' +
      '</div>' +
      '<table class="data-table">' +
        '<thead><tr><th>Cidade</th><th>Venda Min.</th><th>Compra Max.</th><th>Volume</th><th>Atualizado</th></tr></thead>' +
        '<tbody>' +
        dados.cidades.map(c => {
          const dotClass = parseInt(c.updated) < 30 ? 'dot-green' : (parseInt(c.updated) < 90 ? 'dot-yellow' : 'dot-red');
          return '<tr>' +
            '<td style="font-weight:500;">' + c.cidade + '</td>' +
            '<td style="color:var(--green);font-weight:600;">' + formatSilver(c.vendaMin) + '</td>' +
            '<td>' + formatSilver(c.compraMax) + '</td>' +
            '<td>' + c.volume + '</td>' +
            '<td><div class="timestamp"><span class="dot ' + dotClass + '"></span>' + c.updated + '</div></td>' +
            '</tr>';
        }).join('') +
        '</tbody>' +
      '</table>' +
    '</div>';
}

// ============================================
// BLACK MARKET
// ============================================

const BM_EXEMPLOS = [
  { itemId: 'T6_3_2H_FIRESTAFF', nome: 'Cajado da Grande Fogueira', categoria: 'Armas', tier: 'T6.3', comprarEm: 'Martlock', precoCompra: 2270000, precoBM: 4990000, lucro: 2390000, lucroPct: 1.052, updated: '161min' },
  { itemId: 'T8_2H_AXE', nome: 'Machado Sanguinário', categoria: 'Armas', tier: 'T8', comprarEm: 'Lymhurst', precoCompra: 1680000, precoBM: 3460000, lucro: 1630000, lucroPct: 0.823, updated: '72min' },
  { itemId: 'T8_2H_CAPEITEM_FW_THETFORD', nome: 'Capa de Thetford', categoria: 'Acessórios', tier: 'T8.2', comprarEm: 'Brecilien', precoCompra: 1360000, precoBM: 3160000, lucro: 1600000, lucroPct: 1.172, updated: '126min' },
  { itemId: 'T7_1_2H_SPEAR', nome: 'Lança Espírito', categoria: 'Armas', tier: 'T7.1', comprarEm: 'Bridgewatch', precoCompra: 689900, precoBM: 1590000, lucro: 796800, lucroPct: 1.154, updated: '109min' },
  { itemId: 'T7_1_SHOES_LEATHER_SET1', nome: 'Botas do Guardião', categoria: 'Armaduras', tier: 'T7.1', comprarEm: 'Fort Sterling', precoCompra: 587900, precoBM: 1230000, lucro: 563700, lucroPct: 0.959, updated: '63min' },
  { itemId: 'T7_2H_NATURESTAFF', nome: 'Tomo de Feitiços', categoria: 'Armas', tier: 'T7', comprarEm: 'Lymhurst', precoCompra: 353800, precoBM: 756800, lucro: 353800, lucroPct: 0.998, updated: '157min' },
  { itemId: 'T7_2_2H_DAGGER', nome: 'Adaga Bruxa', categoria: 'Armas', tier: 'T7.2', comprarEm: 'Caerleon', precoCompra: 1820000, precoBM: 1390000, lucro: 277300, lucroPct: 0.272, updated: '168min' },
  { itemId: 'T6_1_2H_BOW', nome: 'Arco Bruxo', categoria: 'Armas', tier: 'T6.1', comprarEm: 'Caerleon', precoCompra: 397700, precoBM: 718200, lucro: 273800, lucroPct: 0.688, updated: '145min' },
  { itemId: 'T6_2_HEAD_LEATHER_SET1', nome: 'Capuz do Assassino', categoria: 'Armaduras', tier: 'T6.2', comprarEm: 'Thetford', precoCompra: 444600, precoBM: 637900, lucro: 158900, lucroPct: 0.339, updated: '179min' },
  { itemId: 'T7_1_2H_HAMMER', nome: 'Martelo de Guerra', categoria: 'Armas', tier: 'T7.1', comprarEm: 'Caerleon', precoCompra: 118800, precoBM: 236400, lucro: 103800, lucroPct: 0.872, updated: '52min' },
  { itemId: 'T6_1_ARMOR_CLOTH_SET1', nome: 'Túnica do Clérigo', categoria: 'Armaduras', tier: 'T6.1', comprarEm: 'Fort Sterling', precoCompra: 245400, precoBM: 346400, lucro: 78500, lucroPct: 0.328, updated: '131min' },
  { itemId: 'T5_2H_CLAYMORE', nome: 'Claymore', categoria: 'Armas', tier: 'T5', comprarEm: 'Caerleon', precoCompra: 85000, precoBM: 137000, lucro: 28000, lucroPct: 0.895, updated: '7min' }
];

let bmMinProfit = 0;

function initBM() {
  const track = document.getElementById('bmRangeTrack');
  const thumb = document.getElementById('bmRangeThumb');
  const fill = document.getElementById('bmRangeFill');

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = track.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    bmMinProfit = Math.round(pct * 2000000);
    thumb.style.left = (pct * 100) + '%';
    fill.style.width = (pct * 100) + '%';
    document.getElementById('bmMinProfitLabel').textContent = formatSilver(bmMinProfit);
    filtrarBM();
  }

  thumb.addEventListener('mousedown', () => isDragging = true);
  document.addEventListener('mousemove', e => { if (isDragging) updateSlider(e.clientX); });
  document.addEventListener('mouseup', () => isDragging = false);

  track.addEventListener('click', e => updateSlider(e.clientX));
}

function updateBMPremiumLabel() {
  const toggle = document.getElementById('bmPremiumToggle');
  const label = toggle.querySelector('.toggle-label');
  label.textContent = toggle.classList.contains('active') ? 'Conta Premium' : 'Sem Premium';
}

function carregarBM() {
  filtrarBM();
}

function filtrarBM() {
  const grid = document.getElementById('bmGrid');
  const filtro = document.getElementById('bmFilterInput').value.toLowerCase().trim();
  const tax = document.getElementById('bmPremiumToggle')?.classList.contains('active') ? 0.04 : 0.08;

  let itens = BM_EXEMPLOS;

  if (filtro) {
    itens = itens.filter(i => i.nome.toLowerCase().includes(filtro) || i.categoria.toLowerCase().includes(filtro));
  }

  itens = itens.filter(i => i.lucro >= bmMinProfit);

  if (!itens.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>Nenhuma oportunidade encontrada</p><span>Ajuste o filtro ou o lucro mínimo</span></div>';
    return;
  }

  grid.innerHTML = itens.map(i => {
    const dotClass = parseInt(i.updated) < 60 ? 'dot-green' : (parseInt(i.updated) < 120 ? 'dot-yellow' : 'dot-red');
    return '<div class="bm-card">' +
      '<div class="bm-card-header">' +
        '<div class="bm-card-name"><span class="tier-badge">' + i.tier + '</span>' + escapeHtml(i.nome) + '</div>' +
        '<svg class="bm-card-info" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' +
      '</div>' +
      '<div class="bm-price-row"><span class="label">Comprar em ' + i.comprarEm + '</span><span class="value price-sell">' + formatSilver(i.precoCompra) + '</span></div>' +
      '<div class="bm-price-row"><span class="label">Black Market</span><span class="value price-bm">' + formatSilver(i.precoBM) + '</span></div>' +
      '<div class="bm-card-footer">' +
        '<div class="timestamp"><span class="dot ' + dotClass + '"></span>' + i.updated + '</div>' +
        '<div><span class="bm-profit">+' + formatSilver(i.lucro) + '</span><span class="bm-profit-pct">(' + (i.lucroPct * 100).toFixed(1) + '%)</span></div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ============================================
// CRAFT & REFINO
// ============================================

function switchCraftTab(tab) {
  document.querySelectorAll('.craft-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('craftRefinoPanel').style.display = tab === 'refino' ? 'grid' : 'none';
  document.getElementById('craftCraftPanel').style.display = tab === 'craft' ? 'grid' : 'none';
}

const REFINO_RECEITAS = {
  metal: { nome: 'Minério → Barra de Metal', bruto: 'Minério', refinado: 'Barra de Metal', ratio: 2, tierAnterior: true, desc: '2× Minério de Cobre → 1× Barra de Aço T4 (usa 1× Barra T3)' },
  couro: { nome: 'Pele → Couro', bruto: 'Pele', refinado: 'Couro', ratio: 2, tierAnterior: true, desc: '2× Pele Bruta → 1× Couro T4 (usa 1× Couro T3)' },
  tecido: { nome: 'Fibra → Tecido', bruto: 'Fibra', refinado: 'Tecido', ratio: 2, tierAnterior: true, desc: '2× Fibra Bruta → 1× Tecido T4 (usa 1× Tecido T3)' },
  tabua: { nome: 'Tronco → Tábua', bruto: 'Tronco', refinado: 'Tábua', ratio: 2, tierAnterior: true, desc: '2× Tronco → 1× Tábua T4 (usa 1× Tábua T3)' },
  pedra: { nome: 'Pedra Bruta → Bloco de Pedra', bruto: 'Pedra Bruta', refinado: 'Bloco de Pedra', ratio: 2, tierAnterior: false, desc: '2× Pedra Bruta → 1× Bloco de Pedra T4' }
};

function atualizarDescRefino() {
  const tipo = document.getElementById('refinoReceita').value;
  document.getElementById('refinoDesc').textContent = REFINO_RECEITAS[tipo].desc;
}

function updateRefinoPremiumLabel() {
  const toggle = document.getElementById('refinoPremiumToggle');
  const label = toggle.querySelector('.toggle-label');
  label.textContent = toggle.classList.contains('active') ? 'Conta Premium (imposto 4%)' : 'Sem Premium (imposto 8%)';
}

function calcularRefino() {
  const precoBruto = parseFloat(document.getElementById('refinoPrecoBruto').value) || 0;
  const precoRefinado = parseFloat(document.getElementById('refinoPrecoRefinado').value) || 0;
  const quantidade = parseFloat(document.getElementById('refinoQuantidade').value) || 0;
  const rrr = parseFloat(document.getElementById('refinoRRR').value) || 0;
  const taxaEstacao = parseFloat(document.getElementById('refinoTaxaEstacao').value) || 0;
  const premium = document.getElementById('refinoPremiumToggle').classList.contains('active');
  const taxaVenda = premium ? 0.04 : 0.08;

  const ratio = 2; // 2 brutos = 1 refinado
  const custoMP = precoBruto * ratio * quantidade;
  const receitaBruta = precoRefinado * quantidade;
  const taxaTotal = taxaEstacao * quantidade;
  const retornoValor = custoMP * (rrr / 100);
  const imposto = receitaBruta * taxaVenda;
  const custoTotal = custoMP + taxaTotal - retornoValor;
  const lucroLiquido = receitaBruta - imposto - custoTotal;
  const lucroPct = custoTotal > 0 ? (lucroLiquido / custoTotal) : 0;

  document.getElementById('refinoCustoTotal').textContent = formatSilver(custoTotal);
  document.getElementById('refinoReceitaBruta').textContent = formatSilver(receitaBruta);
  document.getElementById('refinoCustoMP').textContent = formatSilver(custoMP);
  document.getElementById('refinoTaxa').textContent = formatSilver(taxaTotal);
  document.getElementById('refinoRetorno').textContent = '+' + formatSilver(retornoValor);
  document.getElementById('refinoImposto').textContent = '-' + formatSilver(imposto);
  document.getElementById('refinoLucroTotal').textContent = (lucroLiquido >= 0 ? '+' : '') + formatSilver(lucroLiquido);
  document.getElementById('refinoLucroTotal').style.color = lucroLiquido >= 0 ? 'var(--green)' : 'var(--red)';
  document.getElementById('refinoLucroPct').textContent = '(' + (lucroPct * 100).toFixed(1) + '%)';
  document.getElementById('refinoLucroPct').style.color = lucroLiquido >= 0 ? 'var(--green-dim)' : 'var(--red)';
  document.getElementById('refinoNota').textContent = lucroLiquido >= 0 ? 'Lucro estimado por lote de ' + quantidade + ' unidades' : 'Prejuízo estimado por lote de ' + quantidade + ' unidades';
}

// ============================================
// CRAFT
// ============================================

let craftMaterialCount = 2;

function onCraftInput(val) {
  const sugestoesBox = document.getElementById('craftSugestoes');
  const sugestoes = buscarSugestoes(val);
  if (sugestoes.length > 0) {
    sugestoesBox.innerHTML = sugestoes.map(s => {
      const id = TRADUCOES[s];
      const nome = getNomeItem(id);
      return '<div class="sugestao-item" onclick="selecionarCraftSugestao(\'' + escapeHtml(s) + '\')">' + nome + '<span class="sugestao-id">' + id + '</span></div>';
    }).join('');
    sugestoesBox.style.display = 'block';
  } else {
    sugestoesBox.innerHTML = '';
    sugestoesBox.style.display = 'none';
  }
}

function selecionarCraftSugestao(texto) {
  document.getElementById('craftItemInput').value = texto;
  document.getElementById('craftSugestoes').style.display = 'none';
}

function addMaterialRow() {
  craftMaterialCount++;
  const container = document.getElementById('craftMateriais');
  const row = document.createElement('div');
  row.className = 'craft-material-row';
  row.id = 'craftMatRow' + craftMaterialCount;
  row.innerHTML =
    '<input type="text" class="form-input" placeholder="Material ' + craftMaterialCount + '" style="flex:1;" id="craftMat' + craftMaterialCount + 'Nome">' +
    '<input type="number" class="form-input" placeholder="Qtd" style="width:80px;" id="craftMat' + craftMaterialCount + 'Qtd" value="1">' +
    '<input type="number" class="form-input" placeholder="Preço/un" style="width:120px;" id="craftMat' + craftMaterialCount + 'Preco" value="0">' +
    '<button class="btn-ghost" style="padding:4px 10px;font-size:11px;" onclick="removeMaterialRow(' + craftMaterialCount + ')">✕</button>';
  container.appendChild(row);
}

function removeMaterialRow(index) {
  const row = document.getElementById('craftMatRow' + index);
  if (row) row.remove();
}

function updateCraftPremiumLabel() {
  const toggle = document.getElementById('craftPremiumToggle');
  const label = toggle.querySelector('.toggle-label');
  label.textContent = toggle.classList.contains('active') ? 'Conta Premium (imposto 4%)' : 'Sem Premium (imposto 8%)';
}

function calcularCraft() {
  const precoVenda = parseFloat(document.getElementById('craftPrecoVenda').value) || 0;
  const quantidade = parseFloat(document.getElementById('craftQuantidade').value) || 0;
  const rrr = parseFloat(document.getElementById('craftRRR').value) || 0;
  const taxaEstacao = parseFloat(document.getElementById('craftTaxaEstacao').value) || 0;
  const premium = document.getElementById('craftPremiumToggle').classList.contains('active');
  const taxaVenda = premium ? 0.04 : 0.08;

  // Coletar materiais
  const materiais = [];
  let custoMP = 0;
  for (let i = 1; i <= craftMaterialCount; i++) {
    const nomeEl = document.getElementById('craftMat' + i + 'Nome');
    const qtdEl = document.getElementById('craftMat' + i + 'Qtd');
    const precoEl = document.getElementById('craftMat' + i + 'Preco');
    if (nomeEl && qtdEl && precoEl) {
      const nome = nomeEl.value || 'Material ' + i;
      const qtd = parseFloat(qtdEl.value) || 0;
      const preco = parseFloat(precoEl.value) || 0;
      const custo = qtd * preco * quantidade;
      custoMP += custo;
      materiais.push({ nome, qtd, preco, custo });
    }
  }

  const receitaBruta = precoVenda * quantidade;
  const taxaTotal = taxaEstacao * quantidade;
  const retornoValor = custoMP * (rrr / 100);
  const imposto = receitaBruta * taxaVenda;
  const custoTotal = custoMP + taxaTotal - retornoValor;
  const lucroLiquido = receitaBruta - imposto - custoTotal;
  const lucroPct = custoTotal > 0 ? (lucroLiquido / custoTotal) : 0;

  document.getElementById('craftCustoTotal').textContent = formatSilver(custoTotal);
  document.getElementById('craftReceitaBruta').textContent = formatSilver(receitaBruta);

  // Render breakdown de materiais
  const breakdownHTML = materiais.map(m =>
    '<div class="breakdown-row"><span class="label">' + escapeHtml(m.nome) + ' (' + m.qtd + '×' + formatSilver(m.preco) + ')</span><span class="amount">' + formatSilver(m.custo) + '</span></div>'
  ).join('');
  document.getElementById('craftBreakdownMateriais').innerHTML = breakdownHTML;

  document.getElementById('craftTaxa').textContent = formatSilver(taxaTotal);
  document.getElementById('craftRetorno').textContent = '+' + formatSilver(retornoValor);
  document.getElementById('craftImposto').textContent = '-' + formatSilver(imposto);
  document.getElementById('craftLucroTotal').textContent = (lucroLiquido >= 0 ? '+' : '') + formatSilver(lucroLiquido);
  document.getElementById('craftLucroTotal').style.color = lucroLiquido >= 0 ? 'var(--green)' : 'var(--red)';
  document.getElementById('craftLucroPct').textContent = '(' + (lucroPct * 100).toFixed(1) + '%)';
  document.getElementById('craftLucroPct').style.color = lucroLiquido >= 0 ? 'var(--green-dim)' : 'var(--red)';
  document.getElementById('craftNota').textContent = lucroLiquido >= 0 ? 'Lucro estimado por lote de ' + quantidade + ' unidades craftadas' : 'Prejuízo estimado por lote de ' + quantidade + ' unidades craftadas';
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initBuscar();
  initBM();
  updateFlipPremiumLabel();
  updateBMPremiumLabel();
  updateRefinoPremiumLabel();
  updateCraftPremiumLabel();

  // Fechar sugestões ao clicar fora
  document.addEventListener('click', e => {
    if (!e.target.closest('#flipItemInput') && !e.target.closest('#flipSugestoes')) {
      const box = document.getElementById('flipSugestoes');
      if (box) box.style.display = 'none';
    }
    if (!e.target.closest('#buscarInput') && !e.target.closest('#buscarSugestoes')) {
      const box = document.getElementById('buscarSugestoes');
      if (box) box.style.display = 'none';
    }
    if (!e.target.closest('#craftItemInput') && !e.target.closest('#craftSugestoes')) {
      const box = document.getElementById('craftSugestoes');
      if (box) box.style.display = 'none';
    }
  });

  // Enter nos inputs
  document.getElementById('flipItemInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') { document.getElementById('flipSugestoes').style.display = 'none'; scanFlips(); }
  });
  document.getElementById('buscarInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') { document.getElementById('buscarSugestoes').style.display = 'none'; const id = traduzirParaId(e.target.value); if (id) selecionarBuscarItem(id); }
  });
  document.getElementById('craftItemInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') { document.getElementById('craftSugestoes').style.display = 'none'; }
  });

  // Carregar BM inicial
  carregarBM();
});