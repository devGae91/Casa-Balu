/* =====================================================
   CASA BALÙ – CALENDARIO PREMIUM (v1.0)
   -----------------------------------------------------
   - Multi-mese reale (stile Booking/Airbnb)
   - Selezione range check-in / check-out
   - Evidenziazione fascia completa
   - Date occupate bloccate (da JSON esterno)
   - Pronto per futura integrazione Airbnb/Booking (iCal)
   ===================================================== */

/* ====== CONFIGURAZIONE ====== */
const CONFIG = {
  pricePerNight: 60,
  minNights: 1,
  monthsToShow: 2,
  bookedDatesUrl: 'data/booked-dates.json' // FUTURO: iCal / API
};

/* ====== STATO ====== */
let state = {
  currentMonth: new Date(),
  checkIn: null,
  checkOut: null,
  bookedDates: []
};

/* ====== ELEMENTI DOM ====== */
const calendarEl = document.getElementById('calendar');
const priceEl = document.getElementById('price');
const inputCheckin = document.getElementById('checkin');
const inputCheckout = document.getElementById('checkout');

/* ====== UTIL ====== */
const formatDate = d => d.toISOString().split('T')[0];
const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/* ====== CARICAMENTO DATE OCCUPATE ====== */
async function loadBookedDates() {
  try {
    const res = await fetch(CONFIG.bookedDatesUrl);
    const data = await res.json();
    state.bookedDates = data.map(d => new Date(d));
  } catch (e) {
    console.warn('Impossibile caricare le date occupate', e);
    state.bookedDates = [];
  }
}

function isBooked(date) {
  return state.bookedDates.some(d => isSameDay(d, date));
}

/* ====== GENERAZIONE CALENDARIO ====== */
function renderCalendar() {
  calendarEl.innerHTML = '';
  const base = new Date(state.currentMonth);

  for (let m = 0; m < CONFIG.monthsToShow; m++) {
    const monthDate = new Date(base.getFullYear(), base.getMonth() + m, 1);
    calendarEl.appendChild(renderMonth(monthDate));
  }
}

function renderMonth(date) {
  const wrapper = document.createElement('div');
  wrapper.className = 'calendar-month';

  const title = document.createElement('h4');
  title.textContent = date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  wrapper.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  ['L', 'M', 'M', 'G', 'V', 'S', 'D'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'calendar-day-name';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;

  for (let i = 0; i < startOffset; i++) {
    grid.appendChild(document.createElement('div'));
  }

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(date.getFullYear(), date.getMonth(), d);
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    cell.textContent = d;

    if (isBooked(dayDate)) {
      cell.classList.add('booked');
    } else {
      cell.addEventListener('click', () => onDayClick(dayDate));
    }

    if (isSameDay(dayDate, state.checkIn)) cell.classList.add('checkin');
    if (isSameDay(dayDate, state.checkOut)) cell.classList.add('checkout');
    if (state.checkIn && state.checkOut && dayDate > state.checkIn && dayDate < state.checkOut) {
      cell.classList.add('in-range');
    }

    grid.appendChild(cell);
  }

  wrapper.appendChild(grid);
  return wrapper;
}

/* ====== INTERAZIONE ====== */
function onDayClick(date) {
  if (!state.checkIn || (state.checkIn && state.checkOut)) {
    state.checkIn = date;
    state.checkOut = null;
  } else if (date > state.checkIn) {
    if (hasBookedBetween(state.checkIn, date)) {
      alert('Il periodo selezionato include date non disponibili');
      return;
    }
    state.checkOut = date;
  } else {
    state.checkIn = date;
    state.checkOut = null;
  }

  updateInputs();
  updatePrice();
  renderCalendar();
}

function hasBookedBetween(start, end) {
  let d = addDays(start, 1);
  while (d < end) {
    if (isBooked(d)) return true;
    d = addDays(d, 1);
  }
  return false;
}

/* ====== PREZZO ====== */
function updatePrice() {
  if (state.checkIn && state.checkOut) {
    const nights = Math.round((state.checkOut - state.checkIn) / (1000 * 60 * 60 * 24));
    const total = nights * CONFIG.pricePerNight;
    priceEl.textContent = `${nights} notti – Totale €${total}`;
  } else {
    priceEl.textContent = '';
  }
}

/* ====== INPUT ====== */
function updateInputs() {
  inputCheckin.value = state.checkIn ? formatDate(state.checkIn) : '';
  inputCheckout.value = state.checkOut ? formatDate(state.checkOut) : '';
}

/* ====== NAVIGAZIONE ====== */
function addNavigation() {
  const nav = document.createElement('div');
  nav.className = 'calendar-nav';

  const prev = document.createElement('button');
  prev.textContent = '‹';
  prev.onclick = () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    renderCalendar();
  };

  const next = document.createElement('button');
  next.textContent = '›';
  next.onclick = () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    renderCalendar();
  };

  nav.appendChild(prev);
  nav.appendChild(next);
  calendarEl.before(nav);
}

/* ====== INIT ====== */
(async function initCalendar() {
  await loadBookedDates();
  addNavigation();
  renderCalendar();
})();
