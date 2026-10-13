const PRODUCTS = [
  {
    id: 1, name: "Aero Wireless Headphones", category: "Tech", price: 129, oldPrice: 159, rating: 4.8,
    sale: true, badge: "BEST SELLER", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    description: "Immersive wireless headphones with balanced sound, soft ear cushions and all-day battery life."
  },
  {
    id: 2, name: "Minimal Ceramic Mug", category: "Home", price: 24, oldPrice: 30, rating: 4.6,
    sale: true, badge: "SALE", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=85",
    description: "A clean, durable ceramic mug designed for morning coffee and slow weekends."
  },
  {
    id: 3, name: "Classic Canvas Backpack", category: "Fashion", price: 68, oldPrice: null, rating: 4.7,
    sale: false, badge: "POPULAR", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    description: "A versatile everyday backpack with a spacious interior and comfortable padded straps."
  },
  {
    id: 4, name: "Smart Fitness Watch", category: "Tech", price: 189, oldPrice: 229, rating: 4.9,
    sale: true, badge: "TOP RATED", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=85",
    description: "Track workouts, sleep and daily activity with a bright display and smart notifications."
  },
  {
    id: 5, name: "Everyday Running Shoes", category: "Fashion", price: 96, oldPrice: 120, rating: 4.5,
    sale: true, badge: "20% OFF", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    description: "Lightweight running shoes with responsive cushioning for everyday movement."
  },
  {
    id: 6, name: "Modern Desk Lamp", category: "Home", price: 54, oldPrice: null, rating: 4.4,
    sale: false, badge: "NEW", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    description: "A warm, adjustable desk lamp that brings focused light and a refined look to your workspace."
  },
  {
    id: 7, name: "Portable Bluetooth Speaker", category: "Tech", price: 79, oldPrice: 99, rating: 4.7,
    sale: true, badge: "DEAL", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",
    description: "Compact portable speaker with rich sound, simple controls and a travel-friendly design."
  },
  {
    id: 8, name: "Leather Card Wallet", category: "Accessories", price: 42, oldPrice: null, rating: 4.6,
    sale: false, badge: "ESSENTIAL", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
    description: "Slim genuine-leather wallet with dedicated card slots for an uncluttered everyday carry."
  },
  {
    id: 9, name: "Linen Everyday Tote", category: "Accessories", price: 38, oldPrice: 48, rating: 4.5,
    sale: true, badge: "SALE", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
    description: "A reusable linen tote with a roomy interior for shopping, work and daily essentials."
  }
];

