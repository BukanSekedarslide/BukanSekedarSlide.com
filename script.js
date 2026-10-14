// --- FITUR LOADING SCREEN (PRELOADER) ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Delay 0.8 detik agar animasi logonya sempat terlihat estetik
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 800); 
    }
});
// Mengambil data keranjang dari penyimpanan lokal (browser)
let cart = JSON.parse(localStorage.getItem('bss_cart')) || [];

// Deklarasi Elemen DOM
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const cartToggleBtn = document.getElementById('cart-toggle');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// --- SISTEM TOAST NOTIFICATION (Pengganti Alert) ---
function showToast(message, color = "#ef4444") {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast-notification";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.backgroundColor = color;
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// --- FITUR DARK MODE ---
const currentTheme = localStorage.getItem('bss_theme') || 'dark'; 
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if(themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        let theme = body.getAttribute('data-theme');
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('bss_theme', 'light');
            updateThemeIcon('light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('bss_theme', 'dark');
            updateThemeIcon('dark');
        }
    });
}

function updateThemeIcon(theme) {
    if(!themeToggleBtn) return;
    if (theme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// --- FITUR FORMAT UANG RUPIAH ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// --- FITUR KALKULATOR KERANJANG ---
function updateCart() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; padding:20px; opacity:0.7;">Keranjang Anda masih kosong.</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div>
                    <h4 style="margin-bottom:5px;">${item.name}</h4>
                    <small>${formatRupiah(item.price)}</small>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span style="font-weight:bold; min-width:20px; text-align:center;">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    if (cartTotalElement) cartTotalElement.innerText = formatRupiah(total);
    if (cartCountElement) cartCountElement.innerText = count;

    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => changeQty(e.target.dataset.id, 1));
    });
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => changeQty(e.target.dataset.id, -1));
    });

    localStorage.setItem('bss_cart', JSON.stringify(cart));
}

function changeQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCart();
    }
}

// --- EVENT DELEGATION (Menangani Semua Klik Dinamis) ---
document.addEventListener('click', (e) => {
    
    // 1. Fitur Tambah ke Keranjang
    if (e.target.classList.contains('add-to-cart')) {
        const button = e.target;
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        updateCart();
        
        showToast("✓ Berhasil ditambahkan ke keranjang!", "#25d366");
        
        const originalText = button.innerText;
        button.innerText = "✓ Dimasukkan";
        button.style.backgroundColor = "#25d366";
        button.style.color = "white";
        
        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = "";
            button.style.color = "";
        }, 1500);
    }

    // 2. Fitur Kosongkan Keranjang (Telah Diperbaiki)
    const clearBtn = e.target.closest('#clear-cart-btn');
    if (clearBtn) {
        if (cart.length > 0) {
            cart = []; 
            updateCart(); 
            showToast("Keranjang berhasil dikosongkan!", "#3b82f6");
        } else {
            showToast("Keranjang sudah kosong.", "#f97316"); 
        }
    }
});

// Modal Keranjang
if (cartToggleBtn && cartModal) {
    cartToggleBtn.addEventListener('click', () => { cartModal.style.display = 'block'; });
    closeBtn.addEventListener('click', () => { cartModal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target == cartModal) cartModal.style.display = 'none'; });
}

// Fitur Checkout WA
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("Keranjang Anda masih kosong!");
            return;
        }
        
        let text = "Halo Admin *BukanSekedarSlide*, saya ingin memesan layanan berikut:\n\n";
        let total = 0;
        
        cart.forEach(item => {
            text += `▪️ ${item.name} (${item.quantity}x) : ${formatRupiah(item.price * item.quantity)}\n`;
            total += item.price * item.quantity;
        });
        
        text += `\n*Total Pembayaran : ${formatRupiah(total)}*\n\nMohon informasi pembayarannya, terima kasih.`;
        
        const adminPhone = "6285700216371"; 
        const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
    });
}

// --- FITUR SEARCH & FILTER (Template Vault) ---
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.item-card');
const noResultMsg = document.getElementById('no-result');
let currentCategory = 'all';

function filterProducts() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    let visibleCount = 0;

    productCards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name.toLowerCase();
        const matchesCategory = (currentCategory === 'all' || category === currentCategory);
        const matchesSearch = name.includes(query);

        if (matchesCategory && matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (noResultMsg) {
        noResultMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
}

if (searchInput) searchInput.addEventListener('input', filterProducts);
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.filter;
        filterProducts();
    });
});

// --- FITUR ACCORDION FAQ (Cara Order) ---
const acc = document.getElementsByClassName("accordion-btn");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    const icon = this.querySelector("i");
    if(this.classList.contains("active")){
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
    } else {
        icon.classList.remove("fa-minus");
        icon.classList.add("fa-plus");
    }
    
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

// --- FITUR MODAL PREVIEW DETAIL TEMPLATE ---
const previewBtns = document.querySelectorAll('.preview-btn');
const previewModal = document.getElementById('preview-modal');
const closePreviewBtn = document.querySelector('.close-preview-btn');

if(previewBtns && previewModal) {
    previewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.item-card');
            const title = card.dataset.name;
            const desc = card.querySelector('p').innerText;
            
            document.getElementById('preview-title').innerText = title;
            document.getElementById('preview-desc').innerText = desc;
            
            previewModal.style.display = 'block';
        });
    });

    closePreviewBtn.addEventListener('click', () => {
        previewModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == previewModal) {
            previewModal.style.display = 'none';
        }
    });
}

// Render cart saat dimuat
updateCart();