/* =====================================================
   CASA BALÙ – CALENDARIO PRO v2.0
   ===================================================== */

const CONFIG = {
  monthsToShow: 2,
  minNights: 1,
  bookedDatesUrl: 'data/booked-dates.json'
};

let state = {
  currentMonth: new Date(),
  checkIn: null,
  checkOut: null,
  bookedRanges: [],
  blockedDates: [],
  pricePerNight: 0
};

const calendarEl = document.getElementById('calendar');
const priceEl = document.getElementById('price');
const inputCheckin = document.getElementById('checkin');
const inputCheckout = document.getElementById('checkout');

/* ===== UTIL ===== */
const formatDate = d => d.toISOString().split('T')[0];
const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/* ===== LOAD JSON ===== */
async function loadBookedDates() {
  const res = await fetch(CONFIG.bookedDatesUrl);
  const data = await res.json();

  state.bookedRanges = data.bookings.map(b => ({
    start: new Date(b.checkin),
    end: new Date(b.checkout)
  }));

  state.blockedDates = data.blockedDates.map(d => new Date(d));
  state.pricePerNight = data.meta.pricePerNight;
}

function isBooked(date) {
  return state.bookedRanges.some(r => date >= r.start && date < r.end) ||
         state.blockedDates.some(d => isSameDay(d, date));
}

/* ===== CALENDAR ===== */
function renderCalendar() {
  calendarEl.innerHTML = '';
  const base = new Date(state.currentMonth);

  for (let m = 0; m < CONFIG.monthsToShow; m++) {
    calendarEl.appendChild(renderMonth(new Date(base.getFullYear(), base.getMonth() + m, 1)));
  }
}

function renderMonth(date) {
  const wrap = document.createElement('div');
  wrap.className = 'calendar-month';

  const title = document.createElement('h4');
  title.textContent = date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  wrap.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  ['L','M','M','G','V','S','D'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'calendar-day-name';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;

  for (let i = 0; i < offset; i++) grid.appendChild(document.createElement('div'));

  const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  for (let d = 1; d <= days; d++) {
    const day = new Date(date.getFullYear(), date.getMonth(), d);
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    cell.textContent = d;

    if (isBooked(day)) {
      cell.classList.add('booked');
    } else {
      cell.onclick = () => selectDate(day);
    }

    if (isSameDay(day, state.checkIn)) cell.classList.add('checkin');
    if (isSameDay(day, state.checkOut)) cell.classList.add('checkout');
    if (state.checkIn && state.checkOut && day > state.checkIn && day < state.checkOut) {
      cell.classList.add('in-range');
    }

    grid.appendChild(cell);
  }

  wrap.appendChild(grid);
  return wrap;
}

/* ===== INTERACTION ===== */
function selectDate(date) {
  if (!state.checkIn || state.checkOut) {
    state.checkIn = date;
    state.checkOut = null;
  } else if (date > state.checkIn) {
    state.checkOut = date;
  } else {
    state.checkIn = date;
    state.checkOut = null;
  }

  updateInputs();
  updatePrice();
  renderCalendar();
}

/* ===== PRICE ===== */
function updatePrice() {
  if (state.checkIn && state.checkOut) {
    const nights = Math.round((state.checkOut - state.checkIn) / 86400000);
    priceEl.textContent = `${nights} notti · Totale €${nights * state.pricePerNight}`;
  } else {
    priceEl.textContent = '';
  }
}

/* ===== INPUTS ===== */
function updateInputs() {
  inputCheckin.value = state.checkIn ? formatDate(state.checkIn) : '';
  inputCheckout.value = state.checkOut ? formatDate(state.checkOut) : '';
}

/* ===== NAV ===== */
function addNav() {
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

  nav.append(prev, next);
  calendarEl.before(nav);
}

/* ===== INIT ===== */
(async function () {
  await loadBookedDates();
  addNav();
  renderCalendar();
})();
