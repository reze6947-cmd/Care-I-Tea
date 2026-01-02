const products = [
    { id: 1, name: "Earl Grey", price: 299, img: "https://cdn.ready-market.com.tw/7afaaa6a/Templates/pic/Earl-Grey-Flavor-Milk-Tea-Powder-02.jpg?v=bb470306", desc: "40 grams · Bergamot-infused tea powder with mild caffeine content; smooth, non-bitter formulation.", ingredients: "Earl Grey Tea Leaves • Stevia • Ascorbic Acid • Maltodextrin", benefits: "Provides an energizing effect, improves mental focus and alertness, and delivers antioxidants that support overall wellness." },
    { id: 2, name: "Green Tea", price: 299, img: "https://i.ebayimg.com/images/g/JewAAOSwwblj7aP9/s-l1200.jpg", desc: "40 grams · Finely processed powdered green tea rich in antioxidants; lightly sweetened with stevia.", ingredients: "Green Tea Leaves • Stevia • Ascorbic Acid • Maltodextrin", benefits: "Supports weight management, boosts metabolism, enhances brain function, and helps reduce the risk of heart disease." },
    { id: 3, name: "Blue Ternate", price: 349, img: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/5f0688a1-0d55-4961-9bdf-5eb26ff1b8c9.__CR0,0,2500,1875_PT0_SX600_V1___.png", desc: "40 grams · Naturally vibrant blue powdered tea; caffeine-free; unique and exotic flavor.", ingredients: "Blue Ternate Tea Leaves • Stevia • Ascorbic Acid • Maltodextrin", benefits: "Rich in antioxidants that support brain health and skin vitality, promotes relaxation." },
    { id: 4, name: "Chamomile", price: 299, img: "https://celestialseasonings.com/cdn/shop/files/cel-053672-chamomile-herbal-tea-40ct_1.png?v=1731105208", desc: "40 grams · Caffeine-free powdered tea with a mild floral aroma; naturally sweetened with stevia.", ingredients: "Chamomile Tea Leaves • Stevia • Ascorbic Acid • Maltodextrin", benefits: "Promotes relaxation and stress relief, helps improve sleep quality, and soothes digestive discomfort." }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const howToUse = `
    <ol>
        <li>Prepare one cup of hot or cold water.</li>
        <li>Measure the powdered tea using a teaspoon:<br>• 2 teaspoons for a lighter taste (≈ 5 grams)<br>• 3 teaspoons for a stronger taste (≈ 8 grams)</li>
        <li>Add the powder into the cup of water.</li>
        <li>Stir well until the powder is fully dissolved.</li>
        <li>Enjoy your Care-I-Tea anytime.</li>
    </ol>
    <p>One 40-gram pack can make approximately 5 to 8 cups, depending on the amount used per serving.</p>`;

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.reduce((s,i)=>s+i.qty,0) || 0;
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty += 1;
    else cart.push({id, qty:1, ...product});
    saveCart();
    showNotification(`${product.name} added to cart!`);
    animateCartIcon();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    showNotification('Item removed from cart');
}

function updateQty(id, qty) {
    if (qty < 1) { removeFromCart(id); return; }
    const item = cart.find(i => i.id === id);
    if (item) item.qty = qty;
    saveCart();
    renderCart();
}

function showNotification(msg) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

function animateCartIcon() {
    const icon = document.querySelector('.cart-icon');
    if (icon) {
        icon.style.animation = 'bounce 0.5s ease';
        setTimeout(() => icon.style.animation = '', 500);
    }
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <p class="price">₱${p.price}</p>
                <div class="ingredients"><strong>Ingredients:</strong> ${p.ingredients}</div>
                <div class="benefits"><strong>Benefits:</strong> ${p.benefits}</div>
                <div class="how-to"><strong>How to Use:</strong>${howToUse}</div>
                <button class="cta-button add-to-cart" data-id="${p.id}" style="width:100%; margin-top:1rem;">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderCart() {
    const container = document.getElementById('cart-content');
    if (!container) return;
    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; font-size:1.4rem;">Your cart is empty. <a href="shop.html" class="cta-button" style="display:inline-block; margin-top:1rem;">Continue Shopping</a></p>';
        return;
    }
    let total = 0;
    cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${prod.img}" alt="${prod.name}">
            <div class="cart-item-info">
                <h3>${prod.name}</h3>
                <p>₱${prod.price} each</p>
                <div class="cart-actions">
                    <input type="number" value="${item.qty}" min="1" data-id="${item.id}" class="qty-input">
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </div>
                <p style="margin-top:1rem; font-weight:bold;">Subtotal: ₱${prod.price * item.qty}</p>
            </div>
        `;
        container.appendChild(div);
        total += prod.price * item.qty;
    });
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `Total: ₱${total} <button class="checkout-btn" onclick="alert('Checkout complete! (Demo - Thank you for your order)')">Proceed to Checkout</button>`;
    container.appendChild(totalDiv);

    document.querySelectorAll('.qty-input').forEach(input => {
        let timer;
        input.addEventListener('input', e => {
            clearTimeout(timer);
            timer = setTimeout(() => updateQty(parseInt(e.target.dataset.id), parseInt(e.target.value)), 500);
        });
    });
}

document.addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart')) {
        addToCart(parseInt(e.target.dataset.id));
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

saveCart();