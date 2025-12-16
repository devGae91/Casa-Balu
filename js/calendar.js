const calendar = document.getElementById("calendar");
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const priceOutput = document.getElementById("price");

let startDate = null;
let endDate = null;

const pricePerNight = 85;

const blockedDates = [
  "2025-02-20",
  "2025-02-21"
];

function renderCalendar() {
  calendar.innerHTML = "";

  for (let d = 1; d <= 30; d++) {
    const day = document.createElement("div");
    const date = `2025-02-${String(d).padStart(2, "0")}`;

    day.className = "day";
    day.textContent = d;

    if (blockedDates.includes(date)) {
      day.classList.add("blocked");
    } else {
      day.addEventListener("click", () => selectDate(date, day));
    }

    calendar.appendChild(day);
  }
}

function selectDate(date, element) {
  if (!startDate || endDate) {
    startDate = date;
    endDate = null;
    clearSelection();
    element.classList.add("selected");
  } else {
    endDate = date;
    element.classList.add("selected");
    updateForm();
    calculatePrice();
  }
}

function clearSelection() {
  document.querySelectorAll(".day").forEach(d =>
    d.classList.remove("selected")
  );
}

function calculatePrice() {
  const nights = Math.abs(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  if (nights > 0) {
    priceOutput.textContent = `Prezzo stimato: €${nights * pricePerNight}`;
  }
}

function updateForm() {
  checkinInput.value = startDate;
  checkoutInput.value = endDate;
}

renderCalendar();
