document.addEventListener('DOMContentLoaded', () => {
    /* --- GLOBAL: Mobile Menu --- */
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if(menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    /* --- PAGE INITIALIZATION CHECKS --- */
    if (document.getElementById('carouselTrack')) {
        initCarousel();
        initStats();
    }

    if (document.getElementById('resourceList')) {
        initResources();
    }

    if (document.getElementById('eventsGrid')) {
        initEvents();
    }

    if (document.getElementById('resourceForm')) {
        initSubmit();
    }
});

/* ==========================================
   RESOURCES LOGIC (The Fix)
   ========================================== */
const resourceData = [
    { id:1, title: "Aurora Mental Health", cat: "Healthcare", address: "2206 Victor St", phone: "303-617-2300", lat: 39.7508, lng: -104.8391, desc: "Comprehensive mental health services." },
    { id:2, title: "Interfaith Food Bank", cat: "Food", address: "1553 Clinton St", phone: "303-360-0260", lat: 39.7405, lng: -104.8772, desc: "Emergency food boxes available." },
    { id:3, title: "Comitis Crisis Center", cat: "Housing", address: "2178 Victor St", phone: "303-341-9160", lat: 39.7492, lng: -104.8395, desc: "Shelter for families and veterans." },
    { id:4, title: "Stride Community Health", cat: "Healthcare", address: "10680 Del Mar Pkwy", phone: "303-360-6276", lat: 39.7350, lng: -104.8400, desc: "Affordable medical care." },
    { id:5, title: "Aurora Public Schools", cat: "Education", address: "15701 E 1st Ave", phone: "303-344-8060", lat: 39.7170, lng: -104.8050, desc: "District administrative offices." }
];

let map;
let markers = {}; // Changed to Object to store by ID

function initResources() {
    const searchInput = document.getElementById('resourceSearch');
    const filterDropdown = document.getElementById('resourceFilter');
    
    // Listeners
    searchInput.addEventListener('input', () => filterData());
    filterDropdown.addEventListener('change', () => filterData());

    // Map Init
    if(document.getElementById('map')) {
        map = L.map('map').setView([39.7294, -104.8319], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
    }

    filterData(); // Initial Render
}

function filterData() {
    const term = document.getElementById('resourceSearch').value.toLowerCase();
    const category = document.getElementById('resourceFilter').value;

    const filtered = resourceData.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(term);
        const matchCat = category === 'All' || item.cat === category;
        return matchSearch && matchCat;
    });

    renderList(filtered);
    renderMap(filtered);
    document.getElementById('resourceCount').textContent = `Showing ${filtered.length} resources`;
}

function renderList(data) {
    const list = document.getElementById('resourceList');
    if(data.length === 0) {
        list.innerHTML = `<div class="p-8 text-center text-gray-400">No results found.</div>`;
        return;
    }
    list.innerHTML = data.map(item => `
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition group" id="card-${item.id}">
            <div class="cursor-pointer" onclick="focusOnMap(${item.id})">
                <div class="flex justify-between mb-2">
                    <span class="text-xs font-bold uppercase text-gold tracking-wide">${item.cat}</span>
                    <i class="fa-solid fa-location-dot text-gray-300 group-hover:text-navy transition"></i>
                </div>
                <h3 class="font-bold text-navy text-lg">${item.title}</h3>
                <p class="text-sm text-gray-500 truncate mb-3">${item.desc}</p>
            </div>
            <button onclick="openModal(${item.id})" class="w-full py-2 text-xs font-bold text-navy border border-gray-200 rounded hover:bg-navy hover:text-white transition">
                View Details
            </button>
        </div>
    `).join('');
}

function renderMap(data) {
    if(!map) return;
    
    // Clear existing markers
    Object.values(markers).forEach(m => map.removeLayer(m));
    markers = {}; // Reset storage
    
    data.forEach(item => {
        const marker = L.marker([item.lat, item.lng])
            .addTo(map)
            .bindPopup(`<b>${item.title}</b><br>${item.address}`);
        
        // Store reference by ID so we can find it later
        markers[item.id] = marker; 
    });
}

// New Function: Focuses map instead of freezing screen
window.focusOnMap = function(id) {
    const item = resourceData.find(i => i.id === id);
    const marker = markers[id];

    if (item && map) {
        // Smooth animation to location
        map.flyTo([item.lat, item.lng], 15, {
            duration: 1.5
        });

        // Open the popup on the map
        if (marker) {
            setTimeout(() => marker.openPopup(), 500); // Small delay for animation
        }

        // On mobile, verify map is visible
        if(window.innerWidth < 768) {
             // Optional: Scroll to map or show map container
        }
    }
}


