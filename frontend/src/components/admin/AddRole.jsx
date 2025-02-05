import "../../App.css"
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getToken, selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {getDictionary} from "../../redux/slices/languages";

function AddRole() {

    const {data} = useSelector(state => state.auth)
    const roles = data?.roles?.map(role => role.name) || [];
    const navigate = useNavigate()
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const [credentials, setCredentials] = useState({
        name: '',
    });

    const [errors, setErrors] = useState({
        name: '',
    });

    const validateName = (name) => {
        if (!name){
            return 'Role name is required.'
        }
        if (!name.trim()){
            return 'Incorrect name.'
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


    const handleCancel = () => {
        navigate("/admin");
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
            const method = "POST";
            const url = "/roles";
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
                console.error("Error:", errorData.message || "Failed to add role.");
                alert(`Error: ${errorData.message || "Failed to add role."}`);
                return;
            }

            const data = await response.json();

            alert('Role added.')
            navigate(`/admin`);
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }

    if (!roles.includes('admin')) {
        return <Navigate to={'/'}/>
    }

    return (
        <>
            <div className={"form-body"}>
                <form onSubmit={handleSubmit}>
                    <div className={"form-info"}>
                        <h1>{dictionary[language]?.createButton} role</h1>
                        <div className={`input-box ${errors.name ? "error" : ""}`}>
                            <input name={"name"}
                                   type="text"
                                   placeholder="role"
                                   value={credentials.name}
                                   onChange={handleChange}/>
                            <p className="error">{errors.name}</p>
                        </div>
                        <input className={'btn'} type="submit" value={dictionary[language]?.createButton}/>
                        <button className={'btn'} type="button" onClick={handleCancel}>{dictionary[language]?.cancel}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddRole;