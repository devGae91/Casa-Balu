document.addEventListener("DOMContentLoaded", async () => {

  /* ===============================
     ELEMENTI DOM
  =============================== */
  const calendarInput = document.getElementById("date-range");
  const guestsSelect = document.getElementById("guests");
  const priceBox = document.getElementById("price");
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");

  /* ===============================
     PREZZI
  =============================== */
  const prices = {
    1: 70,
    2: 70,
    3: 100,
    4: 120
  };

  /* ===============================
     DATE OCCUPATE
  =============================== */
  let disabledRanges = [];

  try {
    const res = await fetch("data/bookings.json");
    const data = await res.json();

    disabledRanges = data.map(b => ({
      from: b.from,
      to: b.to
    }));
  } catch (e) {
    console.warn("Nessuna data occupata caricata");
  }

  /* ===============================
     FLATPICKR INIT
  =============================== */
  const fp = flatpickr(calendarInput, {
    mode: "range",
    dateFormat: "Y-m-d",
    minDate: "today",
    inline: true,
    showMonths: 1,
    disable: disabledRanges,
    locale: "it",

    onChange: (selectedDates) => {
      if (selectedDates.length === 2) {
        updatePrice(selectedDates);
      }
    }
  });

  /* ===============================
     RICALCOLO PREZZO
  =============================== */
  function updatePrice(dates) {
    const [start, end] = dates;

    const nights = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    const guests = guestsSelect.value;
    const total = nights * prices[guests];

    priceBox.innerHTML = `
      ${nights} notti · €${prices[guests]}/notte<br>
      <strong>Totale: € ${total}</strong>
    `;

    checkinInput.value = fp.formatDate(start, "Y-m-d");
    checkoutInput.value = fp.formatDate(end, "Y-m-d");
  }

  /* ===============================
     CAMBIO OSPITI
  =============================== */
  guestsSelect.addEventListener("change", () => {
    if (fp.selectedDates.length === 2) {
      updatePrice(fp.selectedDates);
    }
  });

});
