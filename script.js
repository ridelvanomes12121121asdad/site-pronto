document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO PRELOADER ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('preloader-hidden');
            }, 1000);
        });
    }

    // --- FUNÇÃO PARA INICIALIZAR ÍCONES ---
    const initFeatherIcons = () => {
        try { feather.replace(); } catch (e) { console.error(e); }
    };

    // --- ELEMENTOS DO DOM ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const closeNavMenuBtn = document.querySelector('.nav-menu__close');
    const navLinks = document.querySelectorAll('.nav__link');
    const cartIcon = document.querySelector('.cart-icon');
    const cartDrawer = document.querySelector('.cart-drawer');
    const closeCartBtn = document.querySelector('.cart-drawer__close');
    const overlay = document.querySelector('.overlay');

    // --- ESTADO DO CARRINHO ---
    let cart = [];

    // --- FUNÇÕES DE CONTROLE DOS PAINÉIS LATERAIS ---
    const closeAllPanels = () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (cartDrawer) cartDrawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    };
    const toggleNavMenu = () => {
        const isOpen = navMenu.classList.contains('active');
        closeAllPanels();
        if (!isOpen) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            overlay.classList.add('active');
        }
    };
    const toggleCartDrawer = () => {
        const isOpen = cartDrawer.classList.contains('active');
        closeAllPanels();
        if (!isOpen) {
            cartDrawer.classList.add('active');
            overlay.classList.add('active');
        }
    };

    // --- EVENT LISTENERS DOS PAINÉIS LATERAIS ---
    if (hamburger) hamburger.addEventListener('click', toggleNavMenu);
    if (closeNavMenuBtn) closeNavMenuBtn.addEventListener('click', closeAllPanels);
    if (cartIcon) cartIcon.addEventListener('click', toggleCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeAllPanels);
    if (overlay) overlay.addEventListener('click', closeAllPanels);
    navLinks.forEach(link => link.addEventListener('click', closeAllPanels));

    // --- LÓGICA DO CARRINHO DE COMPRAS ---
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartCounterEl = document.querySelector('.cart__counter');

    const renderCart = () => {
        if (!cartItemsList || !cartTotalPriceEl || !cartCounterEl) return;
        cartItemsList.innerHTML = ''; 
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li class="cart-empty-message">Seu carrinho está vazio.</li>';
        } else {
            cart.forEach(item => {
                const itemTotalPrice = (item.price * item.quantity).toFixed(2).replace('.', ',');
                const cartItemHTML = `<li class="cart-item" data-id="${item.id}"><img src="${item.image}" alt="${item.name}" class="cart-item__image"><div class="cart-item__details"><p class="cart-item__name">${item.name}</p><p class="cart-item__price">Qtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.',',')}</p><p class="cart-item__quantity">Subtotal: R$ ${itemTotalPrice}</p></div><button class="cart-item__remove" aria-label="Remover item do carrinho"><i data-feather="trash-2"></i></button></li>`;
                cartItemsList.insertAdjacentHTML('beforeend', cartItemHTML);
            });
        }
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotalPriceEl.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounterEl.textContent = totalItems;
        if (totalItems > 0) {
            cartCounterEl.classList.add('active', 'pop');
            cartCounterEl.addEventListener('animationend', () => cartCounterEl.classList.remove('pop'), { once: true });
        } else {
            cartCounterEl.classList.remove('active');
        }
        initFeatherIcons(); 
    };

    const flyToCartAnimation = (startElement) => {
        const flyingImg = startElement.cloneNode(true);
        const startRect = startElement.getBoundingClientRect();
        const endRect = cartIcon.getBoundingClientRect();
        flyingImg.classList.add('flying-product');
        document.body.appendChild(flyingImg);
        flyingImg.style.left = `${startRect.left}px`;
        flyingImg.style.top = `${startRect.top}px`;
        flyingImg.style.width = `${startRect.width}px`;
        flyingImg.style.height = `${startRect.height}px`;
        requestAnimationFrame(() => {
            flyingImg.style.left = `${endRect.left + (endRect.width / 2)}px`;
            flyingImg.style.top = `${endRect.top + (endRect.height / 2)}px`;
            flyingImg.style.width = '20px';
            flyingImg.style.height = '20px';
            flyingImg.style.opacity = '0';
        });
        setTimeout(() => {
            flyingImg.remove();
        }, 600);
    };

    const addToCart = () => {
        const productDetails = document.querySelector('.product__details');
        const mainProductImage = document.getElementById('main-product-image');
        if (!productDetails || !mainProductImage) return;
        flyToCartAnimation(mainProductImage);
        const id = productDetails.dataset.productId;
        const name = productDetails.dataset.productName;
        const price = parseFloat(productDetails.dataset.productPrice);
        const image = productDetails.dataset.productImage;
        const quantity = parseInt(document.getElementById('quantity').value);
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id, name, price, image, quantity });
        }
        setTimeout(() => {
            renderCart();
            toggleCartDrawer();
        }, 400);
    };

    const buyNow = () => {
        const productDetails = document.querySelector('.product__details');
        if (!productDetails) return;
        const itemParaComprar = {
            name: productDetails.dataset.productName,
            price: parseFloat(productDetails.dataset.productPrice),
            image: productDetails.dataset.productImage,
            quantity: parseInt(document.getElementById('quantity').value)
        };
        sessionStorage.setItem('itemParaComprar', JSON.stringify(itemParaComprar));
        sessionStorage.removeItem('cartParaComprar');
        window.location.href = 'pagamento.html';
    };
    
    const cartCheckout = (event) => {
        event.preventDefault(); 
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        sessionStorage.setItem('cartParaComprar', JSON.stringify(cart));
        sessionStorage.removeItem('itemParaComprar');
        window.location.href = 'pagamento.html';
    };

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

    if (addToCartBtn) addToCartBtn.addEventListener('click', addToCart);
    if (buyNowBtn) buyNowBtn.addEventListener('click', buyNow);
    if (cartCheckoutBtn) cartCheckoutBtn.addEventListener('click', cartCheckout);

    if (cartItemsList) {
        cartItemsList.addEventListener('click', (e) => {
            const removeButton = e.target.closest('.cart-item__remove');
            if (removeButton) {
                const cartItem = removeButton.closest('.cart-item');
                const idToRemove = cartItem.dataset.id;
                cart = cart.filter(item => item.id !== idToRemove);
                renderCart();
            }
        });
    }

    // --- LÓGICA DA GALERIA DE IMAGENS ---
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevImageBtn = document.getElementById('prev-image-btn');
    const nextImageBtn = document.getElementById('next-image-btn');
    let currentImageIndex = 0;

    const updateGallery = (index) => {
        if (index < 0 || index >= thumbnails.length) return;
        currentImageIndex = index;
        mainImage.src = thumbnails[currentImageIndex].src;
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnails[currentImageIndex].classList.add('active');
        if (prevImageBtn) prevImageBtn.classList.toggle('disabled', currentImageIndex === 0);
        if (nextImageBtn) nextImageBtn.classList.toggle('disabled', currentImageIndex === thumbnails.length - 1);
    };

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateGallery(index));
        });
        if (prevImageBtn) prevImageBtn.addEventListener('click', () => updateGallery(currentImageIndex - 1));
        if (nextImageBtn) nextImageBtn.addEventListener('click', () => updateGallery(currentImageIndex + 1));
        updateGallery(0);
    }

    // --- LÓGICA DO SELETOR DE QUANTIDADE ---
    const decreaseQtyBtn = document.getElementById('decrease-qty');
    const increaseQtyBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity');
    if (decreaseQtyBtn && increaseQtyBtn && quantityInput) {
        decreaseQtyBtn.addEventListener('click', () => { 
            let currentQty = parseInt(quantityInput.value);
            if (currentQty > 1) { quantityInput.value = currentQty - 1; }
        });
        increaseQtyBtn.addEventListener('click', () => { 
            let currentQty = parseInt(quantityInput.value);
            quantityInput.value = currentQty + 1;
        });
    }

    // --- LÓGICA DO VÍDEO INTERATIVO ---
    const video = document.getElementById('product-video');
    const videoIcon = document.getElementById('video-icon');
    if (video && videoIcon) {
        video.addEventListener('click', () => {
            if (video.paused) { video.play(); } else { video.pause(); }
        });
        video.addEventListener('play', () => {
            videoIcon.setAttribute('data-feather', 'pause');
            initFeatherIcons();
        });
        video.addEventListener('pause', () => {
            videoIcon.setAttribute('data-feather', 'play');
            initFeatherIcons();
        });
    }

    // --- INICIALIZAÇÃO GERAL ---
    initFeatherIcons();
});