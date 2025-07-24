import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- GŁÓWNA KONFIGURACJA FLOTY I SCENY ---
const cruiserFleet = [
    { name: 'invictus1', path: 'models/invictus_class_star_cruiser.glb', position: { x: -40, y: 20, z: -70 }, scale: { x: 0.8, y: 0.8, z: 0.8 }, rotation: { x: 0.2, y: 2.5, z: -0.1 }, animation: function(ship) { ship.position.x += 0.01; if (ship.position.x > sceneBounds.x) ship.position.x = -sceneBounds.x; } },
    { name: 'invictus2', path: 'models/invictus_class_star_cruiser.glb', position: { x: 40, y: -15, z: -60 }, scale: { x: 0.5, y: 0.5, z: 0.5 }, rotation: { x: 0.1, y: -0.8, z: 0.1 }, animation: function(ship) { ship.position.x -= 0.02; if (ship.position.x < -sceneBounds.x) ship.position.x = sceneBounds.x; } },
    { name: 'mc80', path: 'models/star_wars_mc80_home_one_type_star_cruiser.glb', position: { x: 0, y: 25, z: -120 }, scale: { x: 0.015, y: 0.015, z: 0.015 }, rotation: { x: 0.1, y: 3.14, z: 0 }, animation: function(ship) { ship.position.z += 0.03; if (ship.position.z > -10) ship.position.z = -120; } }
];
const sceneBounds = { x: 50, y: 40 };

// --- INICJALIZACJA SCENY 3D ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 12;
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(5, 3, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(sunLight, ambientLight);
const mainShape = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 0), new THREE.MeshStandardMaterial({ color: 0xb43a3a, wireframe: true }));
scene.add(mainShape);
const starGeometry = new THREE.SphereGeometry(0.02, 24, 24);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
for (let i = 0; i < 1500; i++) { const star = new THREE.Mesh(starGeometry, starMaterial); const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200)); star.position.set(x, y, z); scene.add(star); }
const loader = new GLTFLoader();
const loadedCruisers = {};
cruiserFleet.forEach(config => {
    loader.load(config.path, (gltf) => {
        const cruiser = gltf.scene;
        const modelToUse = loadedCruisers[config.path] ? loadedCruisers[config.path].clone() : cruiser;
        modelToUse.position.set(config.position.x, config.position.y, config.position.z);
        modelToUse.scale.set(config.scale.x, config.scale.y, config.scale.z);
        modelToUse.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
        scene.add(modelToUse);
        loadedCruisers[config.name] = modelToUse;
        if (!loadedCruisers[config.path]) { loadedCruisers[config.path] = cruiser; }
    }, undefined, (error) => { console.error(`Błąd ładowania modelu ${config.name}:`, error); });
});

// --- PĘTLA ANIMACJI I EVENTY ---
function animate() {
    requestAnimationFrame(animate);
    mainShape.rotation.y += 0.002;
    mainShape.rotation.x += 0.001;
    cruiserFleet.forEach(config => { if (loadedCruisers[config.name]) { config.animation(loadedCruisers[config.name]); } });
    renderer.render(scene, camera);
}
animate();
function moveCamera() { const t = document.body.getBoundingClientRect().top; camera.position.z = 12 + t * -0.01; }
document.body.onscroll = moveCamera;
window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

// --- LOGIKA STRONY (Tłumaczenia, Produkty) ---
const translations = {
    pl: {
        pageTitle: "Portfolio | Eve Haddox",
        headerTitle: "Eve Haddox",
        headerSubtitle: "Twórca dodatków i skryptów",
        navAbout: "O mnie",
        navTimeline: "Oś czasu",
        navProducts: "Produkty",
        navContact: "Kontakt",
        aboutTitle: "O mnie",
        aboutText: "Witaj na mojej stronie...",
        timelineTitle: "Oś czasu",
        timelineEvent1Title: "ELevels",
        timelineEvent1Desc: "Leveling & Skills system",
        timelineEvent1Date: "2024.12.04",
        timelineTooltip1: "System dodaje mechanikę poziomów i umiejętności, nagradzając graczy za aktywność na serwerze.",
        timelineEvent2Title: "EReports",
        timelineEvent2Desc: "Reports and sits system",
        timelineTooltip2: "Narzędzie upraszczające system raportów i zgłoszeń, kluczowe dla sprawnej administracji serwerem.",
        productsTitle: "Moje Produkty",
        contactTitle: "Kontakt",
        contactText: "Masz pytania lub propozycje? Skontaktuj się ze mną...",
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
        aboutText: "Welcome to my site...",
        timelineTitle: "Timeline",
        timelineEvent1Title: "ELevels",
        timelineEvent1Desc: "Leveling & Skills system",
        timelineEvent1Date: "2024.12.04",
        timelineTooltip1: "The system adds level and skill mechanics, rewarding players for their activity on the server.",
        timelineEvent2Title: "EReports",
        timelineEvent2Desc: "Reports and sits system",
        timelineTooltip2: "A tool that simplifies the report and ticket system, crucial for efficient server administration.",
        productsTitle: "My Products",
        contactTitle: "Contact",
        contactText: "Have questions or suggestions? Contact me...",
        // ZMIANA: Poprawiona nazwa klucza z 'button' na 'productButton'
        productButton: "View on Store" 
    }
};
const langSwitcher = document.querySelector('#lang-switcher');
const langButtons = { pl: document.querySelector('#lang-pl'), en: document.querySelector('#lang-en') };
let currentLang = 'pl';
function setLanguage(lang) { currentLang = lang; document.documentElement.lang = lang; langButtons.pl.classList.toggle('active', lang === 'pl'); langButtons.en.classList.toggle('active', lang === 'en'); const elementsToTranslate = document.querySelectorAll('[data-translate-key]'); elementsToTranslate.forEach(element => { const key = element.dataset.translateKey; if (translations[lang][key]) { element.innerHTML = translations[lang][key]; } }); if (document.querySelector('.product-card')) { displayProducts(); } }
langButtons.pl.addEventListener('click', () => setLanguage('pl'));
langButtons.en.addEventListener('click', () => setLanguage('en'));
async function displayProducts() { try { const response = await fetch('products.json'); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const products = await response.json(); const grid = document.querySelector('#projects .product-grid'); grid.innerHTML = ''; const buttonText = translations[currentLang].productButton; products.forEach(product => { const card = document.createElement('div'); card.className = 'product-card'; card.innerHTML = `<h3>${product.name}</h3><div class="product-stats"><span class="stat-item">👁️ ${product.views}</span><span class="stat-item">🛒 ${product.sales}</span></div><a href="${product.url}" target="_blank" rel="noopener noreferrer">${buttonText}</a>`; grid.appendChild(card); }); } catch(error) { console.error("Nie udało się załadować produktów:", error); } }
document.addEventListener('DOMContentLoaded', () => { setLanguage('pl'); displayProducts(); });
