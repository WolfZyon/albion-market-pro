// ============================================
// SILVERFORGE — ALBION MARKET TOOLS v2.0
// ============================================

const API_BASE = 'https://west.albion-online-data.com/api/v2/stats/prices';
const CIDADES = ['Bridgewatch','Caerleon','Fort Sterling','Lymhurst','Martlock','Thetford'];
const CIDADES_COM_BRECILIEN = ['Bridgewatch','Caerleon','Fort Sterling','Lymhurst','Martlock','Thetford','Brecilien'];

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  const btn = document.querySelector('.nav-btn[data-page="' + page + '"]');
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleDadosExemplo() {
  const btn = document.getElementById('btnDadosExemplo');
  const isExemplo = btn.textContent.includes('exemplo');
  btn.textContent = isExemplo ? 'Usar API real' : 'Dados de exemplo';
  btn.style.borderColor = isExemplo ? 'var(--green)' : 'var(--gold-dark)';
  btn.style.color = isExemplo ? 'var(--green)' : 'var(--gold)';
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
function initFlipper() {
  const input = document.getElementById('flipItemInput');
  const sugestoesBox = document.getElementById('flipSugestoes');
  if (!input) return;

  input.addEventListener('input', e => {
    const val = e.target.value;
    const sugestoes = buscarSugestoes(val);
    if (sugestoes.length > 0) {
      sugestoesBox.innerHTML = sugestoes.map(s => {
        const id = TRADUCOES[s];
        const nome = getNomeItem(id);
        return '<div class="sugestao-item" onclick="selecionarFlipSugestao(\'' + s.replace(/'/g, "\\'") + '\')">' + nome + ' <span class="sugestao-id">' + id + '</span></div>';
      }).join('');
      sugestoesBox.style.display = 'block';
    } else {
      sugestoesBox.innerHTML = '';
      sugestoesBox.style.display = 'none';
    }
  });

  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      sugestoesBox.style.display = 'none';
      scanFlips();
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#flipItemInput') && !e.target.closest('#flipSugestoes')) {
      sugestoesBox.style.display = 'none';
    }
  });
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
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state small" style="text-align:center;padding:40px;"><p>Digite um item para buscar</p><span>Ex: claymore, bolsa, capa, cajado de fogo...</span></td></tr>';
    return;
  }

  let itemId = traduzirParaId(inputRaw);
  if (!itemId) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state small" style="text-align:center;padding:40px;"><p style="color:var(--red)">Item nao encontrado: "' + escapeHtml(inputRaw) + '"</p></td></tr>';
    return;
  }

  setLoading(true);

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

    if (oportunidades.length > 0) {
      const best = oportunidades[0];
      document.getElementById('flipStatBest').textContent = formatSilver(best.profit);
      document.getElementById('flipStatBestRoute').textContent = best.fromCity + ' -> ' + best.toCity;
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
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state small" style="text-align:center;padding:40px;"><p>Nenhuma oportunidade de lucro encontrada</p><span>Tente outras cidades ou verifique se o item tem volume no mercado</span></td></tr>';
    } else {
      tbody.innerHTML = oportunidades.map(o => {
        const nome = getNomeItem(o.itemId);
        return '<tr>' +
          '<td><div class="item-cell"><img src="' + getItemIconUrl(o.itemId) + '" class="item-icon" onerror="this.style.display=\'none\'" loading="lazy"><div class="item-info"><div class="item-name">' + nome + '</div><div class="item-category">' + getCategoria(o.itemId) + '</div></div></div></td>' +
          '<td><div class="route-cell">' + o.fromCity + ' <span class="arrow">-></span> ' + o.toCity + '</div></td>' +
          '<td class="price-sell">' + formatSilverFull(o.buy) + ' S</td>' +
          '<td class="price-buy">' + formatSilverFull(o.sell) + ' S</td>' +
          '<td class="profit-pos">' + formatSilverFull(o.profit) + ' S</td>' +
          '<td>' + o.volume + '</td>' +
          '<td><div class="timestamp"><span class="dot dot-green"></span>' + o.updated + '</div></td>' +
          '</tr>';
      }).join('');
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state small" style="text-align:center;padding:40px;"><p style="color:var(--red)">Erro ao buscar dados: ' + escapeHtml(err.message) + '</p></td></tr>';
  } finally {
    setLoading(false);
  }
}

