// Main site JS: search, list, UX. Designed for speed & smoothness.
// NOTE: API key is included in SITE_CONFIG in index.html
const CONFIG = window.SITE_CONFIG || {};
const API_KEY = CONFIG.API_KEY;
const IMG_BASE = CONFIG.IMG_BASE || "https://image.tmdb.org/t/p/w500";
const GRID = document.getElementById('grid');
const SEARCH = document.getElementById('q');
const TYPE = document.getElementById('typeSelect');
const LOAD_MORE = document.getElementById('loadMore');
const YEAR = document.getElementById('year');

if(YEAR) YEAR.textContent = new Date().getFullYear();

let page = 1;
let lastQuery = '';
let lastType = 'movie';
let isLoading = false;

// small helper for fetch
async function apiFetch(path){
  const url = `https://api.themoviedb.org/3/${path}&api_key=${API_KEY}&language=en-US`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('API error');
  return res.json();
}

function createCard(item, mediaType){
  const title = item.title || item.name || 'Untitled';
  const poster = item.poster_path ? `${IMG_BASE}${item.poster_path}` : '';
  const a = document.createElement('a');
  a.className = 'card';
  a.href = `player.html?type=${mediaType}&id=${item.id}`;
  a.innerHTML = `
    <div class="poster" style="${poster ? `background-image:url(${poster})` : ''}"></div>
    <div class="meta">
      <div class="title">${escapeHtml(title)}</div>
      <div class="subtitle">${(mediaType||'movie').toUpperCase()}</div>
    </div>
  `;
  return a;
}

function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function renderResults(results, append=false){
  if(!append) GRID.innerHTML = '';
  for(const it of results){
    const media = it.media_type || lastType;
    const card = createCard(it, media);
    GRID.appendChild(card);
  }
}

async function loadPopular(type='movie', p=1, append=false){
  try{
    setLoading(true);
    const data = await apiFetch(`${type}/popular?page=${p}`);
    await renderResults(data.results, append);
    toggleLoadMore(data.page < data.total_pages);
  }catch(e){ console.error(e) }
  finally{ setLoading(false) }
}

async function search(query, type='movie', p=1, append=false){
  try{
    setLoading(true);
    const data = await apiFetch(`search/${type}?query=${encodeURIComponent(query)}&page=${p}`);
    await renderResults(data.results, append);
    toggleLoadMore(data.page < data.total_pages);
  }catch(e){ console.error(e) }
  finally{ setLoading(false) }
}

function toggleLoadMore(show){ LOAD_MORE.style.display = show ? 'inline-block' : 'none'; }

function setLoading(val){
  isLoading = val;
  GRID.setAttribute('aria-busy', String(val));
}

// initial popular
loadPopular('movie',1);

// interactions
document.getElementById('searchForm').addEventListener('submit', e=>{
  e.preventDefault();
  const q = SEARCH.value.trim();
  const t = TYPE.value;
  page = 1; lastQuery = q; lastType = t;
  if(!q){
    loadPopular(t,1);
  } else {
    search(q,t,1);
  }
});

document.getElementById('btn-popular').addEventListener('click', ()=>{
  page=1; lastQuery=''; lastType = TYPE.value;
  loadPopular(TYPE.value,1);
});
document.getElementById('btn-trending').addEventListener('click', async ()=>{
  page=1; lastQuery=''; lastType = 'all';
  try{
    setLoading(true);
    const data = await apiFetch(`trending/all/week?page=1`);
    await renderResults(data.results, false);
    toggleLoadMore(false);
  }catch(e){ console.error(e) } finally{ setLoading(false) }
});

LOAD_MORE.addEventListener('click', ()=>{
  if(isLoading) return;
  page++;
  if(lastQuery){
    search(lastQuery, lastType, page, true);
  } else {
    loadPopular(lastType === 'all' ? 'movie' : lastType, page, true);
  }
});

// First organic click -> CPA redirect (one-time)
document.body.addEventListener('click', function(e){
  const target = e.target;
  if(target.closest('a') || target.closest('button') || target.closest('select') || target.closest('input')) return;
  // do not trigger on ad placeholders
  if(target.closest('.ad')) return;
  // redirect only once
  if(!sessionStorage.getItem('organicCaptured')){
    sessionStorage.setItem('organicCaptured','1');
    setTimeout(()=>{ window.location.href = CONFIG.CPA_LINK; }, 600);
  }
}, { once: true });

// small UX: live keyboard focus for accessibility
document.addEventListener('keydown', (e)=>{
  if(e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault(); SEARCH.focus();
  }
});