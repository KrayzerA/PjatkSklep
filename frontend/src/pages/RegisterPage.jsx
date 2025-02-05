import {Link, Navigate} from "react-router-dom";
import "../App.css"
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faEnvelope, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {fetchRegister, selectorIsAuth} from "../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";
import {getDictionary} from "../redux/slices/languages";

function RegisterPage() {
    const isAuth = useSelector(selectorIsAuth)
    const dispatch = useDispatch();
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const [credentials, setCredentials] = useState({
        email: '',
        login: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        login: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false)

    const validateEmail = (email) => {
        if (!email.trim()) {
            return "Email is required.";
        }

        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
        if (!regex.test(email)) {
            return "Wrong email address.";
        }

        return '';
    }

    const validateLogin = (login) => {
        if (!login.trim()) {
            return "Username is required.";
        }

        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!regex.test(login)) {
            return "The username must be between 3 and 20 characters long and can only contain letters, numbers and the underscore character (_).";
        }

        return '';
    }

    const validatePassword = (password) => {
        if (!password.trim()) {
            return "Password is required.";
        }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*+\-\/.,{}\[\]()\;:\?<>\"'_])[A-Za-z\d~!@#$%^&*+\-\/.,{}\[\]()\;:\?<>\"'_]{8,}$/;
        if (!regex.test(password)) {
            return "The password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (~!@#$%^&*+-/.,{}[]();:?<>\"_).";
        }
        return '';
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });

        let error = '';
        if (name === 'email') error = validateEmail(value);
        if (name === 'login') error = validateLogin(value);
        if (name === 'password') error = validatePassword(value);

        setErrors({
            ...errors,
            [name]: error
        });
    }

    const validateForm = () => {
        const emailError = validateEmail(credentials.email);
        const loginError = validateLogin(credentials.login);
        const passwordError = validatePassword(credentials.password);

        setErrors({
            email: emailError,
            login: loginError,
            password: passwordError
        });

        //true if valid
        return !(emailError || loginError || passwordError);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const data = await dispatch(fetchRegister(credentials));
        if (data.meta.requestStatus === 'rejected') {
            if (data.payload.message){
                setErrors({
                    login: ' ',
                    email: ' ',
                    password: data.payload.message
                })
                return;
            }
            const errorsData = data.payload?.errors;
            setErrors((prev) => {
                const updatedErrors = {...prev};
                for (const error of errorsData) {
                    updatedErrors[error.field] = error.message;
                }
                return updatedErrors;
            });
            return
        }
        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    }

    const handleShowPassword = () => {
        setShowPassword(prev => !prev);
    }

    if (isAuth) {
        return <Navigate to={'/userview'}/>
    }

    return (
        <div className="register-body">
            <form id="register-form" onSubmit={handleSubmit}>
                <div className="register">
                    <div>
                        <h1>{dictionary[language]?.register}</h1>
                    </div>
                    <div className="input-box">
                        <input name={'email'} id="register-email" type="email" placeholder="Email"
                               onChange={handleChange}/>
                        <FontAwesomeIcon icon={faEnvelope} className="icon"/>
                        <p className="error">{errors.email}</p>
                    </div>
                    <div className="input-box">
                        <input name={"login"} id="register-username" type="text" placeholder="Username"
                               onChange={handleChange}/>
                        <FontAwesomeIcon icon={faUser} className="icon"/>
                        <p className="error">{errors.login}</p>
                    </div>
                    <div className="input-box">
                        <input name={"password"} id="register-password" type={showPassword ? 'text' : 'password'}
                               placeholder="Password" onChange={handleChange}/>
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="icon"
                                         onClick={handleShowPassword}/>
                        <p className="error">{errors.password}</p>
                    </div>
                    <button className="btn" type="submit">{dictionary[language]?.register}</button>
                    <div className="login-link">
                        <p>{dictionary[language]?.haveAccount} <Link to="/login">{dictionary[language]?.login}</Link></p>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;