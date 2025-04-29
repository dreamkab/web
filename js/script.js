// Общие утилиты
const Utils = {
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    showError: (field, message) => {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.after(errorElement);
    },
    clearErrors: (form) => {
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.error-message').forEach(el => el.remove());
    }
};

// Бургер-меню
const BurgerMenu = (() => {
    const burgerToggle = document.getElementById('burger-toggle');
    const burgerNav = document.querySelector('.burger-nav');
    const burgerMenu = document.querySelector('.blue-button');
    const navLinks = document.querySelectorAll('.burger-nav a');

    const init = () => {
        document.addEventListener('click', (e) => {
            if (!burgerMenu.contains(e.target) && burgerToggle.checked) {
                burgerToggle.checked = false;
            }
        });

        burgerToggle.addEventListener('change', () => {
            gsap.to(burgerNav, { x: burgerToggle.checked ? -50 : 60, duration: 0.5 });
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                burgerToggle.checked = false;
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    };

    return { init };
})();

// Формы заказа
const OrderForms = (() => {
    const physicalDeliveryBtn = document.getElementById('physicalDeliveryBtn');
    const accountDeliveryBtn = document.getElementById('accountDeliveryBtn');
    const physicalDeliveryForm = document.getElementById('physicalDeliveryForm');
    const accountDeliveryForm = document.getElementById('accountDeliveryForm');
    const successMessage = document.getElementById('successMessage');
    const successDetails = document.getElementById('successDetails');
    const newOrderBtn = document.getElementById('newOrderBtn');
    const phoneInput = document.getElementById('phone');
    const deliveryDate = document.getElementById('deliveryDate');

    const setupDateRestriction = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (deliveryDate) deliveryDate.min = tomorrow.toISOString().split('T')[0];
    };

    const validatePhysicalForm = () => {
        Utils.clearErrors(physicalDeliveryForm);
        let isValid = true;
        const requiredFields = physicalDeliveryForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                Utils.showError(field, 'Это поле обязательно для заполнения');
                isValid = false;
            }
        });

        const email = document.getElementById('email');
        if (email.value && !Utils.isValidEmail(email.value)) {
            Utils.showError(email, 'Введите корректный email');
            isValid = false;
        }

        if (phoneInput && phoneInput.value.length < 10) {
            Utils.showError(phoneInput, 'Телефон должен содержать минимум 10 цифр');
            isValid = false;
        }

        return isValid;
    };

    const validateAccountForm = () => {
        Utils.clearErrors(accountDeliveryForm);
        let isValid = true;
        const requiredFields = accountDeliveryForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                Utils.showError(field, 'Это поле обязательно для заполнения');
                isValid = false;
            }
        });

        const gameAccountEmail = document.getElementById('gameAccountEmail');
        if (!Utils.isValidEmail(gameAccountEmail.value)) {
            Utils.showError(gameAccountEmail, 'Введите корректный email');
            isValid = false;
        }

        return isValid;
    };

    const showSuccessMessage = (message) => {
        successDetails.innerHTML = message;
        physicalDeliveryForm.classList.add('hidden');
        accountDeliveryForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
        Cart.clear();
    };

    const init = () => {
        setupDateRestriction();

        physicalDeliveryBtn.addEventListener('click', () => {
            physicalDeliveryBtn.classList.add('active');
            accountDeliveryBtn.classList.remove('active');
            physicalDeliveryForm.classList.remove('hidden');
            accountDeliveryForm.classList.add('hidden');
        });

        accountDeliveryBtn.addEventListener('click', () => {
            accountDeliveryBtn.classList.add('active');
            physicalDeliveryBtn.classList.remove('active');
            accountDeliveryForm.classList.remove('hidden');
            physicalDeliveryForm.classList.add('hidden');
        });

        physicalDeliveryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validatePhysicalForm()) {
                const formData = new FormData(physicalDeliveryForm);
                const formDataObj = Object.fromEntries(formData);
                
                const message = `
                    Ваш заказ будет доставлен по адресу:<br>
                    <strong>${formDataObj.address}</strong><br>
                    в дату: <strong>${formDataObj.deliveryDate}</strong><br><br>
                    Наш менеджер свяжется с вами для подтверждения.
                `;
                showSuccessMessage(message);
            }
        });

        accountDeliveryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateAccountForm()) {
                const formData = new FormData(accountDeliveryForm);
                const formDataObj = Object.fromEntries(formData);
                
                const message = `
                    Игра <strong>${formDataObj.gameName}</strong> ${formDataObj.gameEdition ? `(${formDataObj.gameEdition})` : ''}<br>
                    будет доставлена на ваш ${formDataObj.gamePlatform} аккаунт:<br>
                    <strong>${formDataObj.gameAccountId}</strong><br><br>
                    Ключ активации будет отправлен на email: <strong>${formDataObj.gameAccountEmail}</strong>
                `;
                showSuccessMessage(message);
            }
        });

        newOrderBtn.addEventListener('click', () => {
            successMessage.classList.add('hidden');
            physicalDeliveryForm.reset();
            accountDeliveryForm.reset();
            physicalDeliveryBtn.click();
        });

        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9+]/g, '');
            });
        }
    };

    return { init };
})();

// Корзина
const Cart = (() => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartContainer = document.getElementById('cartContainer');
    const addButtons = document.querySelectorAll('.item-container .add');

    const save = () => localStorage.setItem('cart', JSON.stringify(cart));

    const add = (product) => {
        const existingItem = cart.find(item => item.name === product.name);
        existingItem ? existingItem.quantity += product.quantity || 1 : cart.push({
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
            description: product.description,
            imageSrc: product.imageSrc
        });
        save();
        update();
    };

    const clear = () => {
        cart = [];
        save();
        update();
        cartContainer?.classList.add('hidden');
    };

    const update = () => {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
            cartTotal.textContent = '0 ₽';
            cartContainer?.classList.add('hidden');
            return;
        }
        
        cartContainer?.classList.remove('hidden');
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                ${item.imageSrc ? `<img src="${item.imageSrc}" alt="${item.name}">` : ''}
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('ru-RU')} ₽ x ${item.quantity}</div>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-index="${index}">−</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="cart-item-total">${itemTotal.toLocaleString('ru-RU')} ₽</div>
                <button class="cart-item-remove" data-index="${index}">×</button>
            `;
            cartItems.appendChild(itemElement);
        });
        
        cartTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
        addEventListeners();
    };

    const addEventListeners = () => {
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                cart.splice(parseInt(btn.dataset.index), 1);
                save();
                update();
            });
        });

        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    save();
                    update();
                }
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                cart[index].quantity++;
                save();
                update();
            });
        });
    };

    const init = () => {
        addButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemContainer = this.closest('.item-container');
                const name = itemContainer.querySelector('.product p:first-child').textContent.trim();
                const price = parseFloat(itemContainer.querySelector('.product p:nth-child(2)').textContent.replace(/[^\d.]/g, ''));
                const description = itemContainer.querySelector('.description').textContent.trim();
                const imageSrc = itemContainer.querySelector('img').src;
                
                add({ name, price, description, imageSrc });
                
                this.classList.add('added');
                const originalText = this.textContent;
                this.textContent = '✓ Добавлено';
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('added');
                }, 1000);
            });
        });

        update();
    };

    return { init, clear };
})();

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    BurgerMenu.init();
    OrderForms.init();
    Cart.init();
});

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.shop-slider');
    const slides = document.querySelectorAll('.slider-page');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Обновляем активные точки
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Переход к следующему слайду
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });
    
    // Переход к предыдущему слайду
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
    
    // Переход по клику на точки
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
});