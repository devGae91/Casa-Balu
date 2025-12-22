const translations = {
  it: {
    title: "Casa Balù",
    subtitle: "Un rifugio caldo e curato a Osio Sotto.",
    booking: "Verifica disponibilità",
    experience_title: "Un’esperienza autentica",
    experience_text_1: "Casa Balù è pensata per chi cerca tranquillità e comfort.",
    experience_text_2: "Zona silenziosa e strategica vicino Bergamo e Milano.",
    room_title: "La camera",
    room_text_1: "Letto matrimoniale e divano letto, fino a 4 ospiti.",
    room_text_2: "Comfort totale per relax e lavoro.",
    services_title: "Servizi inclusi",
    service_1: "Colazione inclusa",
    service_2: "Wi-Fi veloce",
    service_3: "Animali ammessi (+15€)",
    service_4: "Posizione strategica",
    service_5: "Ambiente silenzioso",
    prices_title: "Prezzi",
    pet_fee: "Animali: supplemento 15 €",
    booking_title: "Disponibilità e prenotazione",
    calendar_title: "Seleziona le date",
    guests_label: "Numero ospiti",
    form_title: "Richiesta di prenotazione",
    send: "Invia richiesta"
  },
  en: {
    title: "Casa Balù",
    subtitle: "A warm and comfortable retreat in Osio Sotto.",
    booking: "Check availability",
    experience_title: "An authentic experience",
    experience_text_1: "Casa Balù is designed for peace and comfort.",
    experience_text_2: "Quiet and strategic location near Bergamo and Milan.",
    room_title: "The room",
    room_text_1: "Double bed and sofa bed, up to 4 guests.",
    room_text_2: "Perfect for rest and work.",
    services_title: "Included services",
    service_1: "Breakfast included",
    service_2: "Fast Wi-Fi",
    service_3: "Small pets allowed (+€15)",
    service_4: "Strategic location",
    service_5: "Quiet environment",
    prices_title: "Prices",
    pet_fee: "Pets: €15 supplement",
    booking_title: "Availability & booking",
    calendar_title: "Select dates",
    guests_label: "Guests",
    form_title: "Booking request",
    send: "Send request"
  }
};

document.querySelectorAll(".lang-switch button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".lang-switch button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const lang = btn.dataset.lang;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  });
});