// ============================================
// BUSCAR ITEM (PREÇOS)
// ============================================
const ITENS_POPULARES = [
  'T4_BAG','T5_BAG','T6_BAG','T4_CAPE','T5_CAPE','T6_CAPE',
  'T4_2H_CLAYMORE','T5_2H_CLAYMORE','T6_2H_CLAYMORE',
  'T4_2H_FIRESTAFF','T5_2H_FIRESTAFF','T6_2H_FIRESTAFF',
  'T4_2H_BOW','T5_2H_BOW','T6_2H_BOW',
  'T4_HEAD_PLATE_SET1','T4_ARMOR_PLATE_SET1','T4_SHOES_PLATE_SET1',
  'T4_HEAD_LEATHER_SET1','T4_ARMOR_LEATHER_SET1','T4_SHOES_LEATHER_SET1',
  'T4_HEAD_CLOTH_SET1','T4_ARMOR_CLOTH_SET1','T4_SHOES_CLOTH_SET1',
  'T4_METALBAR','T5_METALBAR','T6_METALBAR',
  'T4_LEATHER','T5_LEATHER','T6_LEATHER',
  'T4_CLOTH','T5_CLOTH','T6_CLOTH',
  'T4_PLANKS','T5_PLANKS','T6_PLANKS',
  'T4_POTION_HEAL','T5_POTION_HEAL'
];

function initBuscar() {
  const input = document.getElementById('buscarInput');
  const sugestoesBox = document.getElementById('buscarSugestoes');
  if (!input) return;

  renderListaPopulares();

  input.addEventListener('input', e => {
    const val = e.target.value;
    const sugestoes = buscarSugestoes(val);
    if (sugestoes.length > 0) {
      sugestoesBox.innerHTML = sugestoes.map(s => {
        const id = TRADUCOES[s];
        const nome = getNomeItem(id);
        return '<div class="sugestao-item" onclick="selecionarBuscar(\'' + s.replace(/'/g, "\\'") + '\')">' + nome + ' <span class="sugestao-id">' + id + '</span></div>';
      }).join('');
      sugestoesBox.style.display = 'block';
    } else {
      sugestoesBox.innerHTML = '';
      sugestoesBox.style.display = 'none';
    }
  });

  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      sugestoesBox.style.display = 'none';
      const id = traduzirParaId(input.value);
      if (id) buscarPrecosItem(id);
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#buscarInput') && !e.target.closest('#buscarSugestoes')) {
      sugestoesBox.style.display = 'none';
    }
  });
}

function renderListaPopulares() {
  const lista = document.getElementById('buscarLista');
  lista.innerHTML = ITENS_POPULARES.map(id => {
    return '<div class="search-list-item" onclick="buscarPrecosItem(\'' + id + '\')">' +
      '<img src="' + getItemIconUrl(id) + '" class="item-icon-sm" onerror="this.style.display=\'none\'" loading="lazy">' +
      '<div class="item-info"><div class="item-name">' + getNomeItem(id) + '</div><div class="item-category">' + getCategoria(id) + '</div></div>' +
      '</div>';
  }).join('');
}

function selecionarBuscar(texto) {
  document.getElementById('buscarInput').value = texto;
  document.getElementById('buscarSugestoes').style.display = 'none';
  const id = traduzirParaId(texto);
  if (id) buscarPrecosItem(id);
}

