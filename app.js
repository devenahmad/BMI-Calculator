// Selecting the elements from the DOM
const weight = document.querySelector("#weight");
const height = document.querySelector("#height");

const bmiForm = document.querySelector(".bmi-form");

const bmiVal = document.querySelector("#bmi-value");
const bmiCat = document.querySelector("#bmi-category");

const gaugeText = document.querySelector(".gauge-text");
const donutSegment = document.querySelector(".donut-segment");
const gaugeAnimation = document.querySelector(".gauge-animation");

const weightWrapper = weight.closest(".input-wrapper");
const heightWrapper = height.closest(".input-wrapper");

const weightError = document.querySelector("#weight-error");
const heightError = document.querySelector("#height-error");

const legendItems = document.querySelectorAll(".bmi-legend li");

const metricBtn = document.querySelector("#metric-btn");
const imperialBtn = document.querySelector("#imperial-btn");

const weightUnit = document.querySelector("#weight-unit");
const heightUnit = document.querySelector("#height-unit");

const themeToggle = document.querySelector("#theme-toggle");

const savedTheme = localStorage.getItem("theme");

let currentUnit = "metric";

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.textContent = "☀︎ Light";
}


function showError(wrapper, errorElement, inputElement, message) {

    wrapper.classList.add("error");
    errorElement.textContent = message;
    inputElement.setAttribute("aria-invalid", "true");
    inputElement.focus();
}


function clearErrors() {

    weightWrapper.classList.remove("error");
    heightWrapper.classList.remove("error");

    weightError.textContent = "";
    heightError.textContent = "";

    weight.setAttribute("aria-invalid", "false");
    height.setAttribute("aria-invalid", "false");

}


function getCategoryColor(categoryClass) {

    const colors = {
        underweight: "var(--underweight-color)",
        normal: "var(--normal-color)",
        overweight: "var(--overweight-color)",
        obese: "var(--obese-color)"
    };

    return colors[categoryClass];

}


function updateActiveLegend(categoryClass) {

    legendItems.forEach((item) => {

        item.classList.remove("active");

    });


    const activeItem = document.querySelector(
        `.bmi-legend .${categoryClass}`
    );

    if (activeItem) {
        activeItem.classList.add("active");
    }

}

// Updating by Adjusting/ Animating SVG Values
function updateGauge(bmi) {

    // BMI >= 40 => 100%.
    const gaugeProgress = Math.min((bmi / 40) * 100, 100);

    const dashLength = gaugeProgress;
    const remainingLength = 200 - dashLength;


    // Reset animation
    gaugeAnimation.setAttribute(
        "values",
        `0 200; 0 200; ${dashLength} ${remainingLength}`
    );


    // Start from empty
    donutSegment.style.strokeDasharray = "0 200";


    // Restart animation
    gaugeAnimation.beginElement();


    // Keep final position after animation
    setTimeout(() => {

        donutSegment.style.strokeDasharray =
            `${dashLength} ${remainingLength}`;

    }, 1000);

}


function switchToMetric() {
    currentUnit = "metric";

    metricBtn.classList.add("active");
    imperialBtn.classList.remove("active");

    metricBtn.setAttribute("aria-pressed", "true");
    imperialBtn.setAttribute("aria-pressed", "false");

    weightUnit.textContent = "kg";
    heightUnit.textContent = "cm";

    document.querySelector(".input-description").textContent = "Enter your weight in kilograms";


    document.querySelector("#height").closest(".input-group")
    .querySelector(".input-description").textContent = "Enter your height in centimeters";

    weight.min = "1";
    weight.max = "300";
    weight.step = "0.1";
    weight.placeholder = "Enter your weight";

    height.min = "50";
    height.max = "250";
    height.step = "0.1";
    height.placeholder = "Enter your height";

    weight.value = "";
    height.value = "";

    clearErrors();
}

function switchToImperial() {
    currentUnit = "imperial";

    imperialBtn.classList.add("active");
    metricBtn.classList.remove("active");

    imperialBtn.setAttribute("aria-pressed", "true");
    metricBtn.setAttribute("aria-pressed", "false");

    weightUnit.textContent = "lb";
    heightUnit.textContent = "in";

    document.querySelector("#weight").closest(".input-group")
    .querySelector(".input-description").textContent = "Enter your weight in pounds";



    document.querySelector("#height").closest(".input-group")
    .querySelector(".input-description").textContent = "Enter your height in total inches";

    weight.min = "2.2";
    weight.max = "661.4";
    weight.step = "0.1";
    weight.placeholder = "Enter your weight";

    height.min = "19.7";
    height.max = "98.4";
    height.step = "0.1";
    height.placeholder = "Enter your height";

    weight.value = "";
    height.value = "";

    clearErrors();
}

metricBtn.addEventListener("click", () => {

    if (currentUnit === "metric") {
        return;
    }
    switchToMetric();
});

imperialBtn.addEventListener("click", () => {

    if (currentUnit === "imperial") {
        return;
    }
    switchToImperial();
});

bmiForm.addEventListener("submit", (e) => {

    e.preventDefault();


    // Clear previous errors
    clearErrors();


    // Get values
    const weightVal = parseFloat(weight.value);
    const heightVal = parseFloat(height.value);


    // Height & Weight Validation
    if (currentUnit === "metric") {
        if (
            isNaN(weightVal) ||
            weightVal < 30 ||
            weightVal > 300
        ) {
            showError(weightWrapper, weightError, weight, "Enter a weight between 30 and 300 kg.");
            return;
        }

        if (
            isNaN(heightVal) ||
            heightVal < 120 ||
            heightVal > 250
        ) {
            showError(heightWrapper, heightError, height, "Enter a height between 120 and 250 cm.");
            return;
        }
    }

        if (currentUnit === "imperial") {
        if (
            isNaN(weightVal) ||
            weightVal < 66.1 ||
            weightVal > 661.4
        ) {
            showError(weightWrapper, weightError, weight, "Enter a weight between 66.1 and 661.4 lb.");
            return;
        }

        if (
            isNaN(heightVal) ||
            heightVal < 47.2 ||
            heightVal > 98.4
        ) {
            showError(heightWrapper, heightError, height, "Enter a height between 47.2 and 98.4 in.");
            return;
        }
    }

    let bmi;

    if (currentUnit === "metric") {
        // Convert height to meters
        const heightInMeters = heightVal / 100;

        // BMI = weight / height²
        bmi = weightVal / (heightInMeters * heightInMeters);
    }
    
    else {
        // Imperial BMI Formula
        bmi = 703 * weightVal / (heightVal * heightVal);
    }


    // Display BMI
    const formattedBMI = bmi.toFixed(2);

    bmiVal.textContent = formattedBMI;
    gaugeText.textContent = formattedBMI;


    // Determine Category
    let category = "";
    let categoryClass = "";


    if (bmi < 18.5) {

        category = "Underweight";
        categoryClass = "underweight";

    }
    else if (bmi < 25) {

        category = "Normal";
        categoryClass = "normal";

    }
    else if (bmi < 30) {

        category = "Overweight";
        categoryClass = "overweight";

    }
    else {

        category = "Obese";
        categoryClass = "obese";

    }


    // Update Category Text
    bmiCat.textContent = category;


    // Update Category Color
    bmiCat.className = categoryClass;

    const categoryColor = getCategoryColor(categoryClass);

    donutSegment.style.stroke = categoryColor;
    gaugeText.style.fill = categoryColor;


    updateActiveLegend(categoryClass);

    updateGauge(bmi);

});

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeToggle.textContent = isDark ? "☀︎ Light" : "⏾ Dark";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});