document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('menuOverlay');
    const howItWorksLink = document.getElementById('howItWorksLink');
    const howItWorksModal = document.getElementById('howItWorksModal');
    const modalClose = document.getElementById('modalClose');
    const shareAppLink = document.getElementById('shareAppLink');

    function openMenu() {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('show');
    }

    function closeMenu() {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('show');
    }

    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    howItWorksLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
        howItWorksModal.classList.add('show');
    });

    modalClose.addEventListener('click', () => {
        howItWorksModal.classList.remove('show');
    });

    howItWorksModal.addEventListener('click', (e) => {
        if (e.target === howItWorksModal) howItWorksModal.classList.remove('show');
    });

    shareAppLink.addEventListener('click', (e) => {
        e.preventDefault();
        const url = window.location.origin;
        const message = `Check out this site for free food (Annadanam) events happening in our village: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        closeMenu();
    });
});