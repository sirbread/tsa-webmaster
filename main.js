document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle Logic
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if(menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Initialize Components based on which page is active
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

/* =========================================
   CAROUSEL FUNCTIONALITY (Home Page)
   ========================================= */
function initCarousel() {
    // REAL Aurora, CO Highlights
    const slides = [
        { 
            title: "Aurora Mental Health & Recovery", 
            cat: "Healthcare", 
            desc: "24/7 Crisis Walk-In Clinic available for all residents.", 
            img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
        },
        { 
            title: "Aurora Interfaith Community Services", 
            cat: "Food", 
            desc: "Providing substantive emergency food to Aurora residents.", 
            img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
        },
        { 
            title: "Downtown Aurora Visual Arts", 
            cat: "Youth", 
            desc: "Community-based arts education programs for youth ages 3-17.", 
            img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
        },
        { 
            title: "Comitis Crisis Center", 
            cat: "Housing", 
            desc: "Emergency shelter and transitional housing services.", 
            img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
        },
        { 
            title: "Village Exchange Center", 
            cat: "Community", 
            desc: "A multi-faith community center serving immigrants and refugees.", 
            img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
        }
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
            <img src="${s.img}" class="w-full h-full object-cover brightness-50" alt="${s.title}">
            <div class="absolute bottom-0 left-0 p-8 md:p-10 text-white w-full bg-gradient-to-t from-navy to-transparent">
                <span class="bg-gold text-navy px-3 py-1 rounded font-bold uppercase text-sm mb-2 inline-block">${s.cat}</span>
                <h3 class="text-3xl md:text-4xl font-serif font-bold mb-2">${s.title}</h3>
                <p class="text-lg opacity-90 mb-4 max-w-2xl">${s.desc}</p>
                <a href="resources.html" class="text-gold font-bold hover:text-white transition inline-flex items-center gap-2">
                    View Details <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');

    function update() {
        track.style.transform = `translateX(-${current * 100}%)`;
        if(counter) counter.textContent = `${current + 1} / ${slides.length}`;
    }

    function next() {
        current = (current + 1) % slides.length;
        update();
    }

    // Event Listeners for Carousel Controls
    if(document.getElementById('nextSlide')) {
        document.getElementById('nextSlide').addEventListener('click', () => { next(); resetTimer(); });
        document.getElementById('prevSlide').addEventListener('click', () => { 
            current = (current - 1 + slides.length) % slides.length; 
            update(); resetTimer(); 
        });
    }

    if(playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
            if(isPlaying) startTimer(); else clearInterval(interval);
        });
    }

    function startTimer() { interval = setInterval(next, 5000); }
    function resetTimer() { if(isPlaying) { clearInterval(interval); startTimer(); } }

    startTimer();
}

/* =========================================
   STATS ANIMATION (Home Page)
   ========================================= */
