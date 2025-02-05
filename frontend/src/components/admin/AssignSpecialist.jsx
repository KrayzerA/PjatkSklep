import "../../App.css"
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getToken, selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate} from "react-router-dom";
import {fetchSpecialists, fetchSubjects} from "../../redux/slices/products";
import {getDictionary} from "../../redux/slices/languages";

function AssignSpecialist() {

    const {data} = useSelector(state => state.auth)
    const redactorRoles = data?.roles?.map(role => role.name) || [];
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const {specialists, subjects} = useSelector(state => state.products)
    const [credentials, setCredentials] = useState({
        subject: '',
        specialist: '',
    });

    const [errors, setErrors] = useState({
        subject: '',
        specialist: '',
    });

    useEffect(() => {
        dispatch(fetchSubjects({page: 1, limit: 100000}));
        dispatch(fetchSpecialists({page: 1, limit: 100000}));
    }, []);

    const validateSpecialist = (specialist) => {
        if (!specialist) {
            return 'Specialist is required.'
        }
        return ''
    }
    const validateSubject = (subject) => {
        if (!subject) {
            return 'Subject is required.'
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
        if (name === 'specialist') error = validateSpecialist(value);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    const handleCancel = () => {
        navigate("/admin");
    };

    const validateForm = () => {
        const subjectError = validateSubject(credentials.subject);
        const specialistError = validateSpecialist(credentials.specialist);

        setErrors({
            subject: subjectError,
            specialist: specialistError,
        });

        //true if valid
        return !(subjectError || specialistError)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const method = "POST";
            const url = `/subjects/${credentials.subject}/assign`;
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    specialist: credentials.specialist,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to assign specialist.");
                alert(`Error: ${errorData.message || "Failed to assign specialist."}`);
                return;
            }

            const data = await response.json();

            alert('Specialist successfully assigned.')
            navigate(`/admin`);
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }

    if (!redactorRoles.includes('admin')) {
        return <Navigate to={'/'}/>
    }

    return (
        <>
            <div className={"form-body"}>
                <form onSubmit={handleSubmit}>
                    <div className={"form-info"}>
                        <h1>Assign specialist</h1>
                        <div className={`input-box ${errors.subject ? "error" : ""}`}>
                            <label>Subject</label>
                            <select
                                name="subject"
                                value={credentials.subject}
                                onChange={handleChange}
                            >
                                <option
                                    value="">{dictionary[language]?.select}  {dictionary[language]?.subject}</option>
                                {subjects.items.map((sub) => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.subject}</p>
                        </div>
                        <div className={`input-box ${errors.specialist ? "error" : ""}`}>
                            <label>{dictionary[language]?.specialist}</label>
                            <select
                                name="specialist"
                                value={credentials.specialist}
                                onChange={handleChange}
                            >
                                <option
                                    value="">{dictionary[language]?.select} {dictionary[language]?.specialist}</option>
                                {specialists.items.map((spec) => (
                                    <option key={spec._id} value={spec._id}>
                                        {spec.firstName} {spec.lastName}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.specialist}</p>
                        </div>
                        <input className={'btn'} type="submit" value='Assign'/>
                        <button className={'btn'} type="button" onClick={handleCancel}>{dictionary[language]?.cancel}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AssignSpecialist;