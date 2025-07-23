import * as THREE from 'three';

// --- KONFIGURACJA SCENY 3D ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// ŚWIATŁO
const pointLight = new THREE.PointLight(0xffffff, 30, 100);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(pointLight, ambientLight);


// --- GŁÓWNY, CENTRALNY OBIEKT (POWRÓT DO PIERWSZEJ WERSJI) ---
const mainGeometry = new THREE.IcosahedronGeometry(1.2, 0);
const mainMaterial = new THREE.MeshStandardMaterial({
    color: 0xb43a3a, // Czerwony z palety
    wireframe: true
});
const mainShape = new THREE.Mesh(mainGeometry, mainMaterial);
scene.add(mainShape);


// --- NOWOŚĆ: FALUJĄCE TRÓJKĄTY PO BOKACH ---
const triangles = [];
const triangleCount = 6; // Stworzymy 6 trójkątów

for (let i = 0; i < triangleCount; i++) {
    // Użyjemy TetrahedronGeometry, czyli bryły w kształcie trójkątnej piramidy
    const geometry = new THREE.TetrahedronGeometry(0.5, 0);
    const material = new THREE.MeshStandardMaterial({
        color: 0xd6ae22, // Złoty kolor z palety
        wireframe: true
    });
    const triangle = new THREE.Mesh(geometry, material);

    // Pozycjonowanie trójkątów po bokach
    const isLeft = i < triangleCount / 2;
    const x = (isLeft ? -1 : 1) * THREE.MathUtils.randFloat(4, 8);
    const y = THREE.MathUtils.randFloat(-4, 4);
    const z = THREE.MathUtils.randFloat(-5, 2);
    triangle.position.set(x, y, z);
    
    // Zapisujemy dodatkowe dane do animacji falowania
    triangle.userData = {
        initialY: y,
        randomOffset: Math.random() * Math.PI * 2 // Unikalne przesunięcie dla każdej fali
    };

    triangles.push(triangle);
    scene.add(triangle);
}


// --- FUNKCJA ANIMACYJNA ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // 1. Animacja centralnego obiektu
    mainShape.rotation.x += 0.001;
    mainShape.rotation.y += 0.002;

    // 2. Animacja falujących trójkątów
    triangles.forEach(triangle => {
        // Rotacja
        triangle.rotation.y += 0.005;
        // Falowanie (ruch góra-dół) za pomocą funkcji sinus
        triangle.position.y = triangle.userData.initialY + Math.sin(elapsedTime * 1.5 + triangle.userData.randomOffset) * 0.5;
    });

    renderer.render(scene, camera);
}
animate();


// --- INTERAKCJA PRZY PRZEWIJANIU ---
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    mainShape.rotation.x += 0.02;
    mainShape.rotation.y += 0.01;
    mainShape.rotation.z += 0.02;

    camera.position.z = 5 + t * -0.002;
    camera.position.x = t * -0.0001;
    camera.position.y = t * -0.0001;
}
document.body.onscroll = moveCamera;


// --- Pozostała część kodu pozostaje bez zmian (Responsive, Tłumaczenia, Produkty) ---
window.addEventListener('resize', () => { /* ... ten kod jest poprawny ... */
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Reszta kodu od `const translations = { ... }` do samego końca jest poprawna i nie wymaga zmian.
// Upewnij się, że masz ją w swoim pliku. Dla pewności wklejam ją poniżej.

const translations = {
    pl: {
        pageTitle: "Portfolio | Eve Haddox",
        headerTitle: "Eve Haddox",
        headerSubtitle: "Twórca dodatków i skryptów",
        navAbout: "O mnie",
        navTimeline: "Timeline",
        navProducts: "Produkty",
        navContact: "Kontakt",
        aboutTitle: "O mnie",
        aboutText: "Witaj na mojej stronie. Jestem deweloperem specjalizującym się w tworzeniu rozwiązań dla GMod...",
        timelineTitle: "Timeline",
        timelineText: "Tutaj wkrótce pojawi się interaktywna oś czasu pokazująca kluczowe momenty w mojej karierze.",
        productsTitle: "Moje Produkty",
        contactTitle: "Kontakt",
        contactText: "Masz pytania lub propozycje? Skontaktuj się ze mną przez Gmodstore lub Discord.",
        productButton: "Zobacz w sklepie"
    },
    en: {
        pageTitle: "Portfolio | Eve Haddox",
        headerTitle: "Eve Haddox",
        headerSubtitle: "Addon & Script Creator",
        navAbout: "About",
        navTimeline: "Timeline",
        navProducts: "Products",
        navContact: "Contact",
        aboutTitle: "About Me",
        aboutText: "Welcome to my site. I am a developer specializing in creating solutions for GMod...",
        timelineTitle: "Timeline",
        timelineText: "An interactive timeline showing key moments in my career will appear here soon.",
        productsTitle: "My Products",
        contactTitle: "Contact",
        contactText: "Have questions or suggestions? Contact me via Gmodstore or Discord.",
        productButton: "View on Store"
    }
};

const langSwitcher = document.querySelector('#lang-switcher');
const langButtons = { pl: document.querySelector('#lang-pl'), en: document.querySelector('#lang-en') };
let currentLang = 'pl';
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    langButtons.pl.classList.toggle('active', lang === 'pl');
    langButtons.en.classList.toggle('active', lang === 'en');
    const elementsToTranslate = document.querySelectorAll('[data-translate-key]');
    elementsToTranslate.forEach(element => {
        const key = element.dataset.translateKey;
        if (translations[lang][key]) { element.innerHTML = translations[lang][key]; }
    });
    if (document.querySelector('.product-card')) { displayProducts(); }
}
langButtons.pl.addEventListener('click', () => setLanguage('pl'));
langButtons.en.addEventListener('click', () => setLanguage('en'));
async function displayProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const products = await response.json();
        const projectsSection = document.querySelector('#projects');
        const oldGrid = projectsSection.querySelector('.product-grid');
        if (oldGrid) oldGrid.remove();
        else projectsSection.querySelector('h2').innerHTML = translations[currentLang].productsTitle;
        const grid = document.createElement('div');
        grid.className = 'product-grid';
        const buttonText = translations[currentLang].productButton;
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `<h3>${product.name}</h3><p>${product.price} ${product.currency}</p><a href="${product.url}" target="_blank" rel="noopener noreferrer">${buttonText}</a>`;
            grid.appendChild(card);
        });
        projectsSection.appendChild(grid);
    } catch(error) { console.error("Nie udało się załadować produktów:", error); }
}
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    displayProducts();
});