const data = [
  { id:1, name:"Wireless Mouse",  category:"Accessories", price:799,  rating:4.3, img:"https://picsum.photos/seed/mouse/400/260" },
  { id:2, name:"Mechanical Keyboard", category:"Accessories", price:3499, rating:4.7, img:"https://picsum.photos/seed/keyboard/400/260" },
  { id:3, name:"Noise-Cancel Headphones", category:"Audio", price:5999, rating:4.6, img:"https://picsum.photos/seed/headphones/400/260" },
  { id:4, name:"USB-C Charger 65W", category:"Power", price:1899, rating:4.4, img:"https://picsum.photos/seed/charger/400/260" },
  { id:5, name:"4K Monitor 27\"", category:"Displays", price:18999, rating:4.5, img:"https://picsum.photos/seed/monitor/400/260" },
  { id:6, name:"Bluetooth Speaker", category:"Audio", price:2499, rating:4.2, img:"https://picsum.photos/seed/speaker/400/260" },
  { id:7, name:"Webcam 1080p", category:"Accessories", price:2199, rating:4.0, img:"https://picsum.photos/seed/webcam/400/260" },
  { id:8, name:"Portable SSD 1TB", category:"Storage", price:6999, rating:4.8, img:"https://picsum.photos/seed/ssd/400/260" },
  { id:9, name:"Gaming Laptop Stand", category:"Accessories", price:1499, rating:4.1, img:"https://picsum.photos/seed/stand/400/260" },
];

const qEl = document.getElementById("q");
const catEl = document.getElementById("cat");
const minEl = document.getElementById("min");
const maxEl = document.getElementById("max");
const sortEl = document.getElementById("sort");
const grid = document.getElementById("grid");

// Populate categories
const cats = ["all", ...new Set(data.map(d => d.category))];
cats.forEach(c => {
  const opt = document.createElement("option");
  opt.value = c;
  opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
  catEl.appendChild(opt);
});

function render(){
  const q = (qEl.value || "").toLowerCase();
  const cat = catEl.value;
  const min = Number(minEl.value) || 0;
  const max = Number(maxEl.value) || Number.MAX_SAFE_INTEGER;

  let items = data.filter(p =>
    p.name.toLowerCase().includes(q) &&
    (cat === "all" || p.category === cat) &&
    p.price >= min && p.price <= max
  );

  switch (sortEl.value){
    case "priceAsc": items.sort((a,b)=>a.price-b.price); break;
    case "priceDesc": items.sort((a,b)=>b.price-a.price); break;
    case "nameAsc": items.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: items.sort((a,b)=>b.rating-a.rating);
  }

  grid.innerHTML = "";
  items.forEach(p => grid.appendChild(card(p)));
}

function card(p){
  const div = document.createElement("article");
  div.className = "card";
  div.innerHTML = `
    <img src="${p.img}" alt="${p.name}" style="width:100%;border-radius:.7rem;margin-bottom:.6rem" />
    <h3 style="margin:.25rem 0">${p.name}</h3>
    <p class="muted">${p.category} • ⭐ ${p.rating.toFixed(1)}</p>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:.4rem">
      <strong>₹${p.price.toLocaleString()}</strong>
      <button class="btn btn-small" aria-label="Add ${p.name} to cart">Add</button>
    </div>
  `;
  return div;
}

[qEl, catEl, minEl, maxEl, sortEl].forEach(el => el.addEventListener("input", render));
render();
