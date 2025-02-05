import "../../App.css"
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getToken, selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {fetchSubjects, fetchSubjectTypes} from "../../redux/slices/products";
import {getDictionary} from "../../redux/slices/languages";

function AddNewProductForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id} = useParams()
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const {subjects, subjectTypes} = useSelector(state => state.products)
    const [credentials, setCredentials] = useState({
        subject: '',
        subjectType: '',
        price: '',
        availableAmount: '',
    });

    const [initialCredentials, setInitialCredentials] = useState({
        subject: '',
        subjectType: '',
        price: '',
        availableAmount: '',
    });

    const [errors, setErrors] = useState({
        subject: '',
        subjectType: '',
        price: '',
        availableAmount: '',
    });

    useEffect(() => {
        if (id) {
            fetch(`/products/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch product data.");
                    }
                    return res.json();
                })
                .then((info) => {
                    setCredentials({
                        subject: info.product.subject || "",
                        subjectType: info.product.subjectType || "",
                        price: info.product.price || "",
                        availableAmount: info.product.availableAmount || "",
                    });
                    setInitialCredentials({
                        subject: info.product.subject || "",
                        subjectType: info.product.subjectType || "",
                        price: info.product.price || "",
                        availableAmount: info.product.availableAmount || "",
                    });
                })
                .catch((err) => console.error("Error fetching product:", err));
        }
    }, [id]);

    useEffect(() => {
        if (!id) {
            dispatch(fetchSubjects({page: 1, limit: 100000}));
            dispatch(fetchSubjectTypes({page: 1, limit: 100000}));
        }
    }, []);

    const validateSubject = (subject) => {
        if (!subject) {
            return 'Subject is required.'
        }
        return ''
    }
    const validateSubjectType = (subjectType) => {
        if (!subjectType) {
            return 'SubjectType is required.'
        }
        return ''
    }
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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value
        }));

        let error = '';
        if (name === 'subject') error = validateSubject(value);
        if (name === 'subjectType') error = validateSubjectType(value);
        if (name === 'price') error = validatePrice(value);
        if (name === 'availableAmount') error = validateAmount(value);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    const handleReset = () => {
        setCredentials({...initialCredentials});
        setErrors({
            subject: "",
            subjectType: "",
            price: "",
            availableAmount: "",
        });
    };

    const handleCancel = () => {
        navigate("/products");
    };

    const validateForm = () => {
        const subjectError = validateSubject(credentials.subject);
        const subjectTypeError = validateSubjectType(credentials.subjectType);
        const priceError = validatePrice(credentials.price);
        const amountError = validateAmount(credentials.availableAmount);

        setErrors({
            subject: subjectError,
            subjectType: subjectTypeError,
            price: priceError,
            availableAmount: amountError,
        });

        //true if valid
        return !(subjectError || subjectTypeError || priceError || amountError)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const method = id ? "PUT" : "POST";
            const url = id ? `/products/${id}` : "/products";
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subject: credentials.subject,
                    subjectType: credentials.subjectType,
                    price: credentials.price,
                    availableAmount: credentials.availableAmount,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to add product.");
                alert(`Error: ${errorData.message || "Failed to add product."}`);
                return;
            }

            const data = await response.json();

            navigate(`/products/${data._id || id}`);
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }

    if (!isAuth) {
        return <Navigate to={'/'}/>
    }

    return (
        <>
            <div className={"form-body"}>
                <form onSubmit={handleSubmit}>
                    <div className={"form-info"}>
                        <h1>{id ? `${dictionary[language]?.modifyButton} ${dictionary[language]?.product}`
                            : `${dictionary[language]?.createButton} ${dictionary[language]?.product}`}</h1>
                        <div className={`input-box ${errors.subject ? "error" : ""}`}>
                            <label>{dictionary[language]?.subject}</label>
                            <select
                                name="subject"
                                value={credentials.subject}
                                onChange={handleChange}
                            >
                                <option value={id ? credentials.subject : ""}>{id ? credentials.subject.name : `${dictionary[language]?.select} ${dictionary[language]?.subject}` }</option>
                                {!id && subjects.items.map((sub) => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.subject}</p>
                        </div>
                        <div className={`input-box ${errors.subjectType ? "error" : ""}`}>
                            <label>{dictionary[language]?.subjectType}</label>
                            <select
                                name="subjectType"
                                value={credentials.subjectType}
                                onChange={handleChange}
                            >
                                <option value={id ? credentials.subjectType : ""}>{id ? credentials.subject.name : `${dictionary[language]?.select} ${dictionary[language]?.subjectType}` }</option>
                                {!id && subjectTypes.items.map((type) => (
                                    <option key={type._id} value={type._id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.subjectType}</p>
                        </div>
                        <div className={`input-box ${errors.price ? "error" : ""}`}>
                            <label>{dictionary[language]?.price}</label>
                            <input
                                type="number"
                                placeholder={dictionary[language]?.price}
                                name="price"
                                value={credentials.price}
                                onChange={handleChange}
                            />
                            <p className="error">{errors.price}</p>
                        </div>
                        <div className={`input-box ${errors.availableAmount ? "error" : ""}`}>
                            <label>{dictionary[language]?.available}</label>
                            <input
                                type="number"
                                name="availableAmount"
                                placeholder={dictionary[language]?.available}
                                value={credentials.availableAmount}
                                onChange={handleChange}
                            />
                            <p className="error">{errors.availableAmount}</p>
                        </div>
                        <input className={'btn'} type="submit" value={id ? dictionary[language]?.saveChanges : dictionary[language]?.createButton}/>
                        {id && <button className={'btn'} type="button" onClick={handleReset}>{dictionary[language]?.reset}</button>}
                        <button className={'btn'} type="button" onClick={handleCancel}>{dictionary[language]?.cancel}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddNewProductForm;