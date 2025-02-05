const validatePrice = (price) => {
    if (!price){
        return 'Price is required.'
    }
    if (isNaN(price)){
        return 'Price should be a number.'
    }
    if (parseFloat(price) < 0){
        return 'Price cant be negative value.'
    }
    return ''
}

const validateAmount = (amount) => {
    if (!amount){
        return 'Amount is required.'
    }
    const regex = /^\d+$/;
    if (!regex.test(amount)){
        return 'Amount should be a number.'
    }
    if (parseInt(amount) < 0){
        return 'Amount cant be negative value.'
    }
    return ''
}

module.exports = {
    validateAmount,
    validatePrice
}