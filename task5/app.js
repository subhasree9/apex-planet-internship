"use strict";

/* ---------- Data ---------- */
const PRODUCTS = [
  {id:1,name:"Wireless Mouse",category:"Accessories",price:799,rating:4.3, img:"https://picsum.photos/seed/mouse/600/400"},
  {id:2,name:"Mechanical Keyboard",category:"Accessories",price:3499,rating:4.7,img:"https://picsum.photos/seed/keyboard/600/400"},
  {id:3,name:"Noise-Cancel Headphones",category:"Audio",price:5999,rating:4.6,img:"https://picsum.photos/seed/headphones/600/400"},
  {id:4,name:"USB-C Charger 65W",category:"Power",price:1899,rating:4.4,img:"https://picsum.photos/seed/charger/600/400"},
  {id:5,name:"4K Monitor 27\"",category:"Displays",price:18999,rating:4.5,img:"https://picsum.photos/seed/monitor/600/400"},
  {id:6,name:"Bluetooth Speaker",category:"Audio",price:2499,rating:4.2,img:"https://picsum.photos/seed/speaker/600/400"},
  {id:7,name:"Webcam 1080p",category:"Accessories",price:2199,rating:4.0,img:"https://picsum.photos/seed/webcam/600/400"},
  {id:8,name:"Portable SSD 1TB",category:"Storage",price:6999,rating:4.8,img:"https://picsum.photos/seed/ssd/600/400"},
  {id:9,name:"Gaming Laptop Stand",category:"Accessories",price:1499,rating:4.1,img:"https://picsum.photos/seed/stand/600/400"},
  {id:10,name:"Studio Microphone",category:"Audio",price:3299,rating:4.4,img:"https://picsum.photos/seed/mic/600/400"},
];

/* ---------- Elements ---------- */
const yearEl = document.getElementById("year");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

const qEl = document.getElementById("q");
const catEl = document.getElementById("cat");
const minEl = document.getElementById("min");
const maxEl = document.getElementById("max");
const sortEl = document.getElementById("sort");
const grid = document.getElementById("grid");

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout");

/* ---------- Misc ---------- */
yearEl.textContent = new Date().getFullYear();
menuBtn?.addEventListener("click", ()=>{
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

/* ---------- Populate categories ---------- */
const cats = ["all", ...new Set(PRODUCTS.map(p=>p.category))];
for (const c of cats){
  const opt = document.createElement("option");
  opt.value = c; opt.textContent = c;
  catEl.appendChild(opt);
}

/* ---------- Rendering ---------- */
function card(p){
  const el = document.createElement("article");
  el.className = "cardItem";
  el.setAttribute("role", "listitem");
  el.innerHTML = `
    <img loading="lazy" src="${p.img}" alt="${p.name}">
    <div class="info">
      <h3>${p.name}</h3>
      <p class="muted">${p.category} • ⭐ ${p.rating.toFixed(1)}</p>
      <div class="priceLine">
        <strong>₹${p.price.toLocaleString()}</strong>
        <button class="btn add" aria-label="Add ${p.name} to cart">Add</button>
      </div>
    </div>`;
  el.querySelector(".add").addEventListener("click", ()=> addToCart(p.id));
  return el;
}

function render(){
  const q = (qEl.value||"").toLowerCase();
  const cat = catEl.value;
  const min = Number(minEl.value)||0;
  const max = Number(maxEl.value)||Number.MAX_SAFE_INTEGER;

  let items = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) &&
    (cat==="all" || p.category===cat) &&
    p.price>=min && p.price<=max
  );

  switch(sortEl.value){
    case "priceAsc": items.sort((a,b)=>a.price-b.price); break;
    case "priceDesc": items.sort((a,b)=>b.price-a.price); break;
    case "nameAsc": items.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: items.sort((a,b)=>b.rating-a.rating);
  }

  grid.innerHTML = "";
  const frag = document.createDocumentFragment();
  items.forEach(p => frag.appendChild(card(p)));
  grid.appendChild(frag);
}

/* ---------- Debounce for search ---------- */
function debounce(fn,ms=250){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}
const debouncedRender = debounce(render, 200);

/* ---------- Events ---------- */
[qEl,catEl,minEl,maxEl,sortEl].forEach(el=>{
  el.addEventListener(el===qEl?"input":"change", el===qEl?debouncedRender:render);
});
render();

/* ---------- Cart (localStorage) ---------- */
const LS_KEY="minishop_cart_v1";
let cart = loadCart();
function loadCart(){ try{return JSON.parse(localStorage.getItem(LS_KEY))||[]}catch{return[]} }
function saveCart(){ localStorage.setItem(LS_KEY, JSON.stringify(cart)); }
function cartQty(){ return cart.reduce((s,i)=>s+i.qty,0); }
function cartTotal(){ return cart.reduce((s,i)=>s+i.qty * (PRODUCTS.find(p=>p.id===i.id)?.price||0),0); }

function addToCart(id){
  const found = cart.find(i=>i.id===id);
  if(found){found.qty++} else {cart.push({id,qty:1})}
  saveCart(); updateCartUI(); openCart();
}
function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart(); updateCartUI();
}
function changeQty(id,delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty<=0) removeFromCart(id);
  saveCart(); updateCartUI();
}

function updateCartUI(){
  cartCount.textContent = String(cartQty());
  cartList.innerHTML = "";
  const frag = document.createDocumentFragment();
  cart.forEach(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${p.img}" alt="" width="64" height="42" style="border-radius:.5rem;object-fit:cover">
      <div>
        <div><strong>${p.name}</strong></div>
        <div class="muted">₹${p.price.toLocaleString()} • ⭐ ${p.rating.toFixed(1)}</div>
      </div>
      <div class="qty">
        <button class="icon-btn" aria-label="Decrease">−</button>
        <span aria-live="polite">${i.qty}</span>
        <button class="icon-btn" aria-label="Increase">+</button>
        <button class="icon-btn" aria-label="Remove">🗑</button>
      </div>`;
    const [dec,inc,del] = li.querySelectorAll("button");
    dec.addEventListener("click", ()=>changeQty(i.id,-1));
    inc.addEventListener("click", ()=>changeQty(i.id, 1));
    del.addEventListener("click", ()=>removeFromCart(i.id));
    frag.appendChild(li);
  });
  cartList.appendChild(frag);
  totalEl.textContent = cartTotal().toLocaleString();
}
updateCartUI();

/* ---------- Drawer ---------- */
function openCart(){
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden","false");
  overlay.hidden = false;
}
function closeDrawer(){
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden","true");
  overlay.hidden = true;
}
cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
checkoutBtn.addEventListener("click", ()=>{
  if(!cart.length) return alert("Your cart is empty.");
  alert("This is a demo. In a real app you'd collect payment details now.");
});

/* ---------- Small Progressive Enhancement: reduce motion ---------- */
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}
