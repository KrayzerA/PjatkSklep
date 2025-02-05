const validateName = (name) => {
    if (!name){
        return 'Subject name is required.'
    }
    if (!name.trim()){
        return 'Incorrect name.'
    }
    const regex = /^[a-zA-Z0-9\s]{3,50}$/;
    if (!regex.test(name)){
        return 'Name should contain only letters and numbers and have length between 3 and 50 characters.'
    }
    return ''
}

const validateAbbreviation = (abbr) => {
    if (!abbr){
        return 'Subject abbreviation is required.'
    }
    const regex = /^[a-zA-Z0-9]{3,5}$/;
    if (!regex.test(abbr)){
        return 'Abbreviation should contain only letters and numbers and have length between 3 and 5 characters.'
    }
    return ''
}


module.exports = {
    validateName,
    validateAbbreviation
}