async function buscarPrecosItem(itemId) {
  const detalhes = document.getElementById('buscarDetalhes');
  setLoading(true);

  try {
    const data = await fetchPrices([itemId], CIDADES_COM_BRECILIEN, [1,2,3,4,5]);

    if (!data || !data.length) {
      detalhes.innerHTML = '<div class="empty-state small"><p style="color:var(--red)">Nenhum dado encontrado para ' + getNomeItem(itemId) + '</p></div>';
      setLoading(false);
      return;
    }

    const grupos = {};
    data.forEach(e => {
      const key = e.item_id + '@' + e.quality;
      if (!grupos[key]) grupos[key] = { item: e.item_id, quality: e.quality, precos: [] };
      grupos[key].precos.push({
        cidade: e.city,
        venda: e.sell_price_min || 0,
        compra: e.buy_price_max || 0,
      });
    });

    let html = '<div class="item-detail-header">' +
      '<img src="' + getItemIconUrl(itemId) + '" class="item-icon-lg" onerror="this.style.display=\'none\'" loading="lazy">' +
      '<div><div class="item-detail-title">' + getNomeItem(itemId) + '</div><div class="item-detail-category">' + getCategoria(itemId) + '</div></div>' +
      '</div>';

    Object.values(grupos).forEach(g => {
      const qName = ['','Normal','Bom','Excelente','Obra-Prima','Lendario'][g.quality] || 'Normal';
      const melhorVenda = Math.max(...g.precos.filter(p => p.venda > 0).map(p => p.venda), 0);
      const melhorCompra = Math.max(...g.precos.filter(p => p.compra > 0).map(p => p.compra), 0);

      html += '<div class="price-card">' +
        '<div class="price-card-header">' +
        '<div><div class="price-card-title">Qualidade: ' + qName + '</div></div>' +
        '<div style="text-align:right;font-size:12px;color:var(--text-muted);">Melhor Venda: <span style="color:var(--gold)">' + formatSilver(melhorVenda) + 'S</span><br>Melhor Compra: <span style="color:var(--green)">' + formatSilver(melhorCompra) + 'S</span></div>' +
        '</div>';

      g.precos.sort((a, b) => (b.venda || 0) - (a.venda || 0));
      g.precos.forEach(p => {
        const vendaStr = p.venda > 0 ? formatSilverFull(p.venda) + 'S' : '-';
        const compraStr = p.compra > 0 ? formatSilverFull(p.compra) + 'S' : '-';
        html += '<div class="price-row"><span class="city">' + p.cidade + '</span><span><span class="sell">V: ' + vendaStr + '</span> <span style="color:var(--text-muted)">|</span> <span class="buy">C: ' + compraStr + '</span></span></div>';
      });
      html += '</div>';
    });

    detalhes.innerHTML = html;
  } catch (err) {
    detalhes.innerHTML = '<div class="empty-state small"><p style="color:var(--red)">Erro: ' + escapeHtml(err.message) + '</p></div>';
  } finally {
    setLoading(false);
  }
}