function initStats() {
    const stats = document.querySelectorAll('.stat-item div[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                
                const updateCount = () => {
                    count += increment;
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

/* =========================================
   RESOURCE DIRECTORY DATA & LOGIC
   ========================================= */
// REAL DATA for Aurora, CO
const resourceData = [
    { 
        id:1, 
        title: "Aurora Mental Health & Recovery", 
        cat: "Mental Health", 
        address: "2206 Victor St", 
        city: "Aurora, CO 80045",
        phone: "303-617-2300", 
        lat: 39.7508, 
        lng: -104.8391, 
        desc: "24/7 Crisis Walk-In Clinic and comprehensive mental health services for all ages." 
    },
    { 
        id:2, 
        title: "Aurora Interfaith Community Services", 
        cat: "Food", 
        address: "1553 Clinton St", 
        city: "Aurora, CO 80010",
        phone: "303-360-9938", 
        lat: 39.7405, 
        lng: -104.8772, 
        desc: "Non-profit providing substantive emergency food to residents of Aurora." 
    },
    { 
        id:3, 
        title: "Comitis Crisis Center", 
        cat: "Housing", 
        address: "2178 Victor St", 
        city: "Aurora, CO 80045",
        phone: "303-341-9160", 
        lat: 39.7492, 
        lng: -104.8395, 
        desc: "Emergency shelter for families and veterans, plus transitional housing support." 
    },
    { 
        id:4, 
        title: "STRIDE Community Health Center", 
        cat: "Healthcare", 
        address: "10680 Del Mar Pkwy", 
        city: "Aurora, CO 80010",
        phone: "303-778-7433", 
        lat: 39.7350, 
        lng: -104.8745, 
        desc: "Integrated health care providing medical, dental, and behavioral health services." 
    },
    { 
        id:5, 
        title: "Aurora Public Schools - District Office", 
        cat: "Education", 
        address: "15701 E 1st Ave", 
        city: "Aurora, CO 80011",
        phone: "303-344-8060", 
        lat: 39.7170, 
        lng: -104.8050, 
        desc: "Administrative offices and enrollment center for Aurora Public Schools." 
    },
    { 
        id:6, 
        title: "Village Exchange Center", 
        cat: "Community", 
        address: "1609 Havana St", 
        city: "Aurora, CO 80010",
        phone: "720-668-9968", 
        lat: 39.7431, 
        lng: -104.8653, 
        desc: "A community center and food pantry serving immigrants, refugees, and locals." 
    },
    { 
        id:7, 
        title: "Downtown Aurora Visual Arts (DAVA)", 
        cat: "Youth", 
        address: "1405 Florence St", 
        city: "Aurora, CO 80010",
        phone: "303-367-5886", 
        lat: 39.7397, 
        lng: -104.8700, 
        desc: "Provides after-school arts education programs for youth in the community." 
    },
    { 
        id:8, 
        title: "Aurora Warms the Night", 
        cat: "Housing", 
        address: "1555 Dayton St", 
        city: "Aurora, CO 80010",
        phone: "303-343-0537", 
        lat: 39.7408, 
        lng: -104.8760, 
        desc: "Shelter services, warm meals, and hygiene kits for the unhoused." 
    },
    {
        id:9,
        title: "Aurora Public Library (Central)",
        cat: "Education",
        address: "14949 E Alameda Pkwy",
        city: "Aurora, CO 80012",
        phone: "303-739-6600",
        lat: 39.7112,
        lng: -104.8130,
        desc: "Public computers, classes, books, and community meeting spaces."
    }
];

let map = null;
let markers = {};

function initResources() {
    const searchInput = document.getElementById('resourceSearch');
    const filterDropdown = document.getElementById('resourceFilter');
    
    if(searchInput) searchInput.addEventListener('input', () => filterData());
    if(filterDropdown) filterDropdown.addEventListener('change', () => filterData());

    if(document.getElementById('map')) {
        // Initialize Leaflet Map
        if(typeof L !== 'undefined') {
            if(map) map.remove(); // Prevent duplicate initialization
             // Center on Aurora, CO
             map = L.map('map').setView([39.7294, -104.8319], 12);
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            setTimeout(() => { map.invalidateSize(); }, 100);
        } else {
            console.error("Leaflet library not loaded.");
        }
    }

    filterData();
}

function filterData() {
    const term = document.getElementById('resourceSearch') ? document.getElementById('resourceSearch').value.toLowerCase() : '';
    const category = document.getElementById('resourceFilter') ? document.getElementById('resourceFilter').value : 'All';

    const filtered = resourceData.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term);
        const matchCat = category === 'All' || item.cat === category;
        return matchSearch && matchCat;
    });

    renderList(filtered);
    renderMap(filtered);
    
    const countEl = document.getElementById('resourceCount');
    if(countEl) countEl.textContent = `Showing ${filtered.length} resources`;
}

function renderList(data) {
    const list = document.getElementById('resourceList');
    if(!list) return;

    if(data.length === 0) {
        list.innerHTML = `<div class="p-8 text-center text-gray-400">No results found matching criteria.</div>`;
        return;
    }
    list.innerHTML = data.map(item => `
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition group card-item" id="card-${item.id}">
            <div class="cursor-pointer" onclick="focusOnMap(${item.id})">
                <div class="flex justify-between mb-2">
                    <span class="text-xs font-bold uppercase text-gold tracking-wide bg-navy/5 px-2 py-0.5 rounded">${item.cat}</span>
                    <i class="fa-solid fa-location-dot text-gray-300 group-hover:text-navy transition"></i>
                </div>
                <h3 class="font-bold text-navy text-lg leading-tight mb-1">${item.title}</h3>
                <p class="text-xs text-gray-500 mb-2"><i class="fa-solid fa-map-pin mr-1"></i> ${item.address}</p>
                <p class="text-sm text-gray-600 truncate mb-3">${item.desc}</p>
            </div>
            <button onclick="openModal(${item.id})" class="w-full py-2 text-xs font-bold text-navy border border-gray-200 rounded hover:bg-navy hover:text-white transition uppercase tracking-wider">
                View Details
            </button>
        </div>
    `).join('');
}

