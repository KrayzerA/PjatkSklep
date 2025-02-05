import {Navigate, Link} from "react-router-dom";
import "../App.css"
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchLogin, selectorIsAuth} from "../redux/slices/auth";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, faUser} from "@fortawesome/free-solid-svg-icons";
import {getDictionary} from "../redux/slices/languages";

function LoginPage() {

    const dispatch = useDispatch();
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};

    const [credentials, setCredentials] = useState({
        login: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        login: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)

    const validateLogin = (login) => {
        if (login.length < 3 || login.length > 20) {
            return "The username must be between 3 and 20 characters long.";
        }
        return "";
    }

    const validatePassword = (password) => {
        if (!password) {
            return "Password is required.";
        }
        return "";
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials({
            ...credentials,
            [name]:value
        });

        let error = '';
        if (name === 'login') error = validateLogin(value);
        if (name === 'password') error = validatePassword(value);

        setErrors({
            ...errors,
            [name]:error
        });
    }

    const validateForm = () => {
        const loginError = validateLogin(credentials.login);
        const passwordError = validatePassword(credentials.password);

        setErrors({
            login: loginError,
            password: passwordError
        });

        //true if valid
        return !(loginError || passwordError)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()){
            return;
        }

        const data = await dispatch(fetchLogin(credentials));
        if (data.meta.requestStatus === 'rejected'){
            setErrors({
                login: ' ',
                password: data.payload?.message
            })
            return
        }
        if ('token' in data.payload){
            window.localStorage.setItem('token',data.payload.token);
        }
    }

    const handleShowPassword = () => {
        setShowPassword(prev => !prev)
    }

    if(isAuth) {
        return <Navigate to={'/userview'}/>
    }

    return (
        <div className="login-body">
            <form id="login-form" onSubmit={handleSubmit}>
                <div className="login">
                    <div>
                        <h1>{dictionary[language]?.login}</h1>
                    </div>
                    <div className={`input-box ${errors.login ? "error" : ""}`}>
                        <input id="login-username" name={"login"} type="text" placeholder="Username" onChange={handleChange}/>
                        <FontAwesomeIcon icon={faUser} className="icon" />
                        <p className="error">{errors.login}</p>
                    </div>
                    <div className={`input-box ${errors.password ? "error" : ""}`}>
                        <input id="login-password" name={"password"} type={showPassword ? 'text' : 'password'} placeholder="Password"
                               onChange={handleChange}/>
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="icon" onClick={handleShowPassword}/>
                        <p className="error">{errors.password}</p>
                    </div>
                    <input className="btn" type="submit" value={dictionary[language]?.login}/>
                    <div className="register-link">
                        <p>{dictionary[language]?.noAccount}<Link to="/register">{dictionary[language]?.register}</Link></p>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;