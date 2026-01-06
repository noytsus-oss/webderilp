// Player page script: loads details and updates Open Graph meta tags (client-side).
const CFG = window.SITE_CONFIG || {};
const API_KEY = CFG.API_KEY;
const CPA_LINK = CFG.CPA_LINK;
const IMG_ORIG = CFG.IMG_ORIG || 'https://image.tmdb.org/t/p/original';

document.getElementById('year2').textContent = new Date().getFullYear();

function qs(name){ return new URLSearchParams(location.search).get(name); }
function fmtRuntime(mins){ if(!mins) return '01:30:00'; const h = Math.floor(mins/60); const m = mins%60; return h>0 ? `${h}:${String(m).padStart(2,'0')}:00` : `00:${String(m).padStart(2,'0')}:00`; }

const type = qs('type') || 'movie';
const id = qs('id');

const titleEl = document.getElementById('title');
const descEl = document.getElementById('desc');
const playerSurface = document.getElementById('playerSurface');
const timeLabel = document.getElementById('timeLabel');
const progFill = document.getElementById('progFill');
const seasonSelect = document.getElementById('seasonSelect');
const episodesList = document.getElementById('episodesList');

if(!id){
  titleEl.textContent = 'Missing content ID';
  descEl.textContent = 'No id specified. Go back to home.';
} else {
  loadDetail();
}

async function api(path){
  const url = `https://api.themoviedb.org/3/${path}&api_key=${API_KEY}&language=en-US`;
  const res = await fetch(url);
  return res.json();
}

async function loadDetail(){
  try{
    const detail = await api(`${type}/${id}?`);
    const title = detail.title || detail.name || 'Untitled';
    const overview = detail.overview || '—';
    const runtime = detail.runtime || (detail.episode_run_time ? detail.episode_run_time[0] : 45);

    titleEl.textContent = title;
    descEl.textContent = overview;
    timeLabel.textContent = `0:00 / ${fmtRuntime(runtime)}`;

    // update OG meta tags client-side (helpful for some crawlers that render JS)
    document.getElementById('pageTitle').textContent = `${title} — StreamHub`;
    const canonical = `${location.origin}/player.html?type=${type}&id=${id}`;
    document.getElementById('canonicalLink').href = canonical;
    const ogTitle = document.getElementById('ogTitle'); if(ogTitle) ogTitle.content = title;
    const ogDesc = document.getElementById('ogDesc'); if(ogDesc) ogDesc.content = overview;
    const ogImg = document.getElementById('ogImage');
    let imgUrl = detail.backdrop_path ? `${IMG_ORIG}${detail.backdrop_path}` : (detail.poster_path ? `${IMG_ORIG}${detail.poster_path}` : '');
    if(ogImg && imgUrl) ogImg.content = imgUrl;

    // background
    if(imgUrl) playerSurface.style.backgroundImage = `url(${imgUrl})`;

    if(type === 'tv'){
      // show seasons
      const seasons = detail.number_of_seasons || 1;
      seasonSelect.style.display = 'inline-block';
      seasonSelect.innerHTML = '';
      const s = parseInt(qs('s') || '1', 10);
      for(let i=1;i<=seasons;i++){
        const opt = document.createElement('option'); opt.value = i; opt.text = 'Season '+i; if(i===s) opt.selected=true;
        seasonSelect.appendChild(opt);
      }
      loadSeason(s);
      seasonSelect.addEventListener('change', ()=> {
        const newS = seasonSelect.value;
        location.href = `player.html?type=tv&id=${id}&s=${newS}&e=1`;
      });
    }
  }catch(err){
    console.error(err);
  }
}

async function loadSeason(seasonNumber){
  try{
    episodesList.innerHTML = '';
    const data = await api(`tv/${id}/season/${seasonNumber}?`);
    (data.episodes || []).forEach(ep => {
      const a = document.createElement('a');
      a.className = 'item';
      const runtime = ep.runtime || (data.episodes_runtime && data.episodes_runtime[0]) || 45;
      a.href = `player.html?type=tv&id=${id}&s=${seasonNumber}&e=${ep.episode_number}`;
      a.innerHTML = `<div class="thumb">${ep.still_path ? `<img src="https://image.tmdb.org/t/p/w300${ep.still_path}" alt="">` : '<i class="fas fa-video"></i>'}</div>
                     <div>
                       <div style="font-weight:600">${ep.episode_number}. ${escapeHtml(ep.name)}</div>
                       <div class="muted">UHD • ${runtime} min</div>
                     </div>`;
      episodesList.appendChild(a);
    });
  }catch(err){ console.error(err) }
}

function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Visual ripple + click -> CPA redirect (first click or play)
playerSurface.addEventListener('click', (e)=>{
  const rect = playerSurface.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
  ripple.style.left = (e.clientX - rect.left - (rect.height/2)) + 'px';
  ripple.style.top = (e.clientY - rect.top - (rect.height/2)) + 'px';
  ripple.style.background = 'rgba(255,255,255,0.12)';
  ripple.style.animation = 'ripple 0.6s linear';
  ripple.style.pointerEvents = 'none';
  playerSurface.appendChild(ripple);
  setTimeout(()=> ripRemove(ripple), 650);
  setTimeout(()=> window.location.href = CPA_LINK, 650);
});
function ripRemove(el){ if(el && el.parentNode) el.parentNode.removeChild(el); }

// first organic click -> CPA redirect (once)
document.body.addEventListener('click', function(e){
  if(e.target.closest('a') || e.target.closest('button') || e.target.closest('select')) return;
  if(e.target.closest('.ad')) return;
  if(!sessionStorage.getItem('organicCaptured')){
    sessionStorage.setItem('organicCaptured','1');
    setTimeout(()=> window.location.href = CPA_LINK, 700);
  }
}, { once: true });