function renderMap(data) {
    if(!map) return;
    
    // Clear existing markers
    Object.values(markers).forEach(m => map.removeLayer(m));
    markers = {};
    
    // Add new markers
    data.forEach(item => {
        const marker = L.marker([item.lat, item.lng]).addTo(map)
            .bindPopup(`
                <div class="text-center">
                    <strong class="text-navy block mb-1">${item.title}</strong>
                    <span class="text-xs text-gray-500">${item.address}</span><br>
                    <button onclick="openModal(${item.id})" class="text-gold font-bold text-xs mt-2">View Details</button>
                </div>
            `);
        markers[item.id] = marker;
    });
}

// Interaction Functions attached to window for HTML access
window.focusOnMap = function(id) {
    const item = resourceData.find(i => i.id === id);
    const marker = markers[id];
    
    // On mobile, if map is hidden, show it
    if(window.innerWidth < 768) {
        const mapContainer = document.querySelector('main');
        if(mapContainer && mapContainer.classList.contains('hidden')) {
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
    document.getElementById('mAddress').innerText = item.city; // Using city format
    document.getElementById('mPhone').innerText = item.phone;

    const mapLink = document.querySelector('#resourceModal a');
    if(mapLink) {
        const addressQuery = encodeURIComponent(item.address + ', ' + item.city);
        mapLink.href = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
        mapLink.target = "_blank";
    }

    const modal = document.getElementById('resourceModal');
    const content = document.getElementById('modalContent');

    if(modal) modal.classList.remove('hidden');
    if(content) {
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
}

window.closeModal = function() {
    const modal = document.getElementById('resourceModal');
    const content = document.getElementById('modalContent');
    if(content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
    }
    if(modal) {
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

window.toggleMobileMap = function() {
    const mapDiv = document.querySelector('main'); // The main container holding the map
    const btnIcon = document.querySelector('button[onclick="toggleMobileMap()"] i');

    if(mapDiv.classList.contains('hidden')) {
        mapDiv.classList.remove('hidden'); // Show map
        if(btnIcon) {
            btnIcon.classList.remove('fa-map');
            btnIcon.classList.add('fa-list');
        }
        if(map) setTimeout(() => map.invalidateSize(), 100);
    } else {
        mapDiv.classList.add('hidden'); // Hide map
        if(btnIcon) {
            btnIcon.classList.remove('fa-list');
            btnIcon.classList.add('fa-map');
        }
    }
}

/* =========================================
   EVENTS CALENDAR GENERATOR
   ========================================= */

// Event Generator to ensure we have data from Nov 2025 to Mar 2026
function generateEventsData() {
    const events = [];
    
    // 1. Static Highlight Events (Real dates from research)
    events.push(
        { id: 101, title: "The Pond Ice Rink Opening", date: new Date(2025, 10, 26, 10, 0), loc: "Southlands", desc: "Seasonal ice skating rink opens for the winter season." },
        { id: 102, title: "Shop Small Market", date: new Date(2025, 10, 29, 9, 0), loc: "1427 Elmira St", desc: "Support local artisans and businesses." },
        { id: 103, title: "Merry Makers Market", date: new Date(2025, 11, 2, 16, 0), loc: "Aurora Central Library", desc: "Holiday craft fair and community gathering." },
        { id: 104, title: "Holiday Tree Lighting", date: new Date(2025, 11, 6, 17, 30), loc: "Gateway High School", desc: "Annual holiday celebration with music and lights." },
        { id: 105, title: "MLK Jr. Parade", date: new Date(2026, 0, 19, 10, 0), loc: "City Park", desc: "Commemorative march and celebration." }
    );

    // 2. Generative Recurring Events (To fill the calendar weekly)
    const startDate = new Date(2025, 10, 1); // Nov 1, 2025
    const endDate = new Date(2026, 2, 31);   // March 31, 2026

    // Loop through every day in the range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon...
        const dateNum = d.getDate();
        
        // Mondays (Recurring City Council)
        if (dayOfWeek === 1 && (dateNum > 7 && dateNum < 15 || dateNum > 21)) {
            // 2nd and 4th Mondays usually
            events.push({
                title: "City Council Meeting",
                date: new Date(d.setHours(18, 30)),
                loc: "Aurora Municipal Center",
                desc: "Public council meeting. Open to residents."
            });
        }

        // Wednesdays (Weekly Food Pantry)
        if (dayOfWeek === 3) {
            events.push({
                title: "Community Food Pantry",
                date: new Date(d.setHours(14, 0)),
                loc: "Interfaith Community Services",
                desc: "Drive-up food distribution for families in need."
            });
        }

        // Thursdays (Youth Tech)
        if (dayOfWeek === 4) {
            events.push({
                title: "Teen Tech Time",
                date: new Date(d.setHours(16, 0)),
                loc: "Central Library",
                desc: "Coding and maker space access for ages 12-18."
            });
        }
    }
    
    // Sort chronologically
    return events.sort((a, b) => a.date - b.date);
}

// Global state for calendar
let currentEvents = [];
let currentMonth = 10; // November (0-indexed)
let currentYear = 2025;
let currentView = 'month';

function initCalendar() {
    currentEvents = generateEventsData();
    
    // Set initial date to "Current" simulated date (Nov 2025)
    currentMonth = 10;
    currentYear = 2025;

    const monthViewBtn = document.getElementById('monthViewBtn');
    const weekViewBtn = document.getElementById('weekViewBtn');
    
    if(monthViewBtn) monthViewBtn.addEventListener('click', () => setView('month'));
    if(weekViewBtn) weekViewBtn.addEventListener('click', () => setView('week'));

    renderCalendar();
    renderUpcomingList();
}

function setView(view) {
    currentView = view;
    renderCalendar();

    // Toggle button styles
    const mBtn = document.getElementById('monthViewBtn');
    const wBtn = document.getElementById('weekViewBtn');
    
    if(view === 'month') {
        mBtn.classList.add('bg-navy', 'text-white');
        mBtn.classList.remove('hover:bg-gray-200');
        wBtn.classList.remove('bg-navy', 'text-white');
        wBtn.classList.add('hover:bg-gray-200');
    } else {
        wBtn.classList.add('bg-navy', 'text-white');
        wBtn.classList.remove('hover:bg-gray-200');
        mBtn.classList.remove('bg-navy', 'text-white');
        mBtn.classList.add('hover:bg-gray-200');
    }
}

// Helper functions accessible to HTML onclicks
window.prevMonth = function() {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
}

window.nextMonth = function() {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
}

function renderCalendar() {
     const calendarEl = document.getElementById('calendar');
     if(!calendarEl) return;

     let headerControls = '';
     let bodyContent = '';

     if (currentView === 'month') {
         const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
         
         headerControls = `
             <div class="flex items-center justify-between md:justify-center gap-4 mb-6">
                 <button onclick="prevMonth()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                     <i class="fa-solid fa-chevron-left text-navy"></i>
                 </button>
                 <h3 class="text-center text-2xl font-serif font-bold text-navy w-48">
                     ${monthName}
                 </h3>
                 <button onclick="nextMonth()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                     <i class="fa-solid fa-chevron-right text-navy"></i>
                 </button>
             </div>
         `;
         
         bodyContent = `
             <div class="grid grid-cols-7 text-center font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">
                 <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
             </div>
             <div class="grid grid-cols-7 gap-2">
                 ${generateMonthGrid()}
             </div>
         `;
     } else {
         // Week View
         const startDate = new Date(currentYear, currentMonth, 1); 
         // For demo purposes in week view, we just show the first week of the selected month
         headerControls = `
             <div class="mb-4 pb-4 border-b border-gray-100">
                <h3 class="text-xl font-bold text-navy">Week Overview</h3>
                <p class="text-gray-500 text-sm">Showing events for selected week in ${new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long' })}.</p>
             </div>
         `;
         bodyContent = `<div class="space-y-4">${generateWeekList()}</div>`;
     }

     calendarEl.innerHTML = headerControls + bodyContent;
}

function generateMonthGrid() {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    let html = '';

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) { 
        html += '<div class="h-24 md:h-28 bg-transparent"></div>'; 
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
         const date = new Date(currentYear, currentMonth, day);
         
         // Find events for this specific day
         const dayEvents = currentEvents.filter(e => 
             e.date.getDate() === day &&
             e.date.getMonth() === currentMonth &&
             e.date.getFullYear() === currentYear
         );

         html += `
             <div class="h-24 md:h-28 border border-gray-100 rounded-lg p-2 hover:shadow-md transition bg-white relative overflow-hidden group">
                 <span class="font-bold text-sm text-gray-700 block mb-1">${day}</span>
                 <div class="space-y-1 overflow-y-auto max-h-[80px] no-scrollbar">
                    ${dayEvents.map(e => `
                        <div class="text-[10px] bg-navy text-white px-1.5 py-0.5 rounded truncate" title="${e.title}">
                            ${e.title}
                        </div>
                    `).join('')}
                 </div>
                 ${dayEvents.length > 2 ? `<div class="absolute bottom-0 left-0 w-full text-[9px] text-center bg-gray-50 text-gray-400">+ more</div>` : ''}
             </div>
         `;
    }
    return html;
}

function generateWeekList() {
    // Generates a list for the first 7 days of the current Month variable for display
    let html = '';
    for(let i = 1; i <= 7; i++) {
         const date = new Date(currentYear, currentMonth, i);
         const dayEvents = currentEvents.filter(e => 
             e.date.getDate() === i &&
             e.date.getMonth() === currentMonth &&
             e.date.getFullYear() === currentYear
         );

         html += `
             <div class="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition border-l-4 ${dayEvents.length > 0 ? 'border-gold' : 'border-gray-200'}">
                 <div class="w-16 text-center shrink-0">
                     <div class="text-xs uppercase text-gray-500 font-bold">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                     <div class="text-2xl font-serif font-bold text-navy">${i}</div>
                 </div>
                 <div class="flex-1">
                     ${dayEvents.length > 0 
                         ? dayEvents.map(e => `
                             <div class="mb-2 last:mb-0">
                                 <h4 class="font-bold text-navy text-sm">${e.title}</h4>
                                 <div class="text-xs text-gray-600 flex gap-2 mt-0.5">
                                    <span><i class="fa-regular fa-clock"></i> ${e.date.toLocaleTimeString('en-US', { hour: 'numeric', minute:'2-digit'})}</span>
                                    <span><i class="fa-solid fa-location-dot"></i> ${e.loc}</span>
                                 </div>
                             </div>
                         `).join('')
                         : '<span class="text-sm text-gray-400 italic">No events scheduled</span>'
                     }
                 </div>
             </div>
         `;
    }
    return html;
}

function renderUpcomingList() {
    const listEl = document.getElementById('upcomingEventsList');
    if(!listEl) return;

    // Filter events that are in the future relative to "Now" (Nov 2025 simulation)
    const simulatedNow = new Date(2025, 10, 20); // Nov 20, 2025
    
    const upcoming = currentEvents
        .filter(e => e.date >= simulatedNow)
        .slice(0, 5); // Take first 5

    listEl.innerHTML = upcoming.map(e => `
        <div class="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div class="bg-white border border-gray-200 rounded p-2 text-center min-w-[50px]">
                <span class="block text-xs text-red-500 font-bold uppercase">${e.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span class="block text-xl font-bold text-navy font-serif">${e.date.getDate()}</span>
            </div>
            <div>
                <h4 class="font-bold text-navy text-sm leading-tight hover:text-gold transition cursor-pointer">${e.title}</h4>
                <p class="text-xs text-gray-500 mt-1">${e.date.toLocaleTimeString('en-US', { hour: 'numeric', minute:'2-digit'})} @ ${e.loc}</p>
            </div>
        </div>
    `).join('');
}

/* =========================================
   FORM SUBMISSION
   ========================================= */
function initSubmit() {
    const form = document.getElementById('resourceForm');
    const success = document.getElementById('successMessage');
    const container = document.getElementById('submitFormContainer');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if(container) container.classList.add('hidden');
            if(success) success.classList.remove('hidden');
            window.scrollTo(0,0);
        });
    }
}