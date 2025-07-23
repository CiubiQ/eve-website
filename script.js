import * as THREE from 'three';

// --- PODSTAWOWA KONFIGURACJA SCENY 3D ---
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// --- OBIEKT 3D ---
const geometry = new THREE.IcosahedronGeometry(1.2, 0);
const material = new THREE.MeshStandardMaterial({
    color: 0xb43a3a,
    wireframe: true
});
const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

// --- ŚWIATŁO ---
const pointLight = new THREE.PointLight(0xffffff, 30, 100);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(pointLight, ambientLight);

// --- FUNKCJA ANIMACYJNA ---
function animate() {
    requestAnimationFrame(animate);

    shape.rotation.x += 0.001;
    shape.rotation.y += 0.002;

    renderer.render(scene, camera);
}
animate();

// --- INTERAKCJA PRZY PRZEWIJANIU ---
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    shape.rotation.x += 0.02;
    shape.rotation.y += 0.01;
    shape.rotation.z += 0.02;

    camera.position.z = 5 + t * -0.002;
    camera.position.x = t * -0.0001;
    camera.position.y = t * -0.0001;
}
document.body.onscroll = moveCamera;
moveCamera();

// --- RESPONSIVE CANVAS ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- LOGIKA TŁUMACZEŃ ---
const translations = {
    pl: {
        pageTitle: "Portfolio | Eve Haddox",
        headerTitle: "Eve Haddox",
        headerSubtitle: "Twórca dodatków i skryptów",
        aboutTitle: "O mnie",
        aboutText: "Witaj na mojej stronie. Jestem deweloperem specjalizującym się w tworzeniu rozwiązań dla GMod. Moja pasja to dostarczanie wysokiej jakości, zoptymalizowanych skryptów i dodatków. Przewiń w dół, aby zobaczyć moje prace.",
        productsTitle: "Moje Produkty",
        contactTitle: "Kontakt",
        contactText: "Masz pytania lub propozycje? Skontaktuj się ze mną przez Gmodstore lub Discord.",
        productButton: "Zobacz w sklepie"
    },
    en: {
        pageTitle: "Portfolio | Eve Haddox",
        headerTitle: "Eve Haddox",
        headerSubtitle: "Addon & Script Creator",
        aboutTitle: "About Me",
        aboutText: "Welcome to my site. I am a developer specializing in creating solutions for GMod. My passion is to deliver high-quality, optimized scripts and addons. Scroll down to see my work.",
        productsTitle: "My Products",
        contactTitle: "Contact",
        contactText: "Have questions or suggestions? Contact me via Gmodstore or Discord.",
        productButton: "View on Store"
    }
};

const langSwitcher = document.querySelector('#lang-switcher');
const langButtons = {
    pl: document.querySelector('#lang-pl'),
    en: document.querySelector('#lang-en')
};
let currentLang = 'pl';

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    langButtons.pl.classList.toggle('active', lang === 'pl');
    langButtons.en.classList.toggle('active', lang === 'en');
    const elementsToTranslate = document.querySelectorAll('[data-translate-key]');
    elementsToTranslate.forEach(element => {
        const key = element.dataset.translateKey;
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    if (document.querySelector('.product-card')) {
        displayProducts();
    }
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
        if (oldGrid) {
            oldGrid.remove();
        } else {
             projectsSection.querySelector('h2').innerHTML = translations[currentLang].productsTitle;
        }
        const grid = document.createElement('div');
        grid.className = 'product-grid';
        const buttonText = translations[currentLang].productButton;
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.price} ${product.currency}</p>
                <a href="${product.url}" target="_blank" rel="noopener noreferrer">${buttonText}</a>
            `;
            grid.appendChild(card);
        });
        projectsSection.appendChild(grid);
    } catch(error) {
        console.error("Nie udało się załadować produktów:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    displayProducts();
});