// ============================================
// BLACK MARKET
// ============================================
const ITENS_BM = [
  'T4_BAG','T5_BAG','T6_BAG','T4_CAPE','T5_CAPE','T6_CAPE',
  'T4_2H_CLAYMORE','T5_2H_CLAYMORE','T6_2H_CLAYMORE','T7_2H_CLAYMORE','T8_2H_CLAYMORE',
  'T4_2H_FIRESTAFF','T5_2H_FIRESTAFF','T6_2H_FIRESTAFF','T7_2H_FIRESTAFF','T8_2H_FIRESTAFF',
  'T4_2H_BOW','T5_2H_BOW','T6_2H_BOW','T7_2H_BOW','T8_2H_BOW',
  'T4_HEAD_PLATE_SET1','T4_ARMOR_PLATE_SET1','T4_SHOES_PLATE_SET1',
  'T5_HEAD_PLATE_SET1','T5_ARMOR_PLATE_SET1','T5_SHOES_PLATE_SET1',
  'T4_HEAD_LEATHER_SET1','T4_ARMOR_LEATHER_SET1','T4_SHOES_LEATHER_SET1',
  'T5_HEAD_LEATHER_SET1','T5_ARMOR_LEATHER_SET1','T5_SHOES_LEATHER_SET1',
  'T4_HEAD_CLOTH_SET1','T4_ARMOR_CLOTH_SET1','T4_SHOES_CLOTH_SET1',
  'T5_HEAD_CLOTH_SET1','T5_ARMOR_CLOTH_SET1','T5_SHOES_CLOTH_SET1',
  'T4_METALBAR','T5_METALBAR','T6_METALBAR','T7_METALBAR','T8_METALBAR',
  'T4_LEATHER','T5_LEATHER','T6_LEATHER','T7_LEATHER','T8_LEATHER',
  'T4_CLOTH','T5_CLOTH','T6_CLOTH','T7_CLOTH','T8_CLOTH',
  'T4_PLANKS','T5_PLANKS','T6_PLANKS','T7_PLANKS','T8_PLANKS',
  'T4_POTION_HEAL','T5_POTION_HEAL','T6_POTION_HEAL','T7_POTION_HEAL','T8_POTION_HEAL',
  'T4_MOUNT_HORSE','T5_MOUNT_HORSE','T6_MOUNT_HORSE','T7_MOUNT_HORSE','T8_MOUNT_HORSE',
  'T4_OFF_SHIELD','T4_OFF_TORCH','T4_OFF_BOOK'
];

let bmResultadosCache = [];

function updateBmRange(val) {
  document.getElementById('bmMinProfitLabel').textContent = formatSilver(parseInt(val));
  const pct = Math.min(100, (val / 5000000) * 100);
  document.getElementById('bmRangeFill').style.width = pct + '%';
  document.getElementById('bmRangeThumb').style.left = pct + '%';
  filtrarBM();
}

function filtrarBM() {
  const filtro = document.getElementById('bmInput').value.toLowerCase().trim();
  const minProfit = parseInt(document.getElementById('bmMinProfit').value) || 0;
  const grid = document.getElementById('bmGrid');

  let filtrados = bmResultadosCache.filter(o => o.profit >= minProfit);
  if (filtro) {
    filtrados = filtrados.filter(o => getNomeItem(o.itemId).toLowerCase().includes(filtro));
  }

  if (!filtrados.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>Nenhuma oportunidade encontrada com esses filtros</p></div>';
    return;
  }

  grid.innerHTML = filtrados.map(o => {
    const nome = getNomeItem(o.itemId);
    return '<div class="bm-card">' +
      '<div class="bm-card-header">' +
      '<div class="bm-card-name"><img src="' + getItemIconUrl(o.itemId) + '" class="item-icon-sm" onerror="this.style.display=\'none\'" loading="lazy"> ' + nome + '</div>' +
      '<span class="tier-badge">' + getCategoria(o.itemId) + '</span>' +
      '</div>' +
      '<div class="bm-price-row"><span class="label">Compra em ' + o.cidade + '</span><span class="value price-sell">' + formatSilverFull(o.buy) + ' S</span></div>' +
      '<div class="bm-price-row"><span class="label">Venda BM (Caerleon)</span><span class="value price-bm">' + formatSilverFull(o.sell) + ' S</span></div>' +
      '<div class="bm-price-row"><span class="label">Taxa Venda (' + o.taxPct + '%)</span><span class="value" style="color:var(--red)">-' + formatSilverFull(o.tax) + ' S</span></div>' +
      '<div class="bm-card-footer">' +
      '<span class="bm-profit">' + formatSilverFull(o.profit) + ' S</span>' +
      '<span class="bm-profit-pct">' + formatPercent(o.profitPct) + '</span>' +
      '</div>' +
      '</div>';
  }).join('');
}

