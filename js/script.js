// Global
const stepsEl = document.querySelectorAll(".form-step");
const nextButtonsEl = document.querySelectorAll(".next-button");
const prevButtonsEl = document.querySelectorAll(".prev-button");
const billingToggleEl = document.getElementById("billing-toggle");
const planPricesEl = document.querySelectorAll(".price");
const freeLabelsEl = document.querySelectorAll(".free");
const stepCirclesEl = document.querySelectorAll(".step-numbers");
const changePlanBtnEl = document.querySelector(".change-plan");
const planCardsEl = document.querySelectorAll(".plan-card");
const summaryPlanNameEl = document.getElementById("summary-plan-name");
const summaryPlanPriceEl = document.getElementById("summary-plan-price");
const addonsContainerEl = document.getElementById("summary-addons");
const totalPeriodEl = document.getElementById("total-period");
const totalPriceEl = document.getElementById("total-price");
const formStep1El = document.querySelector("#step-1 form");

let currentStep = 0;

// function that show the selected step and active circle
function showStep(index) {
  stepsEl.forEach((stepEl, i) => {
    stepEl.classList.toggle("active", i === index);
  });

  stepCirclesEl.forEach((circleEl, i) => {
    circleEl.classList.toggle("active", i === index);
  });

  if (index === 3) updateSummary();
}

// step 1 validation and next step function
function handleNextStep() {
  if (currentStep === 0 && !formStep1El.checkValidity()) {
    formStep1El.reportValidity();
    return;
  }

  if (currentStep < stepsEl.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

// Go to previous step function
function handlePrevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// Toggle for yearly and monthly
function toggleBillingMode() {
  const isYearly = billingToggleEl.checked;

  planPricesEl.forEach((priceEl) => {
    priceEl.textContent = isYearly
      ? priceEl.getAttribute("data-yearly")
      : priceEl.getAttribute("data-monthly");
  });

  freeLabelsEl.forEach((freeEl) => {
    freeEl.classList.toggle("hidden", !isYearly);
  });
}

// go to step 2 to change selected plan
function changePlan() {
  currentStep = 1;
  showStep(currentStep);
}

// show active on selected plan card
function handlePlanSelection() {
  planCardsEl.forEach((cardEl) => {
    cardEl.classList.remove("active");
  });
  this.closest(".plan-card").classList.add("active");
}

// Calculate and display selected plan and add-ons summary
function updateSummary() {
  const isYearly = billingToggleEl.checked;
  const planInputEl = document.querySelector("input[name='plan']:checked");
  const planCardEl = planInputEl.closest(".plan-card");
  const planName = planInputEl.value;
  const planPriceText = planCardEl.querySelector(".price").textContent;

  summaryPlanNameEl.textContent = `${planName} (${
    isYearly ? "Yearly" : "Monthly"
  })`;
  summaryPlanPriceEl.textContent = planPriceText;

  // Remove old add-ons summary
  addonsContainerEl.innerHTML = "";

  // 🧼 Clean manual split method: remove $ and suffix
  const basePrice = parseFloat(planPriceText.split("/")[0].replace("$", ""));
  let total = basePrice;

  document
    .querySelectorAll("input[name='addons']:checked")
    .forEach((addonEl) => {
      const addonCardEl = addonEl.closest(".addon-card");
      const addonName = addonEl.value;
      const addonPriceText =
        addonCardEl.querySelector(".addon-price").textContent;
      const addonPrice = parseFloat(
        addonPriceText.split("/")[0].replace("$", "")
      );

      const addonSummaryEl = document.createElement("div");
      addonSummaryEl.classList.add("addon-summary");
      addonSummaryEl.innerHTML = `<span>${addonName}</span><span>${addonPriceText}</span>`;
      addonsContainerEl.appendChild(addonSummaryEl);

      total += addonPrice;
    });

  totalPeriodEl.textContent = isYearly ? "per year" : "per month";
  totalPriceEl.textContent = `$${total}${isYearly ? "/yr" : "/mo"}`;
}

// EventListeners
nextButtonsEl.forEach((btnEl) => {
  btnEl.addEventListener("click", handleNextStep);
});

prevButtonsEl.forEach((btnEl) => {
  btnEl.addEventListener("click", handlePrevStep);
});

billingToggleEl.addEventListener("change", toggleBillingMode);
changePlanBtnEl.addEventListener("click", changePlan);

planCardsEl.forEach((cardEl) => {
  const radioEl = cardEl.querySelector("input[type='radio']");
  radioEl.addEventListener("change", handlePlanSelection);
});

stepCirclesEl.forEach((circleEl, index) => {
  circleEl.addEventListener("click", () => {
    currentStep = index;
    showStep(currentStep);
  });
});

// Initialize the first step
showStep(currentStep);
