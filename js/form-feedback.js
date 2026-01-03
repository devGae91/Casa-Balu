document.querySelectorAll('.booking-form input, .booking-form textarea')
  .forEach(field => {

    field.addEventListener('input', () => {
      if (field.checkValidity()) {
        field.classList.add('valid');
        field.classList.remove('invalid');
      } else {
        field.classList.remove('valid');
      }
    });

    field.addEventListener('invalid', () => {
      field.classList.add('invalid');
      field.classList.remove('valid');
    });
});
