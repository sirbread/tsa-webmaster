document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if(menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    if (document.getElementById('carouselTrack')) {
        initCarousel();
        initStats();
    }
    if (document.getElementById('resourceList')) {
        initResources();
    }
    if (document.getElementById('calendar')) {
        initCalendar();
    }
    if (document.getElementById('resourceForm')) {
        initSubmit();
    }
});

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

function initStats() {
    const stats = document.querySelectorAll('.stat-item div[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const inc = target / 50;
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

const resourceData = [
    { id:1, title: "Aurora Mental Health", cat: "Mental Health", address: "2206 Victor St", phone: "303-617-2300", lat: 39.7508, lng: -104.8391, desc: "Comprehensive mental health services." },
    { id:2, title: "Interfaith Food Bank", cat: "Food", address: "1553 Clinton St", phone: "303-360-0260", lat: 39.7405, lng: -104.8772, desc: "Emergency food boxes available." },
    { id:3, title: "Comitis Crisis Center", cat: "Housing", address: "2178 Victor St", phone: "303-341-9160", lat: 39.7492, lng: -104.8395, desc: "Shelter for families and veterans." },
    { id:4, title: "Stride Community Health", cat: "Healthcare", address: "10680 Del Mar Pkwy", phone: "303-360-6276", lat: 39.7350, lng: -104.8400, desc: "Affordable medical care." },
    { id:5, title: "Aurora Public Schools", cat: "Education", address: "15701 E 1st Ave", phone: "303-344-8060", lat: 39.7170, lng: -104.8050, desc: "District administrative offices." }
];

let map = null;
let markers = {};

function initResources() {
    const searchInput = document.getElementById('resourceSearch');
    const filterDropdown = document.getElementById('resourceFilter');
    
    searchInput.addEventListener('input', () => filterData());
    filterDropdown.addEventListener('change', () => filterData());

    if(document.getElementById('map')) {
        if(map) { map.remove(); }
        
        if(typeof L !== 'undefined') {
             map = L.map('map').setView([39.7294, -104.8319], 13);
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);
            
            setTimeout(() => { map.invalidateSize(); }, 100);
        } else {
            console.error("Leaflet library not loaded.");
        }
    }

    filterData();
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
    
    Object.values(markers).forEach(m => map.removeLayer(m));
    markers = {};
    
    data.forEach(item => {
        const marker = L.marker([item.lat, item.lng]).addTo(map)
            .bindPopup(`<b>${item.title}</b><br>${item.address}`);
        markers[item.id] = marker;
    });
}

window.focusOnMap = function(id) {
    const item = resourceData.find(i => i.id === id);
    const marker = markers[id];
    
    if(window.innerWidth < 768) {
        const mapContainer = document.querySelector('main');
        if(mapContainer.classList.contains('hidden')) {
            toggleMobileMap();
        }
    }

    if (item && map) {
        map.flyTo([item.lat, item.lng], 15, { duration: 1.5 });
        if (marker) {
            setTimeout(() => marker.openPopup(), 500);
        }
    }
}

window.openModal = function(id) {
    const item = resourceData.find(i => i.id === id);
    if(!item) return;
    
    document.getElementById('mTitle').innerText = item.title;
    document.getElementById('mCategory').innerText = item.cat;
    document.getElementById('mDesc').innerText = item.desc;
    document.getElementById('mAddress').innerText = item.address;
    document.getElementById('mPhone').innerText = item.phone;

    const mapLink = document.querySelector('#resourceModal a');
    const addressQuery = encodeURIComponent(item.address + ', Aurora, CO');
    mapLink.href = `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`;
    mapLink.target = "_blank";

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
    const mapDiv = document.querySelector('main');
    const btn = document.querySelector('button[onclick="toggleMobileMap()"] i');

    if(mapDiv.classList.contains('hidden')) {
        mapDiv.classList.remove('hidden');
        btn.classList.remove('fa-map');
        btn.classList.add('fa-list');
        if(map) setTimeout(() => map.invalidateSize(), 100);
    } else {
        mapDiv.classList.add('hidden');
        btn.classList.remove('fa-list');
        btn.classList.add('fa-map');
    }
}

const eventsData = [
    { id: 1, title: "Legal Aid Night", date: new Date(2025, 10, 26, 17, 0), type: "weekly", loc: "Library Annex", desc: "Free legal consultations." },
    { id: 2, title: "Food Pantry Drive", date: new Date(2025, 10, 28, 12, 0), type: "weekly", loc: "Interfaith Center", desc: "Donation collection for local pantries." },
    { id: 3, title: "Community Cleanup", date: new Date(2025, 10, 29, 9, 0), type: "upcoming", loc: "City Park", desc: "Volunteer effort to clean up the park." },
    { id: 4, title: "City Council Meeting", date: new Date(2025, 11, 1, 18, 0), type: "monthly", loc: "Town Hall", desc: "Regular city council session." },
    { id: 5, title: "Winter Job Fair", date: new Date(2025, 11, 5, 10, 0), type: "upcoming", loc: "Library", desc: "Connect with local employers." },
];

let currentView = 'month';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

currentMonth = 10;
currentYear = 2025;

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function initCalendar() {
    const monthViewBtn = document.getElementById('monthViewBtn');
    const weekViewBtn = document.getElementById('weekViewBtn');
    
    monthViewBtn.addEventListener('click', () => setView('month'));
    weekViewBtn.addEventListener('click', () => setView('week'));

    renderCalendar();
    renderUpcomingList();
}

function setView(view) {
    if (currentView !== view) {
        currentView = view;
        renderCalendar();
    }

    const toggles = document.querySelectorAll('.calendar-toggle');
    toggles.forEach(btn => {
        btn.classList.remove('bg-navy', 'text-white');
        btn.classList.add('hover:bg-gray-200');
    });
    
    const activeBtn = document.getElementById(view + 'ViewBtn');
    activeBtn.classList.add('bg-navy', 'text-white');
    activeBtn.classList.remove('hover:bg-gray-200');
}

function renderCalendar() {
     const calendarEl = document.getElementById('calendar');

     let headerText = '';
     let bodyContent = '';
     let headerControls = '';

     if (currentView === 'month') {
         headerText = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
         headerControls = `
             <div class="flex items-center justify-center gap-4 mb-4">
                 <button onclick="prevMonth()" class="p-2 hover:bg-gray-200 rounded transition">
                     <i class="fa-solid fa-chevron-left text-navy"></i>
                 </button>
                 <h3 class="text-center text-xl font-serif font-semibold text-navy w-40 -mt-1">
                     ${headerText}
                 </h3>
                 <button onclick="nextMonth()" class="p-2 hover:bg-gray-200 rounded transition">
                     <i class="fa-solid fa-chevron-right text-navy"></i>
                 </button>
             </div>
         `;
         bodyContent = `
             <div class="grid grid-cols-7 text-center font-bold text-gray-500 border-b pb-2">
                 <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
             </div>
             <div class="grid grid-cols-7 gap-1 pt-2">
                 ${generateCalendarDays()}
             </div>
         `;
     } else {
          headerText = 'Current Week View (Starting Today, Nov 21, 2025)';
          bodyContent = `
             <div class="space-y-4 pt-4">
                 ${generateWeekView()}
             </div>
          `;
     }

     calendarEl.innerHTML = `
         ${headerControls}
         ${bodyContent}
     `;
}

function generateCalendarDays() {
    const today = new Date();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    let html = '';

    for (let i = 0; i < firstDay; i++) { html += '<div></div>'; }

    for (let day = 1; day <= daysInMonth; day++) {
         const date = new Date(currentYear, currentMonth, day);
         const isToday = date.toDateString() === today.toDateString();

         const dayEvents = eventsData.filter(e => 
             e.date.getDate() === day &&
             e.date.getMonth() === currentMonth &&
             e.date.getFullYear() === currentYear
         );

         let classes = `h-24 p-2 rounded-md transition cursor-pointer text-center text-sm overflow-hidden ${isToday ? 'bg-gold/80 text-navy font-bold shadow-md' : 'hover:bg-gray-100 bg-gray-50'}`;

         html += `
             <div class="${classes}" title="${dayEvents.length} events on ${date.toDateString()}">
                 <span class="block ${isToday ? 'text-white bg-navy rounded-full w-6 h-6 leading-6 mx-auto mb-1' : 'font-semibold'}">${day}</span>
                 ${dayEvents.map(e => `<span class="block text-[9px] bg-navy text-white px-1 mt-0.5 rounded-full truncate" style="max-width: 90%; margin: 0 auto;">${e.title}</span>`).join('')}
             </div>
         `;
    }
    return html;
}

function generateWeekView() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let html = '';

    for(let i = 0; i < 7; i++) {
         const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
         const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
         const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

         const dayEvents = eventsData
             .filter(e => e.date.toDateString() === date.toDateString())
             .sort((a, b) => a.date - b.date);

         html += `
             <div class="border-l-4 border-navy pl-4">
                 <h4 class="font-bold text-lg">${dayName}, ${dateString}</h4>
                 ${dayEvents.length > 0 
                     ? dayEvents.map(e => `
                         <div class="mt-1 text-sm bg-gray-50 p-2 rounded border border-gray-200">
                             <span class="font-semibold">${e.title}</span> 
                             <span class="text-xs text-gray-600">at ${e.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} (${e.loc})</span>
                         </div>
                     `).join('')
                     : `<p class="text-sm text-gray-500 mt-1">No events scheduled.</p>`
                 }
             </div>
         `;
    }
    return html;
}

function renderUpcomingList() {
    const upcomingEl = document.getElementById('upcomingEventsList');
    const now = new Date();

    const upcoming = eventsData
        .filter(e => e.date > now)
        .sort((a, b) => a.date - b.date)
        .slice(0, 5);

    if (upcoming.length === 0) {
        upcomingEl.innerHTML = `<div class="text-center text-gray-300 py-4">No upcoming events listed at this time.</div>`;
        return;
    }

    upcomingEl.innerHTML = upcoming.map(e => `
        <div class="bg-gray-100 text-navy p-3 rounded-lg shadow-sm border border-gold/50">
            <div class="flex justify-between items-center">
                <h4 class="font-bold">${e.title}</h4>
                <span class="text-xs bg-gold text-navy px-2 py-0.5 rounded">${e.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <p class="text-sm text-gray-700 mt-1">${e.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} at ${e.loc}</p>
        </div>
    `).join('');
}

function initSubmit() {
    const form = document.getElementById('resourceForm');
    const success = document.getElementById('successMessage');
    const container = document.getElementById('submitFormContainer');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        container.classList.add('hidden');
        success.classList.remove('hidden');
        window.scrollTo(0,0);
    });
}
