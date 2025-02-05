const form = document.getElementById("login-form");
const username = document.getElementById("login-username");
const password = document.getElementById("login-password");

form.addEventListener("submit", validate);

function validate(event) {
    let isValid = validateUsername(username);
    isValid = validatePassword(password) && isValid;
    if (!isValid) {
        event.preventDefault();
    }
}

const validateUsername = usernameElement => {
    const usernameValue = username.value.trim();
    console.log(usernameValue.length);
    if (usernameValue.length < 3 || usernameValue.length > 20) {
        return setError(usernameElement, "The username must be between 3 and 20 characters long.");
    }
    return setSuccess(usernameElement);
}

const validatePassword = passwordElement => {
    const passwordValue = passwordElement.value.trim();
    if (!passwordValue) {
        return setError(passwordElement, "Password is required.");
    }
    return setSuccess(passwordElement);
}

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
    errorDisplay.innerHTML = message;

    inputControl.classList.add("error");
    inputControl.classList.remove("success");
    return false;
}

const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
    errorDisplay.innerHTML = '';

    inputControl.classList.add("success");
    inputControl.classList.remove("error");
    return true;
}
