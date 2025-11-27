document.addEventListener('DOMContentLoaded', () => {
     const menuBtn = document.getElementById('mobileMenuBtn');
     const mobileMenu = document.getElementById('mobileMenu');
     if(menuBtn && mobileMenu) {
         menuBtn.addEventListener('click', () => {
             mobileMenu.classList.toggle('hidden');
         });
     }

     const currentPage = window.location.pathname.split('/').pop() || 'index.html';
     document.querySelectorAll('.nav-link').forEach(link => {
         link.classList.remove('active', 'active-page');
         const href = link.getAttribute('href');
         if(href === currentPage || (currentPage === '' && href === 'index.html')) {
             link.classList.add('active', 'active-page');
         }
     });

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
        { 
            title: "Aurora Mental Health & Recovery", 
            cat: "Healthcare", 
            desc: "24/7 Crisis Walk-In Clinic available for all residents.", 
            img: "mentalhealth.jpg" 
        },
        { 
            title: "Aurora Interfaith Community Services", 
            cat: "Food", 
            desc: "Providing substantive emergency food to Aurora residents.", 
            img: "food.jpg" 
        },
        { 
            title: "Downtown Aurora Visual Arts", 
            cat: "Youth", 
            desc: "Community-based arts education programs for youth ages 3-17.", 
            img: "art.jpg" 
        },
        { 
            title: "Comitis Crisis Center", 
            cat: "Housing", 
            desc: "Emergency shelter and transitional housing services.", 
            img: "canthisruncrysis.jpg" 
        },
        { 
            title: "Village Exchange Center", 
            cat: "Community", 
            desc: "A multi-faith community center serving immigrants and refugees.", 
            img: "vex.jpg" 
        }
    ];

    const track = document.getElementById('carouselTrack');
    const counter = document.getElementById('slideCounter');
    const playBtn = document.getElementById('togglePlay');
    let current = 0;
    let isPlaying = true;
    let interval;

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

function initStats() {
    const stats = document.querySelectorAll('.stat-item div[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const duration = 2000;
                const increment = target / (duration / 16);
                
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
        if(typeof L !== 'undefined') {
            if(map) map.remove(); 
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
    
    Object.values(markers).forEach(m => map.removeLayer(m));
    markers = {};
    
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

window.focusOnMap = function(id) {
    const item = resourceData.find(i => i.id === id);
    const marker = markers[id];
    
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
    document.getElementById('mAddress').innerText = item.city; 
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
    const mapDiv = document.querySelector('main');
    const btnIcon = document.querySelector('button[onclick="toggleMobileMap()"] i');

    if(mapDiv.classList.contains('hidden')) {
        mapDiv.classList.remove('hidden'); 
        if(btnIcon) {
            btnIcon.classList.remove('fa-map');
            btnIcon.classList.add('fa-list');
        }
        if(map) setTimeout(() => map.invalidateSize(), 100);
    } else {
        mapDiv.classList.add('hidden');
        if(btnIcon) {
            btnIcon.classList.remove('fa-list');
            btnIcon.classList.add('fa-map');
        }
    }
}

const eventTypeStyles = {
    weekly: { bg: 'bg-navy', text: 'text-gold', icon: 'fa-star' },
    monthly: { bg: 'bg-gold', text: 'text-navy', icon: 'fa-calendar' },
    upcoming: { bg: 'bg-navy/70', text: 'text-gold', icon: 'fa-bolt' }
};

function generateEventsData() {
    const events = [];
    
    events.push(
        { id: 101, title: "The Pond Ice Rink Opening", date: new Date(2025, 10, 26, 10, 0), loc: "Southlands", desc: "Seasonal ice skating rink opens for the winter season.", type: "upcoming" },
        { id: 102, title: "Shop Small Market", date: new Date(2025, 10, 29, 9, 0), loc: "1427 Elmira St", desc: "Support local artisans and businesses.", type: "upcoming" },
        { id: 103, title: "Merry Makers Market", date: new Date(2025, 11, 2, 16, 0), loc: "Aurora Central Library", desc: "Holiday craft fair and community gathering.", type: "upcoming" },
        { id: 104, title: "Holiday Tree Lighting", date: new Date(2025, 11, 6, 17, 30), loc: "Gateway High School", desc: "Annual holiday celebration with music and lights.", type: "upcoming" },
        { id: 105, title: "MLK Jr. Parade", date: new Date(2026, 0, 19, 10, 0), loc: "City Park", desc: "Commemorative march and celebration.", type: "upcoming" }
    );

    const startDate = new Date(2025, 10, 1); 
    const endDate = new Date(2026, 2, 31);   

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        const dateNum = d.getDate();
        
         if (dayOfWeek === 1 && (dateNum > 7 && dateNum < 15 || dateNum > 21)) {
             events.push({
                 title: "City Council Meeting",
                 date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 18, 30),
                 loc: "Aurora Municipal Center",
                 desc: "Public council meeting. Open to residents.",
                 type: "monthly"
             });
         }

         if (dayOfWeek === 3) {
             events.push({
                 title: "Community Food Pantry",
                 date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 14, 0),
                 loc: "Interfaith Community Services",
                 desc: "Drive-up food distribution for families in need.",
                 type: "weekly"
             });
         }

         if (dayOfWeek === 4) {
             events.push({
                 title: "Teen Tech Time",
                 date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 16, 0),
                 loc: "Central Library",
                 desc: "Coding and maker space access for ages 12-18.",
                 type: "weekly"
             });
         }
    }
    
    return events.sort((a, b) => a.date - b.date);
}

