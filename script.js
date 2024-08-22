"use strict";

const unitRadioButtons = document.querySelectorAll("input[type='radio']");
const unitRadioLabels = document.querySelectorAll(".radio-label");
const metricSection = document.querySelector(".metric-measurements");
const imperialSection = document.querySelector(".imperial-measurements");
const resultSection = document.querySelector(".bmi-result-container");
const metricHeightInput = document.querySelector("#metric-height");
const metricWeightInput = document.querySelector("#metric-weight");
const imperialHeightFeetInput = document.querySelector("#height-feet");
const imperialHeightInchesInput = document.querySelector("#height-inch");
const imperialWeightStonesInput = document.querySelector("#weight-stone");
const imperialWeightPoundsInput = document.querySelector("#weight-pounds");
const bmiCalculatorForm = document.querySelector("form");
const numberFields = document.querySelectorAll("input[type='number']");
const metricNumberFields = document.querySelectorAll(".metric-input");
const impreialNumberFields = document.querySelectorAll(".imperial-input");

class BmiCalculator {
  #idealMinBmiRange = 18.5;
  #idealMaxBmiRange = 25;
  #kgValue = 0.453592;
  constructor() {
    this._initializeEventListeners();
  }

  // Event listeners for form input and radio button selection
  _initializeEventListeners() {
    unitRadioLabels.forEach((label, index) => {
      label.addEventListener(
        "click",
        this._toggleMeasurementUnits.bind(this, unitRadioButtons[index].value)
      );
    });
    unitRadioButtons.forEach((radioBtn, index) => {
      radioBtn.addEventListener(
        "click",
        this._toggleMeasurementUnits.bind(this, unitRadioButtons[index].value)
      );
    });
    bmiCalculatorForm.addEventListener(
      "input",
      this._validateAndRenderInput.bind(this)
    );
  }

  _toggleMeasurementUnits(unitType) {
    switch (unitType) {
      case "metric":
        metricSection.classList.remove("hide");
        imperialSection.classList.remove("show");
        this._clearUI();
        break;
      case "imperial":
        metricSection.classList.add("hide");
        imperialSection.classList.add("show");
        this._clearUI();
        break;
    }
  }

  // Validation logic and rendering the result
  _validateAndRenderInput() {
    const metricInputs = Array.from(metricNumberFields);
    const imperialInputs = Array.from(impreialNumberFields);
    const metricOption = unitRadioButtons[0].checked;
    const imperialOption = unitRadioButtons[1].checked;

    if (metricOption && this._inputs(metricInputs)) {
      this._getMetricBMI();
    } else if (imperialOption && this._inputs(imperialInputs)) {
      this._getImperialBMI();
    }
  }

  _inputs(element) {
    return element.every((input) => +input.value > 0);
  }

  // BMI calculation logic for metric units
  _getMetricBMI() {
    const metricHeight = +metricHeightInput.value;
    const metricWeight = +metricWeightInput.value;
    const heightIntoMeter = metricHeight / 100;
    const bmiValue = metricWeight / heightIntoMeter ** 2;

    const idealMinWeightKg = this.#idealMinBmiRange * heightIntoMeter ** 2;
    const idealMaxWeightKg = this.#idealMaxBmiRange * heightIntoMeter ** 2;
    const idealWeightRange = [
      idealMinWeightKg.toFixed(1),
      idealMaxWeightKg.toFixed(1),
    ];

    return this._bmiCategoryDeterminer(
      bmiValue.toFixed(1),
      idealWeightRange[0],
      idealWeightRange[1]
    );
  }

  // BMI calculation logic for imperial units
  _getImperialBMI() {
    const heightInFeet = +imperialHeightFeetInput.value;
    const heightInInches = +imperialHeightInchesInput.value;
    const weightInStones = +imperialWeightStonesInput.value;
    const weightInPounds = +imperialWeightPoundsInput.value;

    const totalHeightInInches = heightInFeet * 12 + heightInInches;
    const totalWeightInPounds = weightInStones * 14 + weightInPounds;

    const bmiValue = (totalWeightInPounds * 703) / totalHeightInInches ** 2;

    const idealMinWeightLbs =
      (totalHeightInInches ** 2 * this.#idealMinBmiRange) / 703;
    const idealMaxWeightLbs =
      (totalHeightInInches ** 2 * this.#idealMaxBmiRange) / 703;

    const idealMinWeightInKg = idealMinWeightLbs * this.#kgValue;
    const idealMaxWeightInKg = idealMaxWeightLbs * this.#kgValue;

    return this._bmiCategoryDeterminer(
      bmiValue.toFixed(1),
      idealMinWeightInKg.toFixed(1),
      idealMaxWeightInKg.toFixed(1)
    );
  }

  _clearUI() {
    resultSection.innerHTML = `
    <div class="welcome-message">
    <h4>Welcome!</h4>
    <p>
    Enter your height and weight and you'll see your BMI result
    here
    </p>
    </div>`;
    numberFields.forEach((input) => {
      input.value = "";
    });
  }

  _bmiCategoryDeterminer(bmiValue, minIdealWeight, maxIdealWeight) {
    if (
      bmiValue >= this.#idealMinBmiRange &&
      bmiValue < this.#idealMaxBmiRange
    ) {
      this._bmiResultUpdater(
        bmiValue,
        "Healthy weight",
        minIdealWeight,
        maxIdealWeight
      );
    } else if (bmiValue >= this.#idealMaxBmiRange) {
      this._bmiResultUpdater(
        bmiValue,
        "Overweight",
        minIdealWeight,
        maxIdealWeight
      );
    } else {
      this._bmiResultUpdater(
        bmiValue,
        "Underweight",
        minIdealWeight,
        maxIdealWeight
      );
    }
  }

  _bmiResultUpdater(bmiScore, weightCategory, minWeight, maxWeight) {
    resultSection.innerHTML = `
    <div class='bmi-result-section'>
    <div class='bmi-result-content'> 
    <p>Your BMI is...</p>
    <h4 class='bmi-value'>${bmiScore}</h4>
    </div>
    <p class='bmi-message'>Your BMI suggests you're a ${weightCategory}. Your ideal weight is between <strong>${minWeight}kgs - ${maxWeight}kgs</strong></p>
    </div>
    `;
  }
}

const bmi = new BmiCalculator();
