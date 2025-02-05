
const form = document.getElementById("register-form");
const email = document.getElementById("register-email");
const password = document.getElementById("register-password");
const username = document.getElementById("register-username");
form.addEventListener("submit", validate)

function validate(event) {
    let isValid = validateEmail(email);
    isValid = validateUsername(username) && isValid;
    isValid = validatePassword(password) && isValid;
    if (!isValid) {
        event.preventDefault();
    }
}

const validateEmail = emailElement => {
    const emailValue = emailElement.value.trim();
    if (!emailValue) {
        return setError(emailElement, "Email is required.");
    }
    if (!isValidEmailRegex(emailValue)) {
        return setError(emailElement, "Wrong email address.");
    }
    return setSuccess(emailElement)
}

const isValidEmailRegex = email => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
}

const validateUsername = usernameElement => {
    const usernameValue = usernameElement.value.trim();
    if (!usernameValue) {
        return setError(usernameElement, "Username is required.");
    }
    if (!isValidUsernameRegex(usernameValue)) {
        return setError(usernameElement, "The username must be between 3 and 20 characters long and can only contain letters, numbers and the underscore character (_).");
    }
    return setSuccess(usernameElement);
}

const isValidUsernameRegex = username => {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
}

const validatePassword = passwordElement => {
    const passwordValue = passwordElement.value.trim();
    if (!passwordValue) {
        return setError(passwordElement, "Password is required.");
    }
    if (!isValidPasswordRegex(passwordValue)) {
        return setError(passwordElement, "The password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (~!@#$%^&*+-/.,{}[]();:?<>\"_).");
    }
    return setSuccess(passwordElement);
}

const isValidPasswordRegex = password => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*+\-\/.,{}\[\]()\;:\?<>\"'_])[A-Za-z\d~!@#$%^&*+\-\/.,{}\[\]()\;:\?<>\"'_]{8,}$/;
    return regex.test(password);
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