import "../../App.css"
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getToken, selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {fetchAssignedSpecialists} from "../../redux/slices/products";
import {getDictionary} from "../../redux/slices/languages";

function PurchaseForm() {

    const {data} = useSelector(state => state.auth)
    const redactorRoles = data?.roles?.map(role => role.name) || [];
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id} = useParams()
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const isAuth = useSelector(selectorIsAuth);
    const {specialists} = useSelector(state => state.products)
    const [credentials, setCredentials] = useState({
        product: '',
        specialist: '',
    });

    const [errors, setErrors] = useState({
        product: '',
        specialist: '',
        money:''
    });

    useEffect(() => {
        if (credentials.product) {
            dispatch(fetchAssignedSpecialists({page: 1, limit: 100000, subjectId: credentials.product.subject._id}));
        }
    }, [credentials.product]);

    useEffect(() => {
        fetch(`/products/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.product) {
                    setCredentials((prev) => ({
                        ...prev,
                        product: data.product
                    }));
                }
                if (data.error) {
                    setErrors(prev => ({
                        ...prev,
                        product: data.error
                    }));
                }
            })
            .catch(err => console.log(err))
    }, [id])

    const validateSpecialist = (specialist) => {
        if (!specialist) {
            return 'Specialist is required.'
        }
        return ''
    }

    const validateMoney = (money) => {
        if (money < credentials.product.price) {
            return 'You dont have enough money.'
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
        if (name === 'specialist') error = validateSpecialist(value);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    const handleCancel = () => {
        navigate("/products");
    };

    const validateForm = () => {
        const specialistError = validateSpecialist(credentials.specialist);
        const moneyError = validateMoney(data.money);

        setErrors({
            ...errors,
            specialist: specialistError,
            money: moneyError,
        });

        //true if valid
        return !(specialistError || moneyError)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const method = "POST";
            const url = `/purchases`;
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product: credentials.product._id,
                    specialist: credentials.specialist,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || errorData.errors?.toString() || "Failed to buy product.");
                alert(`Error: ${errorData.message || errorData.errors?.toString() || "Failed to buy product."}`);
                return;
            }

            const data = await response.json();

            alert('Product successfully bought.')
            navigate(`/products`);
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }

    if (!redactorRoles.includes('user')) {
        return <Navigate to={'/'}/>
    }

    return (
        <>
            <div className={"form-body"}>
                <form onSubmit={handleSubmit}>
                    <div className={"form-info"}>
                        <h1>{dictionary[language]?.buyButton} {dictionary[language]?.product}</h1>
                        <h3>{dictionary[language]?.type}: {credentials.product.subjectType?.name}</h3>
                        <h3>{dictionary[language]?.name}: {credentials.product.subject?.name}</h3>
                        <h3>{dictionary[language]?.abbreviation}: {credentials.product.subject?.abbreviation}</h3>
                        <h3>{dictionary[language]?.price}: {credentials.product.price}</h3>
                        <div className={`input-box ${errors.specialist ? "error" : ""}`}>
                            <label>{dictionary[language]?.specialist}</label>
                            <select
                                name="specialist"
                                value={credentials.specialist}
                                onChange={handleChange}
                            >
                                <option
                                    value="">{dictionary[language]?.select} {dictionary[language]?.specialist}
                                </option>
                                {specialists.items.map((spec) => (
                                    <option key={spec._id} value={spec._id}>
                                        {spec.firstName} {spec.lastName}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.specialist}</p>
                            <p className="error">{errors.money}</p>
                            <p className="error">{specialists.items.length === 0 ? 'All specialists are busy choose another product.' : ''}</p>
                        </div>
                        <input className={'btn'} type="submit" value={dictionary[language]?.buyButton}/>
                        <button className={'btn'} type="button" onClick={handleCancel}>{dictionary[language]?.cancel}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default PurchaseForm;