async function scanBM() {
  const grid = document.getElementById('bmGrid');
  const tax = document.getElementById('bmPremiumToggle')?.classList.contains('active') ? 0.04 : 0.08;
  const taxPct = tax === 0.04 ? '4' : '8';

  grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>Buscando oportunidades no Black Market...</p></div>';
  setLoading(true);

  try {
    const data = await fetchPrices(ITENS_BM, [...CIDADES_COM_BRECILIEN, 'Black Market'], [1]);

    const oportunidades = [];
    for (const itemId of ITENS_BM) {
      const bmPrice = getPrice(data, itemId, 'Black Market', 1);
      if (!bmPrice || !bmPrice.buy) continue;

      for (const city of CIDADES_COM_BRECILIEN) {
        const cityPrice = getPrice(data, itemId, city, 1);
        if (!cityPrice || !cityPrice.sell) continue;

        const buyCost = cityPrice.sell;
        const sellRevenue = bmPrice.buy;
        const sellFee = Math.ceil(sellRevenue * tax);
        const netRevenue = sellRevenue - sellFee;
        const profit = netRevenue - buyCost;
        const profitPct = buyCost > 0 ? (profit / buyCost) : 0;

        if (profit > 0) {
          oportunidades.push({ itemId, cidade: city, buy: buyCost, sell: sellRevenue, profit, profitPct, tax: sellFee, taxPct });
        }
      }
    }

    oportunidades.sort((a, b) => b.profit - a.profit);
    bmResultadosCache = oportunidades;
    filtrarBM();

  } catch (err) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p style="color:var(--red)">Erro: ' + escapeHtml(err.message) + '</p></div>';
  } finally {
    setLoading(false);
  }
}