let currentEvents = [];
let currentMonth = 10;
let currentYear = 2025;
let currentView = 'month';
let currentWeekStart = new Date(2025, 10, 2); 

function initCalendar() {
     currentEvents = generateEventsData();
     const today = new Date();
     currentMonth = today.getMonth();
     currentYear = today.getFullYear();
     
     const dayOffset = today.getDay();
     currentWeekStart = new Date(today);
     currentWeekStart.setDate(today.getDate() - dayOffset);

    const monthViewBtn = document.getElementById('monthViewBtn');
    const weekViewBtn = document.getElementById('weekViewBtn');
    
    if(monthViewBtn) monthViewBtn.addEventListener('click', () => setView('month'));
    if(weekViewBtn) weekViewBtn.addEventListener('click', () => setView('week'));

    renderCalendar();
    renderUpcomingList();
}

function setView(view) {
    currentView = view;
    if (view === 'month') {
        currentMonth = currentWeekStart.getMonth();
        currentYear = currentWeekStart.getFullYear();
    } else {
    }

    renderCalendar();

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

window.changePeriod = function(direction) {
    if (currentView === 'month') {
        currentMonth += direction;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        
        const firstOfMonth = new Date(currentYear, currentMonth, 1);
        const dayOffset = firstOfMonth.getDay(); 
        currentWeekStart = new Date(firstOfMonth);
        currentWeekStart.setDate(firstOfMonth.getDate() - dayOffset);
        
    } else {
        currentWeekStart.setDate(currentWeekStart.getDate() + (direction * 7));
        
        const midWeek = new Date(currentWeekStart);
        midWeek.setDate(midWeek.getDate() + 3);
        currentMonth = midWeek.getMonth();
        currentYear = midWeek.getFullYear();
    }
    renderCalendar();
}

function renderCalendar() {
     const calendarEl = document.getElementById('calendar');
     if(!calendarEl) return;

     let headerText = '';
     let bodyContent = '';

     if (currentView === 'month') {
         headerText = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
         
         bodyContent = `
             <div class="grid grid-cols-7 text-center font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">
                 <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
             </div>
             <div class="grid grid-cols-7 gap-2">
                 ${generateMonthGrid()}
             </div>
         `;
     } else {
         const weekEnd = new Date(currentWeekStart);
         weekEnd.setDate(weekEnd.getDate() + 6);
         
         const startStr = currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
         const endStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
         
         headerText = `${startStr} - ${endStr}`;

         bodyContent = `<div class="space-y-4">${generateWeekList()}</div>`;
     }

     const headerControls = `
         <div class="flex items-center justify-between md:justify-center gap-4 mb-6">
             <button onclick="changePeriod(-1)" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                 <i class="fa-solid fa-chevron-left text-navy"></i>
             </button>
             <h3 class="text-center text-xl md:text-2xl font-serif font-bold text-navy min-w-[200px]">
                 ${headerText}
             </h3>
             <button onclick="changePeriod(1)" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                 <i class="fa-solid fa-chevron-right text-navy"></i>
             </button>
         </div>
     `;

     calendarEl.innerHTML = headerControls + bodyContent;
}

function generateMonthGrid() {
     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
     const firstDay = new Date(currentYear, currentMonth, 1).getDay();
     const today = new Date();
     let html = '';

    for (let i = 0; i < firstDay; i++) { 
        html += '<div class="h-24 md:h-28 bg-transparent"></div>'; 
    }

    for (let day = 1; day <= daysInMonth; day++) {
         const date = new Date(currentYear, currentMonth, day);
         const isToday = date.getDate() === today.getDate() && 
                         date.getMonth() === today.getMonth() && 
                         date.getFullYear() === today.getFullYear();
         
         const dayEvents = currentEvents.filter(e => 
             e.date.getDate() === day &&
             e.date.getMonth() === currentMonth &&
             e.date.getFullYear() === currentYear
         );

         let tooltipHtml = '';
         if (dayEvents.length > 0) {
             const eventDetails = dayEvents.map(e => `
                <div class="mb-3 last:mb-0 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <strong class="text-gold text-sm block">${e.title}</strong>
                    <span class="text-xs text-gray-300 block mb-1">
                        <i class="fa-regular fa-clock mr-1"></i>${e.date.toLocaleTimeString('en-US', { hour: 'numeric', minute:'2-digit'})}
                    </span>
                    <span class="text-xs text-gray-400 block">${e.loc}</span>
                </div>
             `).join('');

             tooltipHtml = `
                <div class="hidden group-hover:block absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-navy text-white p-4 rounded-xl shadow-2xl border-2 border-gold text-left">
                    <h5 class="font-bold text-white text-md mb-2 border-b border-white/20 pb-1">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h5>
                    ${eventDetails}
                    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gold"></div>
                </div>
             `;
         }

         const maxVisible = 2;
         const visibleEvents = dayEvents.slice(0, maxVisible);
         const remainder = dayEvents.length - maxVisible;

         const pillsHtml = visibleEvents.map(e => {
            const style = eventTypeStyles[e.type] || eventTypeStyles.upcoming;
            return `
            <div class="text-[10px] ${style.bg} ${style.text} px-1.5 py-0.5 rounded truncate mb-0.5">
                ${e.title}
            </div>
         `;
         }).join('');

         const moreLabel = remainder > 0 
            ? `<div class="text-[9px] text-center bg-gray-100 text-gray-500 rounded px-1 py-0.5 mt-1 font-bold">+ ${remainder} more</div>` 
            : '';

         const cellClass = isToday ? 'border-2 border-gold bg-gold/5' : 'border border-gray-100 bg-white';
         html += `
             <div class="h-24 md:h-28 ${cellClass} rounded-lg p-2 transition relative group hover:z-30 hover:border-gold hover:shadow-lg cursor-pointer">
                 <span class="font-bold text-sm ${isToday ? 'text-gold' : 'text-gray-700'} block mb-1">${day}</span>
                 
                 <div class="overflow-hidden">
                    ${pillsHtml}
                    ${moreLabel}
                 </div>

                 ${tooltipHtml}
             </div>
         `;
    }
    return html;
}

function generateWeekList() {
     let html = '';
     const today = new Date();
     for(let i = 0; i < 7; i++) {
          const date = new Date(currentWeekStart);
          date.setDate(date.getDate() + i);
          
          const isToday = date.getDate() === today.getDate() && 
                          date.getMonth() === today.getMonth() && 
                          date.getFullYear() === today.getFullYear();
          
          const dayEvents = currentEvents.filter(e => 
              e.date.getDate() === date.getDate() &&
              e.date.getMonth() === date.getMonth() &&
              e.date.getFullYear() === date.getFullYear()
          );

          const cellClass = isToday ? 'bg-gold/5 border-gold' : 'border-gray-200';

          html += `
              <div class="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition border-l-4 ${dayEvents.length > 0 ? 'border-gold' : cellClass} ${isToday ? 'bg-gold/5' : ''}">
                  <div class="w-16 text-center shrink-0">
                      <div class="text-xs uppercase text-gray-500 font-bold">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div class="text-2xl font-serif font-bold ${isToday ? 'text-gold' : 'text-navy'}">${date.getDate()}</div>
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

     const simulatedNow = new Date();
    
    const upcoming = currentEvents
        .filter(e => e.date >= simulatedNow)
        .slice(0, 5); 

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