const state = {
  search: "",
  category: "all",
  maxPrice: 1500,
  rating: 0,
  sort: "featured",
  saleOnly: false,
  cart: JSON.parse(localStorage.getItem("shoply-cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("shoply-wishlist") || "[]")
};

const $ = id => document.getElementById(id);
const productGrid = $("productGrid");
const categoryChips = $("categoryChips");
const cartDrawer = $("cartDrawer");
const overlay = $("overlay");
const filtersPanel = $("filtersPanel");
const modal = $("productModal");

function money(value) {
  return `$${value.toFixed(2)}`;
}

function categories() {
  return ["all", ...new Set(PRODUCTS.map(p => p.category))];
}

function renderCategories() {
  categoryChips.innerHTML = categories().map(category => `
    <button class="category-chip ${state.category === category ? "active" : ""}" data-category="${category}">
      ${category === "all" ? "All products" : category}
    </button>
  `).join("");

  $("categoryFilter").innerHTML = categories().map(category => `
    <option value="${category}">${category === "all" ? "All categories" : category}</option>
  `).join("");
  $("categoryFilter").value = state.category;
}

function getFilteredProducts() {
  let result = PRODUCTS.filter(p => {
    const matchesSearch = `${p.name} ${p.category}`.toLowerCase().includes(state.search.toLowerCase());
    const matchesCategory = state.category === "all" || p.category === state.category;
    const matchesPrice = p.price <= state.maxPrice;
    const matchesRating = p.rating >= state.rating;
    const matchesSale = !state.saleOnly || p.sale;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesSale;
  });

  if (state.sort === "price-low") result.sort((a,b) => a.price - b.price);
  if (state.sort === "price-high") result.sort((a,b) => b.price - a.price);
  if (state.sort === "rating") result.sort((a,b) => b.rating - a.rating);
  if (state.sort === "name") result.sort((a,b) => a.name.localeCompare(b.name));

  return result;
}

function renderProducts() {
  const result = getFilteredProducts();
  $("resultCount").textContent = `${result.length} product${result.length === 1 ? "" : "s"}`;
  productGrid.hidden = result.length === 0;
  $("noResults").hidden = result.length !== 0;

  productGrid.innerHTML = result.map(p => {
    const wished = state.wishlist.includes(p.id);
    return `
      <article class="product-card">
        <div class="product-image">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <span class="product-badge">${p.badge}</span>
          <button class="wish-btn ${wished ? "active" : ""}" data-wishlist="${p.id}" aria-label="Wishlist">${wished ? "♥" : "♡"}</button>
        </div>
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <h3 class="product-name">${p.name}</h3>
          <div class="rating">★★★★★ <span>${p.rating}</span></div>
          <div class="product-bottom">
            <div class="price">${money(p.price)} ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}</div>
            <button class="add-cart" data-add="${p.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
  renderActiveFilters();
}

function renderActiveFilters() {
  const labels = [];
  if (state.search) labels.push(`Search: ${state.search}`);
  if (state.category !== "all") labels.push(state.category);
  if (state.maxPrice < 1500) labels.push(`Up to $${state.maxPrice}`);
  if (state.rating) labels.push(`${state.rating}+ stars`);
  if (state.saleOnly) labels.push("Deals only");
  $("activeFilters").innerHTML = labels.map(x => `<span class="active-filter">${x}</span>`).join("");
}

function renderCart() {
  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  $("cartCount").textContent = totalQty;
  $("wishlistCount").textContent = state.wishlist.length;

  const items = state.cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return p ? `
      <div class="cart-row">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <div class="cart-price">${money(p.price * item.qty)}</div>
          <div class="qty-controls">
            <button data-qty="${p.id}" data-change="-1">−</button>
            <span>${item.qty}</span>
            <button data-qty="${p.id}" data-change="1">+</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${p.id}" aria-label="Remove">×</button>
      </div>
    ` : "";
  }).join("");

  $("cartItems").innerHTML = items;
  $("cartItems").hidden = state.cart.length === 0;
  $("emptyCart").hidden = state.cart.length !== 0;

  const subtotal = state.cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
  $("cartSubtotal").textContent = money(subtotal);
  localStorage.setItem("shoply-cart", JSON.stringify(state.cart));
  localStorage.setItem("shoply-wishlist", JSON.stringify(state.wishlist));
}

function addToCart(id) {
  const item = state.cart.find(x => x.id === id);
  if (item) item.qty++;
  else state.cart.push({ id, qty: 1 });
  renderCart();
  const product = PRODUCTS.find(p => p.id === id);
  showToast(`${product.name} added to cart`);
}

function toggleWishlist(id) {
  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter(x => x !== id);
    showToast("Removed from wishlist");
  } else {
    state.wishlist.push(id);
    showToast("Added to wishlist");
  }
  renderProducts();
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.style.overflow = "";
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  $("modalContent").innerHTML = `
    <div class="modal-product">
      <div class="modal-product-image"><img src="${p.image}" alt="${p.name}"></div>
      <div class="modal-product-info">
        <span class="section-kicker">${p.category}</span>
        <h2>${p.name}</h2>
        <div class="rating">★★★★★ <span>${p.rating} / 5</span></div>
        <p class="description">${p.description}</p>
        <div class="modal-price">${money(p.price)} ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}</div>
        <button class="modal-add" data-modal-add="${p.id}">Add to shopping cart</button>
      </div>
    </div>
  `;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function resetFilters() {
  state.search = "";
  state.category = "all";
  state.maxPrice = 1500;
  state.rating = 0;
  state.sort = "featured";
  state.saleOnly = false;
  $("searchInput").value = "";
  $("priceFilter").value = 1500;
  $("maxPriceLabel").textContent = "$1,500";
  $("ratingFilter").value = "0";
  $("sortFilter").value = "featured";
  $("saleFilter").checked = false;
  renderCategories();
  renderProducts();
}

categoryChips.addEventListener("click", e => {
  const button = e.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCategories();
  renderProducts();
});

productGrid.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  const wish = e.target.closest("[data-wishlist]");
  if (add) addToCart(Number(add.dataset.add));
  if (wish) toggleWishlist(Number(wish.dataset.wishlist));
  if (!add && !wish) {
    const card = e.target.closest(".product-card");
    if (card) {
      const image = card.querySelector("img");
      const product = PRODUCTS.find(p => p.name === image.alt);
      if (product) openProduct(product.id);
    }
  }
});

$("cartItems").addEventListener("click", e => {
  const qty = e.target.closest("[data-qty]");
  const remove = e.target.closest("[data-remove]");
  if (qty) {
    const id = Number(qty.dataset.qty);
    const change = Number(qty.dataset.change);
    const item = state.cart.find(x => x.id === id);
    if (item) {
      item.qty += change;
      if (item.qty <= 0) state.cart = state.cart.filter(x => x.id !== id);
      renderCart();
    }
  }
  if (remove) {
    state.cart = state.cart.filter(x => x.id !== Number(remove.dataset.remove));
    renderCart();
  }
});

$("searchInput").addEventListener("input", e => {
  state.search = e.target.value.trim();
  renderProducts();
});
$("categoryFilter").addEventListener("change", e => {
  state.category = e.target.value;
  renderCategories();
  renderProducts();
});
$("priceFilter").addEventListener("input", e => {
  state.maxPrice = Number(e.target.value);
  $("maxPriceLabel").textContent = `$${state.maxPrice.toLocaleString()}`;
  renderProducts();
});
$("ratingFilter").addEventListener("change", e => {
  state.rating = Number(e.target.value);
  renderProducts();
});
$("sortFilter").addEventListener("change", e => {
  state.sort = e.target.value;
  renderProducts();
});
$("saleFilter").addEventListener("change", e => {
  state.saleOnly = e.target.checked;
  renderProducts();
});
$("clearFilters").addEventListener("click", resetFilters);
$("resetSearch").addEventListener("click", resetFilters);
$("cartBtn").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
$("mobileFilterBtn").addEventListener("click", () => {
  filtersPanel.classList.add("open");
  overlay.hidden = false;
});
$("checkoutBtn").addEventListener("click", () => {
  if (!state.cart.length) return showToast("Your cart is empty");
  showToast("Demo checkout — connect a payment gateway here.");
});
$("wishlistBtn").addEventListener("click", () => {
  state.category = "all";
  state.search = "";
  renderCategories();
  renderProducts();
  document.querySelector("#products").scrollIntoView({behavior:"smooth"});
  showToast(`${state.wishlist.length} item${state.wishlist.length === 1 ? "" : "s"} in wishlist`);
});
$("modalContent").addEventListener("click", e => {
  const add = e.target.closest("[data-modal-add]");
  if (add) {
    addToCart(Number(add.dataset.modalAdd));
    closeModal();
  }
});
modal.addEventListener("click", e => {
  if (e.target.hasAttribute("data-close-modal")) closeModal();
});

document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    $("searchInput").focus();
  }
  if (e.key === "Escape") {
    closeCart();
    closeModal();
    filtersPanel.classList.remove("open");
  }
});

renderCategories();
renderProducts();
renderCart();
