const steps = document.querySelectorAll(".form-step");
const nextButtons = document.querySelectorAll(".next-button");
const prevButtons = document.querySelectorAll(".prev-button");
const billingToggle = document.getElementById("billing-toggle");
const planPrices = document.querySelectorAll(".price");
const bonusLabels = document.querySelectorAll(".bonus");

let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });

  const stepCircles = document.querySelectorAll(".step-numbers");
  stepCircles.forEach((circle, i) => {
    circle.classList.toggle("active", i === index);
  });

  if (index === 3) updateSummary();
}

nextButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });
});

prevButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });
});

billingToggle.addEventListener("change", () => {
  const isYearly = billingToggle.checked;
  planPrices.forEach((priceEl) => {
    priceEl.textContent = isYearly
      ? priceEl.getAttribute("data-yearly")
      : priceEl.getAttribute("data-monthly");
  });

  bonusLabels.forEach((bonusEl) => {
    bonusEl.classList.toggle("hidden", !isYearly);
  });
});

document.querySelector(".change-plan").addEventListener("click", () => {
  currentStep = 1;
  showStep(currentStep);
});

function updateSummary() {
  const isYearly = billingToggle.checked;
  const planInput = document.querySelector("input[name='plan']:checked");
  const planCard = planInput.closest(".plan-card");
  const planName = planInput.value;
  const planPriceEl = planCard.querySelector(".price");
  const planPrice = planPriceEl.textContent;

  // Update plan details in summary
  document.getElementById("summary-plan-name").textContent = `${planName} (${
    isYearly ? "Yearly" : "Monthly"
  })`;
  document.getElementById("summary-plan-price").textContent = planPrice;

  // Add-ons
  const addonsContainer = document.getElementById("summary-addons");
  addonsContainer.innerHTML = "";
  let total = parseFloat(planPrice.replace(/[^0-9.]/g, ""));

  const addonCheckboxes = document.querySelectorAll(
    "input[name='addons']:checked"
  );
  addonCheckboxes.forEach((addon) => {
    const card = addon.closest(".addon-card");
    const name = addon.value;
    const priceText = card.querySelector(".addon-price").textContent;
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

    const addonSummary = document.createElement("div");
    addonSummary.classList.add("addon-summary");
    addonSummary.innerHTML = `
      <span>${name}</span>
      <span>${priceText}</span>
    `;
    addonsContainer.appendChild(addonSummary);

    total += price;
  });

  // Update total
  document.getElementById("total-period").textContent = isYearly
    ? "per year"
    : "per month";
  document.getElementById("total-price").textContent = `$${total}${
    isYearly ? "/yr" : "/mo"
  }`;
}

// Initialize
showStep(currentStep);
