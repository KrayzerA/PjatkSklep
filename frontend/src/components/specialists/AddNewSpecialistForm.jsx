import "../../App.css"
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getToken, selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {getDictionary} from "../../redux/slices/languages";

function AddNewSpecialistForm() {

    const navigate = useNavigate()
    const {id} = useParams()
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const [credentials, setCredentials] = useState({
        firstName: '',
        lastName: ''
    });

    const [initialCredentials, setInitialCredentials] = useState({
        firstName: "",
        lastName: "",
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: ''
    });

    useEffect(() => {
        if (id) {
            fetch(`/specialists/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch specialist data.");
                    }
                    return res.json();
                })
                .then((info) => {
                    setCredentials({
                        firstName: info.specialist.firstName || "",
                        lastName: info.specialist.lastName || "",
                    });
                    setInitialCredentials({
                        firstName: info.specialist.firstName || "",
                        lastName: info.specialist.lastName || "",
                    });
                })
                .catch((err) => console.error("Error fetching specialist:", err));
        }
    }, [id]);

    const validateFirstName = (firstName) => {
        if (!firstName) {
            return 'FirstName is required.'
        }
        const regex = /^[a-zA-Z]{3,50}$/;
        if (!regex.test(firstName)) {
            return 'Firstname should contain only letters and have length between 3 and 50 characters.'
        }
        return ''
    }

    const validateLastName = (lastName) => {
        if (!lastName) {
            return 'LastName is required.'
        }
        const regex = /^[a-zA-Z]{3,50}$/;
        if (!regex.test(lastName)) {
            return 'LastName should contain only letters and have length between 3 and 50 characters.'
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
        if (name === 'firstName') error = validateFirstName(value);
        if (name === 'lastName') error = validateLastName(value);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    const handleReset = () => {
        setCredentials({...initialCredentials});
        setErrors({firstName: "", lastName: ""});
    };

    const handleCancel = () => {
        navigate("/specialists");
    };

    const validateForm = () => {
        const firstNameError = validateFirstName(credentials.firstName);
        const lastNameError = validateLastName(credentials.lastName);

        setErrors({
            firstName: firstNameError,
            lastName: lastNameError
        });

        //true if valid
        return !(firstNameError || lastNameError)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const method = id ? "PUT" : "POST";
            const url = id ? `/specialists/${id}` : "/specialists";
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: credentials.firstName,
                    lastName: credentials.lastName,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to add specialist.");
                alert(`Error: ${errorData.message || "Failed to add specialist."}`);
                return;
            }

            const data = await response.json();

            navigate(`/specialists/${data._id || id}`);
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
                        <h1>{id ? `${dictionary[language]?.modifyButton} ${dictionary[language]?.specialist}`
                            : `${dictionary[language]?.createButton} ${dictionary[language]?.specialist}`}</h1>
                        <div className={`input-box ${errors.firstName ? "error" : ""}`}>
                            <input name={"firstName"}
                                   type="text"
                                   placeholder={dictionary[language]?.firstName}
                                   value={credentials.firstName}
                                   onChange={handleChange}/>
                            <p className="error">{errors.firstName}</p>
                        </div>
                        <div className={`input-box ${errors.lastName ? "error" : ""}`}>
                            <input name={"lastName"}
                                   type="text"
                                   placeholder={dictionary[language]?.lastName}
                                   value={credentials.lastName}
                                   onChange={handleChange}/>
                            <p className="error">{errors.lastName}</p>
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

export default AddNewSpecialistForm;