// ============================================
// CRAFT & REFINO
// ============================================
const RECIPES_REFINO = {
  'T2_METALBAR': { raw: 'T2_ORE', refined: 'T2_METALBAR', tier: 2, rawQty: 1, lowerRefined: null, lowerQty: 0, nome: 'Barra de Metal T2' },
  'T3_METALBAR': { raw: 'T3_ORE', refined: 'T3_METALBAR', tier: 3, rawQty: 2, lowerRefined: 'T2_METALBAR', lowerQty: 1, nome: 'Barra de Metal T3' },
  'T4_METALBAR': { raw: 'T4_ORE', refined: 'T4_METALBAR', tier: 4, rawQty: 2, lowerRefined: 'T3_METALBAR', lowerQty: 1, nome: 'Barra de Metal T4' },
  'T5_METALBAR': { raw: 'T5_ORE', refined: 'T5_METALBAR', tier: 5, rawQty: 3, lowerRefined: 'T4_METALBAR', lowerQty: 1, nome: 'Barra de Metal T5' },
  'T6_METALBAR': { raw: 'T6_ORE', refined: 'T6_METALBAR', tier: 6, rawQty: 4, lowerRefined: 'T5_METALBAR', lowerQty: 1, nome: 'Barra de Metal T6' },
  'T7_METALBAR': { raw: 'T7_ORE', refined: 'T7_METALBAR', tier: 7, rawQty: 5, lowerRefined: 'T6_METALBAR', lowerQty: 1, nome: 'Barra de Metal T7' },
  'T8_METALBAR': { raw: 'T8_ORE', refined: 'T8_METALBAR', tier: 8, rawQty: 5, lowerRefined: 'T7_METALBAR', lowerQty: 1, nome: 'Barra de Metal T8' },
  'T2_LEATHER': { raw: 'T2_HIDE', refined: 'T2_LEATHER', tier: 2, rawQty: 1, lowerRefined: null, lowerQty: 0, nome: 'Couro T2' },
  'T3_LEATHER': { raw: 'T3_HIDE', refined: 'T3_LEATHER', tier: 3, rawQty: 2, lowerRefined: 'T2_LEATHER', lowerQty: 1, nome: 'Couro T3' },
  'T4_LEATHER': { raw: 'T4_HIDE', refined: 'T4_LEATHER', tier: 4, rawQty: 2, lowerRefined: 'T3_LEATHER', lowerQty: 1, nome: 'Couro T4' },
  'T5_LEATHER': { raw: 'T5_HIDE', refined: 'T5_LEATHER', tier: 5, rawQty: 3, lowerRefined: 'T4_LEATHER', lowerQty: 1, nome: 'Couro T5' },
  'T6_LEATHER': { raw: 'T6_HIDE', refined: 'T6_LEATHER', tier: 6, rawQty: 4, lowerRefined: 'T5_LEATHER', lowerQty: 1, nome: 'Couro T6' },
  'T7_LEATHER': { raw: 'T7_HIDE', refined: 'T7_LEATHER', tier: 7, rawQty: 5, lowerRefined: 'T6_LEATHER', lowerQty: 1, nome: 'Couro T7' },
  'T8_LEATHER': { raw: 'T8_HIDE', refined: 'T8_LEATHER', tier: 8, rawQty: 5, lowerRefined: 'T7_LEATHER', lowerQty: 1, nome: 'Couro T8' },
  'T2_CLOTH': { raw: 'T2_FIBER', refined: 'T2_CLOTH', tier: 2, rawQty: 1, lowerRefined: null, lowerQty: 0, nome: 'Tecido T2' },
  'T3_CLOTH': { raw: 'T3_FIBER', refined: 'T3_CLOTH', tier: 3, rawQty: 2, lowerRefined: 'T2_CLOTH', lowerQty: 1, nome: 'Tecido T3' },
  'T4_CLOTH': { raw: 'T4_FIBER', refined: 'T4_CLOTH', tier: 4, rawQty: 2, lowerRefined: 'T3_CLOTH', lowerQty: 1, nome: 'Tecido T4' },
  'T5_CLOTH': { raw: 'T5_FIBER', refined: 'T5_CLOTH', tier: 5, rawQty: 3, lowerRefined: 'T4_CLOTH', lowerQty: 1, nome: 'Tecido T5' },
  'T6_CLOTH': { raw: 'T6_FIBER', refined: 'T6_CLOTH', tier: 6, rawQty: 4, lowerRefined: 'T5_CLOTH', lowerQty: 1, nome: 'Tecido T6' },
  'T7_CLOTH': { raw: 'T7_FIBER', refined: 'T7_CLOTH', tier: 7, rawQty: 5, lowerRefined: 'T6_CLOTH', lowerQty: 1, nome: 'Tecido T7' },
  'T8_CLOTH': { raw: 'T8_FIBER', refined: 'T8_CLOTH', tier: 8, rawQty: 5, lowerRefined: 'T7_CLOTH', lowerQty: 1, nome: 'Tecido T8' },
  'T2_PLANKS': { raw: 'T2_WOOD', refined: 'T2_PLANKS', tier: 2, rawQty: 1, lowerRefined: null, lowerQty: 0, nome: 'Tabua T2' },
  'T3_PLANKS': { raw: 'T3_WOOD', refined: 'T3_PLANKS', tier: 3, rawQty: 2, lowerRefined: 'T2_PLANKS', lowerQty: 1, nome: 'Tabua T3' },
  'T4_PLANKS': { raw: 'T4_WOOD', refined: 'T4_PLANKS', tier: 4, rawQty: 2, lowerRefined: 'T3_PLANKS', lowerQty: 1, nome: 'Tabua T4' },
  'T5_PLANKS': { raw: 'T5_WOOD', refined: 'T5_PLANKS', tier: 5, rawQty: 3, lowerRefined: 'T4_PLANKS', lowerQty: 1, nome: 'Tabua T5' },
  'T6_PLANKS': { raw: 'T6_WOOD', refined: 'T6_PLANKS', tier: 6, rawQty: 4, lowerRefined: 'T5_PLANKS', lowerQty: 1, nome: 'Tabua T6' },
  'T7_PLANKS': { raw: 'T7_WOOD', refined: 'T7_PLANKS', tier: 7, rawQty: 5, lowerRefined: 'T6_PLANKS', lowerQty: 1, nome: 'Tabua T7' },
  'T8_PLANKS': { raw: 'T8_WOOD', refined: 'T8_PLANKS', tier: 8, rawQty: 5, lowerRefined: 'T7_PLANKS', lowerQty: 1, nome: 'Tabua T8' },
  'T2_STONEBLOCK': { raw: 'T2_ROCK', refined: 'T2_STONEBLOCK', tier: 2, rawQty: 1, lowerRefined: null, lowerQty: 0, nome: 'Bloco de Pedra T2' },
  'T3_STONEBLOCK': { raw: 'T3_ROCK', refined: 'T3_STONEBLOCK', tier: 3, rawQty: 2, lowerRefined: 'T2_STONEBLOCK', lowerQty: 1, nome: 'Bloco de Pedra T3' },
  'T4_STONEBLOCK': { raw: 'T4_ROCK', refined: 'T4_STONEBLOCK', tier: 4, rawQty: 2, lowerRefined: 'T3_STONEBLOCK', lowerQty: 1, nome: 'Bloco de Pedra T4' },
  'T5_STONEBLOCK': { raw: 'T5_ROCK', refined: 'T5_STONEBLOCK', tier: 5, rawQty: 3, lowerRefined: 'T4_STONEBLOCK', lowerQty: 1, nome: 'Bloco de Pedra T5' },
  'T6_STONEBLOCK': { raw: 'T6_ROCK', refined: 'T6_STONEBLOCK', tier: 6, rawQty: 4, lowerRefined: 'T5_STONEBLOCK', lowerQty: 1, nome: 'Bloco de Pedra T6' },
  'T7_STONEBLOCK': { raw: 'T7_ROCK', refined: 'T7_STONEBLOCK', tier: 7, rawQty: 5, lowerRefined: 'T6_STONEBLOCK', lowerQty: 1, nome: 'Bloco de Pedra T7' },
  'T8_STONEBLOCK': { raw: 'T8_ROCK', refined: 'T8_STONEBLOCK', tier: 8, rawQty: 5, lowerRefined: 'T7_STONEBLOCK', lowerQty: 1, nome: 'Bloco de Pedra T8' }
};

