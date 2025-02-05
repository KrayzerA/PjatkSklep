const form = document.getElementById("addproduct-form");
const name = document.getElementById("nazwa");
const price = document.getElementById("cena");

form.addEventListener("submit",  validate);

function validate(event){
    let isValid = validateName(name);
    isValid = validatePrice(price) && isValid;
    if (!isValid) {
        event.preventDefault();
    }
}

const validateName = nameElement => {
    const nameValue = name.value.trim();
    if (nameValue.length < 3 || nameValue.length > 20){
        return setError(nameElement, "Product name must be between 3 and 20 characters long.");
    }
    return setSuccess(nameElement);
}

const validatePrice = priceElement => {
    const priceValue = parseInt(priceElement.value.trim());
    if (!priceValue){
        return setError(priceElement, "Price is required.");
    }
    if (isNaN(priceValue)){
        return setError(priceElement, "Price should be a number.")
    }
    if (priceValue < 0){
        return setError(priceElement, "Price cant be negative.")
    }
    return setSuccess(priceElement);
}

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
    errorDisplay.innerHTML = message;

    inputControl.classList.add("error");
    inputControl.classList.remove("success");
    return false;
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
    errorDisplay.innerHTML = '';

    inputControl.classList.add("success");
    inputControl.classList.remove("error");
    return true;
}

