import "../../App.css"
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getToken, selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {fetchUsers} from "../../redux/slices/users";
import {getDictionary} from "../../redux/slices/languages";

function DonateToUserForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const {users} = useSelector(state => state.users)
    const [credentials, setCredentials] = useState({
        user: '',
        amount: '',
    });

    const [errors, setErrors] = useState({
        user: '',
        amount: '',
    });


    useEffect(() => {
        dispatch(fetchUsers({page: 1, limit: 100000}));
    }, []);

    const validateUser = (user) => {
        if (!user) {
            return 'User is required.'
        }
        return ''
    }

    const validateAmount = (amount) => {
        if (!amount) {
            return 'Amount is required.'
        }
        if (isNaN(amount)) {
            return 'Amount should be a number.'
        }
        if (parseFloat(amount) < 0) {
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
        if (name === 'user') error = validateUser(value);
        if (name === 'amount') error = validateAmount(value);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    const handleCancel = () => {
        navigate("/admin");
    };

    const validateForm = () => {
        const userError = validateUser(credentials.user);
        const amountError = validateAmount(credentials.amount);

        setErrors({
            user: userError,
            amount: amountError,
        });

        //true if valid
        return !(userError || amountError)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const method = "POST";
            const url = `/users/${credentials.user}/donate`;
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: credentials.user,
                    amount: credentials.amount,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to donate.");
                alert(`Error: ${errorData.message || "Failed to donate."}`);
                return;
            }

            const data = await response.json();

            alert('Donate success.')
            navigate(`/admin`);
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
                        <h1>{dictionary[language]?.donate}</h1>
                        <div className={`input-box ${errors.user ? "error" : ""}`}>
                            <label>User</label>
                            <select
                                name="user"
                                value={credentials.user}
                                onChange={handleChange}
                            >
                                <option
                                    value="">{dictionary[language]?.select} user
                                </option>
                                {users.items.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.login}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.user}</p>
                        </div>
                        <div className={`input-box ${errors.amount ? "error" : ""}`}>
                            <label>Amount</label>
                            <input
                                type="number"
                                placeholder="amount"
                                name="amount"
                                value={credentials.amount}
                                onChange={handleChange}
                            />
                            <p className="error">{errors.amount}</p>
                        </div>
                        <input className={'btn'} type="submit" value={dictionary[language]?.donate}/>
                        <button className={'btn'} type="button" onClick={handleCancel}>{dictionary[language]?.cancel}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default DonateToUserForm;