function updateRecipeDesc() {
  const recipeId = document.getElementById('craftRecipe').value;
  const recipe = RECIPES_REFINO[recipeId];
  if (!recipe) return;
  const desc = document.getElementById('recipeDesc');
  if (recipe.lowerRefined) {
    desc.textContent = recipe.rawQty + 'x ' + getNomeItem(recipe.raw) + ' + ' + recipe.lowerQty + 'x ' + getNomeItem(recipe.lowerRefined) + ' -> 1x ' + recipe.nome;
  } else {
    desc.textContent = recipe.rawQty + 'x ' + getNomeItem(recipe.raw) + ' -> 1x ' + recipe.nome;
  }
}

function updateCraftRrr(val) {
  document.getElementById('craftRrrLabel').textContent = parseFloat(val).toFixed(1) + '%';
  document.getElementById('craftRrrFill').style.width = val + '%';
  document.getElementById('craftRrrThumb').style.left = val + '%';
}

function updateCraftStation(val) {
  document.getElementById('craftStationLabel').textContent = val;
  const pct = Math.min(100, (val / 5000) * 100);
  document.getElementById('craftStationFill').style.width = pct + '%';
  document.getElementById('craftStationThumb').style.left = pct + '%';
}

function calcularCraftRefino() {
  const recipeId = document.getElementById('craftRecipe').value;
  const recipe = RECIPES_REFINO[recipeId];
  if (!recipe) return;

  const rawPrice = parseFloat(document.getElementById('craftRawPrice').value) || 0;
  const refinedPrice = parseFloat(document.getElementById('craftRefinedPrice').value) || 0;
  const qty = parseInt(document.getElementById('craftQty').value) || 1;
  const rrr = parseFloat(document.getElementById('craftRrr').value) || 0;
  const stationFee = parseInt(document.getElementById('craftStation').value) || 0;
  const premium = document.getElementById('craftPremiumToggle')?.classList.contains('active');
  const tax = premium ? 0.04 : 0.08;

  const totalRawCost = rawPrice * recipe.rawQty * qty;
  const returnValue = totalRawCost * (rrr / 100);
  const totalStationFee = stationFee * qty;
  const netCost = totalRawCost - returnValue + totalStationFee;

  const totalSellRevenue = refinedPrice * qty;
  const sellFee = Math.ceil(totalSellRevenue * tax);
  const netRevenue = totalSellRevenue - sellFee;
  const profit = netRevenue - netCost;
  const profitPct = netCost > 0 ? (profit / netCost) : 0;

  const profitClass = profit >= 0 ? 'positive' : 'negative';
  const profitColor = profit >= 0 ? 'green' : 'red';

  const html =
    '<div class="result-grid">' +
    '<div class="result-item"><label>Receita Bruta</label><div class="value neutral">' + formatSilver(totalSellRevenue) + '</div></div>' +
    '<div class="result-item"><label>Custo Total</label><div class="value ' + profitClass + '">' + formatSilver(netCost) + '</div></div>' +
    '<div class="result-item"><label>Lucro Liquido</label><div class="value ' + profitClass + '">' + formatSilver(profit) + '</div></div>' +
    '<div class="result-item"><label>Margem</label><div class="value ' + profitClass + '">' + formatPercent(profitPct) + '</div></div>' +
    '</div>' +
    '<div class="result-breakdown">' +
    '<h4>Detalhamento (' + qty + ' unidades)</h4>' +
    '<div class="breakdown-row"><span class="label">' + getNomeItem(recipe.raw) + ' x' + (recipe.rawQty * qty) + ' @ ' + formatSilver(rawPrice) + '</span><span class="amount">' + formatSilver(totalRawCost) + '</span></div>' +
    (recipe.lowerRefined ? '<div class="breakdown-row"><span class="label">' + getNomeItem(recipe.lowerRefined) + ' x' + (recipe.lowerQty * qty) + '</span><span class="amount">(incluido no preco do bruto)</span></div>' : '') +
    '<div class="breakdown-row"><span class="label">Retorno de Materiais (' + rrr + '%)</span><span class="amount" style="color:var(--green)">-' + formatSilver(returnValue) + '</span></div>' +
    '<div class="breakdown-row"><span class="label">Taxa Estacao x' + qty + '</span><span class="amount" style="color:var(--red)">+' + formatSilver(totalStationFee) + '</span></div>' +
    '<div class="breakdown-row"><span class="label">Taxa Venda (' + (tax*100) + '%)</span><span class="amount" style="color:var(--red)">-' + formatSilver(sellFee) + '</span></div>' +
    '<div class="breakdown-row" style="border-top:2px solid var(--border);margin-top:8px;padding-top:8px">' +
    '<span class="label" style="color:var(--text);font-weight:600">Lucro Final</span>' +
    '<span class="amount" style="color:var(--' + profitColor + ');font-weight:700">' + formatSilver(profit) + '</span>' +
    '</div>' +
    '</div>';

  document.getElementById('craftResultContent').innerHTML = html;
}

// ============================================
// INICIALIZACAO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initFlipper();
  initBuscar();
  updateRecipeDesc();
  updateCraftRrr(document.getElementById('craftRrr').value);
  updateCraftStation(document.getElementById('craftStation').value);
});
