import "../../App.css"
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getToken, selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {getDictionary} from "../../redux/slices/languages";

function AddNewSubjectForm() {

    const navigate = useNavigate()
    const {id} = useParams()
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const [credentials, setCredentials] = useState({
        name: '',
        abbreviation: '',
    });

    const [initialCredentials, setInitialCredentials] = useState({
        name: '',
        abbreviation: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        abbreviation: '',
    });

    useEffect(() => {
        if (id) {
            fetch(`/subjects/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch subject data.");
                    }
                    return res.json();
                })
                .then((info) => {
                    setCredentials({
                        name: info.subject.name || "",
                        abbreviation: info.subject.abbreviation || "",
                    });
                    setInitialCredentials({
                        name: info.subject.name || "",
                        abbreviation: info.subject.abbreviation || "",
                    });
                })
                .catch((err) => console.error("Error fetching subject:", err));
        }
    }, [id]);

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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value
        }));

        let error = '';
        if (name === 'name') error = validateName(value);
        if (name === 'abbreviation') error = validateAbbreviation(value);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    const handleReset = () => {
        setCredentials({...initialCredentials});
        setErrors({name: "", abbreviation: ""});
    };

    const handleCancel = () => {
        navigate("/subjects");
    };

    const validateForm = () => {
        const nameError = validateName(credentials.name);
        const abbreviationError = validateAbbreviation(credentials.abbreviation);

        setErrors({
            name: nameError,
            abbreviation: abbreviationError
        });

        //true if valid
        return !(nameError || abbreviationError)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const method = id ? "PUT" : "POST";
            const url = id ? `/subjects/${id}` : "/subjects";
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: credentials.name,
                    abbreviation: credentials.abbreviation,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to add subject.");
                alert(`Error: ${errorData.message || "Failed to add subject."}`);
                return;
            }

            const data = await response.json();

            navigate(`/subjects/${data._id || id}`);
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
                        <h1>{id ? `${dictionary[language]?.modifyButton} ${dictionary[language]?.subject}`
                            : `${dictionary[language]?.createButton} ${dictionary[language]?.subject}`}</h1>
                        <div className={`input-box ${errors.name ? "error" : ""}`}>
                            <input name={"name"}
                                   type="text"
                                   placeholder={dictionary[language]?.name}
                                   value={credentials.name}
                                   onChange={handleChange}/>
                            <p className="error">{errors.name}</p>
                        </div>
                        <div className={`input-box ${errors.abbreviation ? "error" : ""}`}>
                            <input name={"abbreviation"}
                                   type="text"
                                   placeholder={dictionary[language]?.abbreviation}
                                   value={credentials.abbreviation}
                                   onChange={handleChange}/>
                            <p className="error">{errors.abbreviation}</p>
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

export default AddNewSubjectForm;