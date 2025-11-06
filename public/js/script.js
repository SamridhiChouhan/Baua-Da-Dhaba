// for clientside-validation
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// For view cart
async function addToCart(id) {
  const res = await fetch(`/cart/add/${id}`, {
    method: "POST",
  });
  const data = await res.json();
  if (data.success) {
    const msg = document.getElementById("cart-message");
    msg.style.display = "block";
    msg.innerHTML = `View Cart <small>(${data.cartCount})</small>`;
  } else {
    alert("Failed to add item: " + data.message);
  }
}
