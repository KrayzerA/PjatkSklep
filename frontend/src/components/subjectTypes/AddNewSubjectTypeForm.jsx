import "../../App.css"
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getToken, selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {getDictionary} from "../../redux/slices/languages";

function AddNewSubjectTypeForm() {

    const navigate = useNavigate()
    const {id} = useParams()
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const [credentials, setCredentials] = useState({
        name: '',
    });

    const [initialCredentials, setInitialCredentials] = useState({
        name: '',
    });

    const [errors, setErrors] = useState({
        name: '',
    });

    useEffect(() => {
        if (id) {
            fetch(`/subjectTypes/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch subjectType data.");
                    }
                    return res.json();
                })
                .then((info) => {
                    setCredentials({
                        name: info.subjectType.name || "",
                    });
                    setInitialCredentials({
                        name: info.subjectType.name || "",
                    });
                })
                .catch((err) => console.error("Error fetching subjectType:", err));
        }
    }, [id]);

    const validateName = (name) => {
        if (!name){
            return 'SubjectType name is required.'
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


    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value
        }));

        let error = '';
        if (name === 'name') error = validateName(value);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    const handleReset = () => {
        setCredentials({...initialCredentials});
        setErrors({name: ""});
    };

    const handleCancel = () => {
        navigate("/subjectTypes");
    };

    const validateForm = () => {
        const nameError = validateName(credentials.name);

        setErrors({
            name: nameError,
        });

        //true if valid
        return !nameError
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const method = id ? "PUT" : "POST";
            const url = id ? `/subjectTypes/${id}` : "/subjectTypes";
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: credentials.name,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to add subjectType.");
                alert(`Error: ${errorData.message || "Failed to add subjectType."}`);
                return;
            }

            const data = await response.json();

            navigate(`/subjectTypes/${data._id || id}`);
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
                        <h1>{id ? `${dictionary[language]?.modifyButton} ${dictionary[language]?.subjectType}`
                            : `${dictionary[language]?.createButton} ${dictionary[language]?.subjectType}`}</h1>
                        <div className={`input-box ${errors.name ? "error" : ""}`}>
                            <input name={"name"}
                                   type="text"
                                   placeholder={dictionary[language]?.cancel}
                                   value={credentials.name}
                                   onChange={handleChange}/>
                            <p className="error">{errors.name}</p>
                        </div>
                        <input className={'btn'} type="submit"
                               value={id ? dictionary[language]?.saveChanges : dictionary[language]?.createButton}/>
                        {id && <button className={'btn'} type="button"
                                       onClick={handleReset}>{dictionary[language]?.reset}</button>}
                        <button className={'btn'} type="button"
                                onClick={handleCancel}>{dictionary[language]?.cancel}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddNewSubjectTypeForm;