import "./style.css";
import { allowedDeductibles, calculatePremium, type Model, type PremiumInput } from "./premium.ts";

const ageInput = document.querySelector<HTMLInputElement>("#age")!;
const deductibleSelect = document.querySelector<HTMLSelectElement>("#deductible")!;
const modelRadios = document.querySelectorAll<HTMLInputElement>('input[name="model"]');
const dentalCheckbox = document.querySelector<HTMLInputElement>("#dental")!;
const monthlyOutput = document.querySelector<HTMLOutputElement>("#monthly")!;
const yearlyOutput = document.querySelector<HTMLOutputElement>("#yearly")!;
const ageError = document.querySelector<HTMLElement>("#age-error")!;

const state: PremiumInput = {
  age: 40,
  deductible: 300,
  model: "standard",
  dental: false,
};

const formatChf = (amount: number) => `CHF ${amount.toFixed(2)}`;

function renderDeductibleOptions() {
  deductibleSelect.innerHTML = allowedDeductibles(state.age)
    .map(
      (deductible) =>
        `<option value="${deductible}" ${deductible === state.deductible ? "selected" : ""}>CHF ${deductible}</option>`,
    )
    .join("");
}

function renderPremium() {
  const premium = calculatePremium(state);
  monthlyOutput.textContent = formatChf(premium.monthly);
  yearlyOutput.textContent = formatChf(premium.yearly);
}

ageInput.addEventListener("input", () => {
  const age = ageInput.valueAsNumber;
  const valid = Number.isInteger(age) && age >= 0 && age <= 120;
  ageError.hidden = valid;
  if (!valid) return;

  state.age = age;
  renderDeductibleOptions();
  renderPremium();
});

deductibleSelect.addEventListener("change", () => {
  state.deductible = Number(deductibleSelect.value);
  renderPremium();
});

for (const radio of modelRadios) {
  radio.addEventListener("change", () => {
    state.model = radio.value as Model;
    renderPremium();
  });
}

dentalCheckbox.addEventListener("change", () => {
  state.dental = dentalCheckbox.checked;
  renderPremium();
});

renderDeductibleOptions();
renderPremium();
