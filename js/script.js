document.addEventListener('click', (e) => {
    const burgerMenu = document.querySelector('.blue-button');
    const burgerToggle = document.getElementById('burger-toggle');
    
    // Если клик вне меню и бургер открыт — закрываем
    if (!burgerMenu.contains(e.target) && burgerToggle.checked) {
        burgerToggle.checked = false;
    }
});

const burgerToggle = document.getElementById('burger-toggle');
const burgerNav = document.querySelector('.burger-nav');

burgerToggle.addEventListener('change', () => {
    if (burgerToggle.checked) {
        gsap.to(burgerNav, { x: -50, duration: 0.5 });
    } else {
        gsap.to(burgerNav, { x: 60, duration: 0.5 });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const burgerToggle = document.getElementById('burger-toggle');
    const navLinks = document.querySelectorAll('.burger-nav a');
    
    // Закрываем меню и плавно скроллим к секции
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Закрываем меню
            burgerToggle.checked = false;
            
            // Получаем id целевой секции
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Плавная прокрутка
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Элементы переключения между формами
    const physicalDeliveryBtn = document.getElementById('physicalDeliveryBtn');
    const accountDeliveryBtn = document.getElementById('accountDeliveryBtn');
    const physicalDeliveryForm = document.getElementById('physicalDeliveryForm');
    const accountDeliveryForm = document.getElementById('accountDeliveryForm');
    
    // Формы и кнопки
    const successMessage = document.getElementById('successMessage');
    const successDetails = document.getElementById('successDetails');
    const newOrderBtn = document.getElementById('newOrderBtn');
    
    // Переключение между формами
    physicalDeliveryBtn.addEventListener('click', function() {
        physicalDeliveryBtn.classList.add('active');
        accountDeliveryBtn.classList.remove('active');
        physicalDeliveryForm.classList.remove('hidden');
        accountDeliveryForm.classList.add('hidden');
    });
    
    accountDeliveryBtn.addEventListener('click', function() {
        accountDeliveryBtn.classList.add('active');
        physicalDeliveryBtn.classList.remove('active');
        accountDeliveryForm.classList.remove('hidden');
        physicalDeliveryForm.classList.add('hidden');
    });
    
    // Обработка формы физической доставки
    physicalDeliveryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validatePhysicalForm()) {
            const formData = new FormData(physicalDeliveryForm);
            const formDataObj = {};
            formData.forEach((value, key) => formDataObj[key] = value);
            
            // Формируем сообщение об успехе
            successDetails.innerHTML = `
                Ваш заказ будет доставлен по адресу:<br>
                <strong>${formDataObj.address}</strong><br>
                в дату: <strong>${formDataObj.deliveryDate}</strong><br><br>
                Наш менеджер свяжется с вами для подтверждения.
            `;
            
            showSuccessMessage();
        }
    });
    
    // Обработка формы доставки на аккаунт
    accountDeliveryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateAccountForm()) {
            const formData = new FormData(accountDeliveryForm);
            const formDataObj = {};
            formData.forEach((value, key) => formDataObj[key] = value);
            
            // Формируем сообщение об успехе
            successDetails.innerHTML = `
                Игра <strong>${formDataObj.gameName}</strong> ${formDataObj.gameEdition ? `(${formDataObj.gameEdition})` : ''}<br>
                будет доставлена на ваш ${formDataObj.gamePlatform} аккаунт:<br>
                <strong>${formDataObj.gameAccountId}</strong><br><br>
                Ключ активации будет отправлен на email: <strong>${formDataObj.gameAccountEmail}</strong>
            `;
            
            showSuccessMessage();
        }
    });
    
    // Кнопка "Новый заказ"
    newOrderBtn.addEventListener('click', function() {
        successMessage.classList.add('hidden');
        physicalDeliveryForm.classList.remove('hidden');
        physicalDeliveryForm.reset();
        accountDeliveryForm.reset();
        physicalDeliveryBtn.click(); // Переключаем обратно на первую форму
    });
    
    // Валидация телефона (для физической доставки)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9+]/g, '');
        });
    }
    
    // Установка минимальной даты доставки (сегодня + 1 день)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const deliveryDate = document.getElementById('deliveryDate');
    if (deliveryDate) {
        deliveryDate.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Функция валидации формы физической доставки
    function validatePhysicalForm() {
        let isValid = true;
        const requiredFields = physicalDeliveryForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.classList.remove('error');
            const errorMessage = field.nextElementSibling;
            
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
            
            if (!field.value.trim()) {
                field.classList.add('error');
                showError(field, 'Это поле обязательно для заполнения');
                isValid = false;
            }
        });
        
        // Валидация email
        const email = document.getElementById('email');
        if (email.value && !isValidEmail(email.value)) {
            email.classList.add('error');
            showError(email, 'Введите корректный email');
            isValid = false;
        }
        
        // Валидация телефона
        if (phoneInput.value.length < 10) {
            phoneInput.classList.add('error');
            showError(phoneInput, 'Телефон должен содержать минимум 10 цифр');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Функция валидации формы доставки на аккаунт
    function validateAccountForm() {
        let isValid = true;
        const requiredFields = accountDeliveryForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.classList.remove('error');
            const errorMessage = field.nextElementSibling;
            
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
            
            if (!field.value.trim()) {
                field.classList.add('error');
                showError(field, 'Это поле обязательно для заполнения');
                isValid = false;
            }
        });
        
        // Валидация email аккаунта
        const gameAccountEmail = document.getElementById('gameAccountEmail');
        if (!isValidEmail(gameAccountEmail.value)) {
            gameAccountEmail.classList.add('error');
            showError(gameAccountEmail, 'Введите корректный email');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Показать сообщение об ошибке
    function showError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.after(errorElement);
    }
    
    // Проверка валидности email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Показать сообщение об успехе
    function showSuccessMessage() {
        physicalDeliveryForm.classList.add('hidden');
        accountDeliveryForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const addButtons = document.querySelectorAll('.item-container .add');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Функция для сохранения корзины в localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Обработчики для кнопок "в корзину"
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemContainer = this.closest('.item-container');
            const name = itemContainer.querySelector('.product p:first-child').textContent.trim();
            const priceText = itemContainer.querySelector('.product p:nth-child(2)').textContent.trim();
            // Удаляем все символы, кроме цифр и точки
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            const description = itemContainer.querySelector('.description').textContent.trim();
            const imageSrc = itemContainer.querySelector('img').src;
            
            // Проверяем, есть ли уже такой товар в корзине
            const existingItemIndex = cart.findIndex(item => item.name === name);
            
            if (existingItemIndex !== -1) {
                // Если товар уже есть - увеличиваем количество
                cart[existingItemIndex].quantity += 1;
            } else {
                // Если товара нет - добавляем новый
                cart.push({
                    name,
                    price,
                    quantity: 1,
                    description,
                    imageSrc
                });
            }
            
            // Сохраняем корзину
            saveCart();
            
            // Обновляем отображение корзины
            updateCart();
            
            // Анимация добавления
            this.classList.add('added');
            const originalText = this.textContent;
            this.textContent = '✓ Добавлено';
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('added');
            }, 1000);
        });
    });
    
    // Обновление отображения корзины
    function updateCart() {
        // Очищаем корзину
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
            cartTotal.textContent = '0 ₽';
            return;
        }
        
        let total = 0;
        
        // Добавляем каждый товар в корзину
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.imageSrc}" alt="${item.name}">
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
        
        // Обновляем итоговую сумму
        cartTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
        
        // Добавляем обработчики событий для новых кнопок
        addCartEventListeners();
    }
    
    // Добавление обработчиков событий для кнопок в корзине
    function addCartEventListeners() {
        // Удаление товара
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                saveCart();
                updateCart();
            });
        });
        
        // Уменьшение количества
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    saveCart();
                    updateCart();
                }
            });
        });
        
        // Увеличение количества
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                saveCart();
                updateCart();
            });
        });
    }
    
    // Инициализация корзины при загрузке страницы
    updateCart();
});