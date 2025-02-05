const validateFirstName = (firstName) => {
    if (!firstName){
        return 'FirstName is required.'
    }
    const regex = /^[a-zA-Z]{3,50}$/;
    if (!regex.test(firstName)){
        return 'Firstname should contain only letters and have length between 3 and 50 characters.'
    }
    return ''
}
const validateLastName = (lastName) => {
    if (!lastName){
        return 'LastName is required.'
    }
    const regex = /^[a-zA-Z]{3,50}$/;
    if (!regex.test(lastName)){
        return 'LastName should contain only letters and have length between 3 and 50 characters.'
    }
    return ''
}

module.exports = {
    validateLastName,
    validateFirstName
}