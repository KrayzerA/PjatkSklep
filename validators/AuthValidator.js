const validateLogin = (login) => {
    if (!login) {
        return 'Login is required.';
    }
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!regex.test(login)) {
        return 'Login should contain only letters and numbers and length should be between 3 and 20 characters.'
    }
    return '';
}

const validateEmail = (email) => {
    if (!email) {
        return 'Email is required.';
    }
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(email)) {
        return 'Email is not valid.';
    }
    return '';
}

const validatePassword = (password) => {
    if (!password) {
        return 'Password is required.'
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*+\-\/.,{}\[\]()\;:\?<>\"'_])[A-Za-z\d~!@#$%^&*+\-\/.,{}\[\]()\;:\?<>\"'_]{8,}$/;
    if (!regex.test(password)) {
        return 'The password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (~!@#$%^&*+-/.,{}[]();:?<>\\"_).';
    }
    return '';
}

module.exports = {
    validateEmail,
    validateLogin,
    validatePassword
}