window.openModal = function(id) {
    const item = resourceData.find(i => i.id === id);
    if(!item) return;
    
    // Set text content
    document.getElementById('mTitle').innerText = item.title;
    document.getElementById('mCategory').innerText = item.cat;
    document.getElementById('mDesc').innerText = item.desc;
    document.getElementById('mAddress').innerText = item.address;
    document.getElementById('mPhone').innerText = item.phone;

    const mapLink = document.querySelector('#resourceModal a');
    
    // Standard Google Maps URL format: q=<destination address>
    const addressQuery = encodeURIComponent(item.address + ', Aurora, CO');
    mapLink.href = `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`;
    mapLink.target = "_blank"; // Open in new tab
    // ------------------------------------------

    const modal = document.getElementById('resourceModal');
    const content = document.getElementById('modalContent');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

window.closeModal = function() {
    const modal = document.getElementById('resourceModal');
    const content = document.getElementById('modalContent');
    
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

window.toggleMobileMap = function() {
    const mapDiv = document.querySelector('main'); // Adjusted selector
    const btn = document.querySelector('button[onclick="toggleMobileMap()"] i');
    
    if(mapDiv.classList.contains('hidden')) {
        mapDiv.classList.remove('hidden');
        btn.classList.remove('fa-map');
        btn.classList.add('fa-list');
        if(map) map.invalidateSize(); // Fixes gray map issue
    } else {
        mapDiv.classList.add('hidden');
        btn.classList.remove('fa-list');
        btn.classList.add('fa-map');
    }
}

/* ==========================================
   CAROUSEL LOGIC
   ========================================== */
function initCarousel() {
    const slides = [
        { title: "Aurora Mental Health", cat: "Healthcare", desc: "24/7 Crisis support available.", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
        { title: "Interfaith Food Bank", cat: "Food", desc: "Weekly fresh produce market.", img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
        { title: "Youth Tech Program", cat: "Education", desc: "Coding classes for ages 12-18.", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
        { title: "Comitis Crisis Center", cat: "Housing", desc: "Emergency shelter services.", img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
        { title: "Legal Aid Night", cat: "Legal", desc: "Free advice every Tuesday.", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
    ];

    const track = document.getElementById('carouselTrack');
    const counter = document.getElementById('slideCounter');
    const playBtn = document.getElementById('togglePlay');
    let current = 0;
    let isPlaying = true;
    let interval;

    // Render Slides
    track.innerHTML = slides.map(s => `
        <div class="min-w-full h-full relative">
            <img src="${s.img}" class="w-full h-full object-cover brightness-50">
            <div class="absolute bottom-0 left-0 p-10 text-white w-full bg-gradient-to-t from-navy to-transparent">
                <span class="bg-gold text-navy px-3 py-1 rounded font-bold uppercase text-sm mb-2 inline-block">${s.cat}</span>
                <h3 class="text-4xl font-serif font-bold mb-2">${s.title}</h3>
                <p class="text-lg opacity-90 mb-4">${s.desc}</p>
                <a href="resources.html" class="text-gold font-bold hover:text-white transition">View Details <i class="fa-solid fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');

    function update() {
        track.style.transform = `translateX(-${current * 100}%)`;
        counter.textContent = `${current + 1} / ${slides.length}`;
    }

    function next() {
        current = (current + 1) % slides.length;
        update();
    }

    // Controls
    document.getElementById('nextSlide').addEventListener('click', () => { next(); resetTimer(); });
    document.getElementById('prevSlide').addEventListener('click', () => { 
        current = (current - 1 + slides.length) % slides.length; 
        update(); resetTimer(); 
    });

    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
        if(isPlaying) startTimer(); else clearInterval(interval);
    });

    function startTimer() { interval = setInterval(next, 4000); }
    function resetTimer() { if(isPlaying) { clearInterval(interval); startTimer(); } }

    startTimer();
}

/* ==========================================
   STATS ANIMATION
   ========================================== */
function initStats() {
    const stats = document.querySelectorAll('.stat-item div[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const inc = target / 50; // speed
                const updateCount = () => {
                    count += inc;
                    if(count < target) {
                        entry.target.innerText = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    });
    stats.forEach(s => observer.observe(s));
}


/* ==========================================
   EVENTS LOGIC
   ========================================== */
function initEvents() {
    const eventsData = [
        { title: "Community Cleanup", date: "25", month: "NOV", time: "9:00 AM", type: "upcoming", loc: "City Park" },
        { title: "Food Pantry Drive", date: "28", month: "NOV", time: "12:00 PM", type: "weekly", loc: "Interfaith Center" },
        { title: "City Council Meeting", date: "01", month: "DEC", time: "6:00 PM", type: "monthly", loc: "Town Hall" },
        { title: "Winter Job Fair", date: "05", month: "DEC", time: "10:00 AM", type: "upcoming", loc: "Library" }
    ];

    const grid = document.getElementById('eventsGrid');
    const filters = document.querySelectorAll('.event-filter');

    function renderEvents(type) {
        const filtered = type === 'all' ? eventsData : eventsData.filter(e => e.type === type);
        
        grid.innerHTML = filtered.map(e => `
            <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-2 transition duration-300 border-t-4 border-gold">
                <div class="p-6 flex items-start gap-4">
                    <div class="bg-navy text-white rounded-lg p-3 text-center min-w-[70px]">
                        <div class="text-2xl font-bold">${e.date}</div>
                        <div class="text-xs uppercase font-bold text-gold">${e.month}</div>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-navy mb-1">${e.title}</h3>
                        <div class="text-sm text-gray-500 mb-2"><i class="fa-regular fa-clock mr-1"></i> ${e.time}</div>
                        <div class="text-sm text-gray-500"><i class="fa-solid fa-location-dot mr-1 text-gold"></i> ${e.loc}</div>
                        <span class="inline-block mt-3 text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase font-bold">${e.type}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('bg-navy', 'text-white'));
            filters.forEach(b => b.classList.add('bg-white', 'text-navy')); // Reset others
            btn.classList.remove('bg-white', 'text-navy');
            btn.classList.add('bg-navy', 'text-white');
            renderEvents(btn.getAttribute('data-type'));
        });
    });

    renderEvents('all');
}

/* ==========================================
   SUBMIT FORM LOGIC
   ========================================== */
function initSubmit() {
    const form = document.getElementById('resourceForm');
    const success = document.getElementById('successMessage');
    const container = document.getElementById('submitFormContainer');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate API call
        container.classList.add('hidden');
        success.classList.remove('hidden');
        window.scrollTo(0,0);
    });
}