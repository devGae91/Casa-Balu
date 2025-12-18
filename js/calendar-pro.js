/* =====================================================
   CASA BALÙ – CALENDARIO PRO (v2.0)
   -----------------------------------------------------
   - Selezione range check-in / check-out
   - Evidenziazione date occupate
   - Calcolo prezzo totale dinamico
   - Compatibile Flatpickr
   - Pronto per iCal / Airbnb / Booking integration
   ===================================================== */

/* ====== CONFIGURAZIONE ====== */
const CONFIG = {
  pricePerNight: 70,
  bookedDatesUrl: 'data/booked-dates.json'
};

/* ====== STATO ====== */
let state = {
  checkIn: null,
  checkOut: null,
  bookedDates: []
};

/* ====== ELEMENTI DOM ====== */
const calendarInput = document.getElementById('booking-calendar');
const priceOutput = document.querySelector('.price-output');
const inputCheckin = document.getElementById('checkin');
const inputCheckout = document.getElementById('checkout');

/* ====== CARICAMENTO DATE BLOCCATE ====== */
async function loadBookedDates() {
  try {
    const res = await fetch(CONFIG.bookedDatesUrl);
    const data = await res.json();
    let dates = [];

    // Unisco bookings + blockedDates
    if (data.bookings) {
      data.bookings.forEach(b => {
        let d = new Date(b.checkin);
        const checkout = new Date(b.checkout);
        while (d < checkout) {
          dates.push(new Date(d));
          d.setDate(d.getDate() + 1);
        }
      });
    }

    if (data.blockedDates) {
      data.blockedDates.forEach(d => dates.push(new Date(d)));
    }

    state.bookedDates = dates;
  } catch (err) {
    console.error('Errore caricamento date:', err);
    state.bookedDates = [];
  }
}

/* ====== FUNZIONE DI BLOCCO DATE ====== */
function isDateBlocked(date) {
  return state.bookedDates.some(d => d.toDateString() === date.toDateString());
}

/* ====== INIZIALIZZAZIONE FLATPICKR ====== */
async function initCalendar() {
  await loadBookedDates();

  flatpickr(calendarInput, {
    mode: "range",
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: state.bookedDates.map(d => {
      return d.toISOString().split('T')[0];
    }),
    onChange: function(selectedDates) {
      state.checkIn = selectedDates[0] || null;
      state.checkOut = selectedDates[1] || null;

      // Aggiorno campi nascosti
      inputCheckin.value = state.checkIn ? state.checkIn.toISOString().split('T')[0] : '';
      inputCheckout.value = state.checkOut ? state.checkOut.toISOString().split('T')[0] : '';

      // Aggiorno prezzo
      updatePrice();
    }
  });
}

/* ====== CALCOLO PREZZO ====== */
function updatePrice() {
  if (state.checkIn && state.checkOut) {
    const diffTime = Math.abs(state.checkOut - state.checkIn);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const total = nights * CONFIG.pricePerNight;
    priceOutput.textContent = `${nights} notte${nights > 1 ? 'i' : ''} – Totale €${total}`;
  } else {
    priceOutput.textContent = '';
  }
}

/* ====== INIT ====== */
document.addEventListener('DOMContentLoaded', initCalendar);
