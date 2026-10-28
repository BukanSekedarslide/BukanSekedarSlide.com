/* ========== KONFIGURASI (edit di sini) ========== */
const CONFIG = {
  waNumber: "628XXXXXXXXXX",          // format internasional tanpa +, spasi, atau strip
  instagram: "https://instagram.com/", // ganti dengan link Instagram BSS
  email: "email@contoh.com"            // ganti dengan email BSS
};

/* Data DEMO. Ganti dengan template asli. theme = s1..s5 (warna mockup) */
const TEMPLATES = [
  {name:"Contoh Edu Bersih", cat:"Pendidikan", theme:"s4", desc:"Layout rapi untuk tugas dan presentasi kelas.", slides:"XX", format:".pptx"},
  {name:"Contoh Bisnis Data", cat:"Bisnis", theme:"s2", desc:"Cocok untuk laporan dan presentasi data.", slides:"XX", format:".pptx"},
  {name:"Contoh Proposal Hangat", cat:"Proposal", theme:"s3", desc:"Struktur proposal dengan nuansa earth tone.", slides:"XX", format:".pptx"},
  {name:"Contoh Seminar Fokus", cat:"Seminar", theme:"s5", desc:"Slide jelas untuk pemaparan seminar.", slides:"XX", format:".pptx"},
  {name:"Contoh Minimalis Sage", cat:"Minimalis", theme:"s1", desc:"Tampilan sederhana dan elegan.", slides:"XX", format:".pptx"},
  {name:"Contoh Kreatif Warna", cat:"Kreatif", theme:"s3", desc:"Komposisi berani untuk ide kreatif.", slides:"XX", format:".pptx"}
];
const CATS = ["Semua","Pendidikan","Bisnis","Proposal","Seminar","Minimalis","Kreatif"];

/* ========== WhatsApp ========== */
const waUrl = msg => `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(msg)}`;
function bindWA(root=document){
  root.querySelectorAll("[data-wa]").forEach(a=>{
    a.href = waUrl(a.dataset.wa);
    a.target = "_blank"; a.rel = "noopener";
  });
}

/* ========== Menu mobile ========== */
const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click",()=>{
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click",e=>{ if(e.target.tagName==="A"){ menu.classList.remove("open"); burger.setAttribute("aria-expanded","false"); }});
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ menu.classList.remove("open"); burger.setAttribute("aria-expanded","false"); }});

/* ========== Katalog ========== */
const $ = id => document.getElementById(id);
let activeCat = "Semua";
const preview = t => `<div class="slide ${t.theme}"><i></i><b></b><u></u></div>`;

function renderChips(){
  $("chips").innerHTML = CATS.map(c=>`<button class="chip" type="button" aria-pressed="${c===activeCat}" data-cat="${c}">${c}</button>`).join("");
}
function renderCatalog(){
  const q = $("search").value.trim().toLowerCase();
  const list = TEMPLATES.map((t,i)=>({...t,i})).filter(t =>
    (activeCat==="Semua" || t.cat===activeCat) &&
    (t.name+" "+t.cat+" "+t.desc).toLowerCase().includes(q));
  $("catalog").innerHTML = list.map(t=>`
    <article class="tcard">
      ${preview(t)}
      <span class="demo">CONTOH DEMO</span>
      <h3>${t.name}</h3><span class="tag">${t.cat}</span>
      <p>${t.desc}</p>
      <span class="price">Rp XXX <small>(placeholder)</small></span>
      <div class="row">
        <button class="btn btn-line" type="button" data-detail="${t.i}">Lihat Detail</button>
        <a class="btn btn-brown" data-wa="Halo BukanSekedarSlide, saya ingin memesan template: ${t.name}.">Pesan Template</a>
      </div>
    </article>`).join("");
  $("empty").hidden = list.length > 0;
  bindWA($("catalog"));
}
$("chips").addEventListener("click",e=>{
  const b = e.target.closest("[data-cat]"); if(!b) return;
  activeCat = b.dataset.cat; renderChips(); renderCatalog();
});
$("search").addEventListener("input",renderCatalog);

/* ========== Detail produk (dialog) ========== */
const dlg = $("dlg");
$("catalog").addEventListener("click",e=>{
  const b = e.target.closest("[data-detail]"); if(!b) return;
  const t = TEMPLATES[b.dataset.detail];
  $("dbody").innerHTML = `
    <h3 id="dtitle">${t.name}</h3><span class="demo">CONTOH DEMO</span>
    <div class="prev">${preview(t)}${preview({theme:"s2"})}${preview({theme:"s3"})}</div>
    <p>${t.desc}</p>
    <dl><dt>Kategori</dt><dd>${t.cat}</dd><dt>Jumlah slide</dt><dd>${t.slides}</dd>
    <dt>Format</dt><dd>${t.format}</dd><dt>Harga</dt><dd>Rp XXX (placeholder)</dd>
    <dt>Ketentuan</dt><dd>Ketentuan sewa dan penggunaan dikonfirmasi admin.</dd></dl>
    <a class="btn btn-brown" data-wa="Halo BukanSekedarSlide, saya ingin memesan template: ${t.name}.">Pesan via WhatsApp</a>`;
  bindWA($("dbody"));
  dlg.showModal();
});
$("dclose").addEventListener("click",()=>dlg.close());
dlg.addEventListener("click",e=>{ if(e.target===dlg) dlg.close(); });

/* ========== Lain-lain ========== */
$("year").textContent = new Date().getFullYear();
$("ig").href = $("ig2").href = CONFIG.instagram;
$("mail").href = "mailto:" + CONFIG.email;
document.querySelectorAll("[data-soon]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();alert("Halaman ini akan segera tersedia.");}));

const totop = $("totop");
addEventListener("scroll",()=>{ totop.hidden = scrollY < 500; },{passive:true});

if("IntersectionObserver" in window){
  const io = new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target);} }),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
} else document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in"));

renderChips(); renderCatalog(); bindWA();
