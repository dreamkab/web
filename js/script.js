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
        gsap.to(burgerNav, { x: 110, duration: 0.5 });
    }
});