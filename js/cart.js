// Lưu trữ giỏ hàng trong localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(gameId, gameName, price, originalPrice, image) {
    const existingItem = cart.find(item => item.id === gameId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: gameId,
            name: gameName,
            price: price,
            originalPrice: originalPrice,
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddToCartSuccess();
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

// Cập nhật số lượng sản phẩm
function updateQuantity(gameId, newQuantity) {
    const item = cart.find(item => item.id === gameId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Hiển thị thông báo thêm vào giỏ hàng thành công
function showAddToCartSuccess() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Đã thêm vào giỏ hàng!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Hiển thị thông báo thanh toán thành công
function showCheckoutSuccess() {
    const notification = document.createElement('div');
    notification.className = 'checkout-notification';
    notification.innerHTML = `
        <div class="checkout-content">
            <i class="fas fa-check-circle"></i>
            <p>Thanh toán thành công!</p>
            <p>Vui lòng tới "Lịch sử giao dịch" để tiếp tục</p>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
        // Xóa giỏ hàng sau khi thanh toán thành công
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }, 3000);
}

// Cập nhật hiển thị giỏ hàng
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const summaryItems = document.querySelector('.cart-summary');
    
    if (!cartItems || !summaryItems) return;

    // Cập nhật danh sách sản phẩm
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="price-container">
                    <span class="original-price">${item.originalPrice}đ</span>
                    <span class="price">${item.price}đ</span>
                    <span class="discount">-${Math.round((1 - item.price/item.originalPrice) * 100)}%</span>
                </div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" 
                    onchange="updateQuantity(${item.id}, this.value)">
                <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Cập nhật tổng tiền
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = cart.reduce((sum, item) => 
        sum + ((item.originalPrice - item.price) * item.quantity), 0);

    summaryItems.innerHTML = `
        <div class="summary-item">
            <span>Tạm tính:</span>
            <span>${subtotal.toLocaleString()}đ</span>
        </div>
        <div class="summary-item">
            <span>Giảm giá:</span>
            <span>-${totalDiscount.toLocaleString()}đ</span>
        </div>
        <div class="summary-item total">
            <span>Tổng cộng:</span>
            <span>${subtotal.toLocaleString()}đ</span>
        </div>
        <button class="checkout-btn" onclick="showCheckoutSuccess()">Thanh toán</button>
    `;
}

// Thêm style cho thông báo
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .checkout-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #4CAF50;
        color: white;
        padding: 30px;
        border-radius: 10px;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
        text-align: center;
    }

    .checkout-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .checkout-content i {
        font-size: 3rem;
    }

    .checkout-content p {
        margin: 0;
        font-size: 1.2rem;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Khởi tạo giỏ hàng khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
}); 