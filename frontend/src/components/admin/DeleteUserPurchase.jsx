import "../../App.css"
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate} from "react-router-dom";
import {fetchUsers} from "../../redux/slices/users";
import PurchasesTable from "../purchases/PurchasesTable";
import {getDictionary} from "../../redux/slices/languages";

function DeleteUserPurchase() {

    const {data} = useSelector(state => state.auth)
    const redactorRoles = data?.roles?.map(role => role.name) || [];
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const {users} = useSelector(state => state.users)
    const [credentials, setCredentials] = useState({
        user: '',
    });

    const [errors, setErrors] = useState({
        user: '',
    });

    useEffect(() => {
        dispatch(fetchUsers({page: 1, limit: 100000}));
    }, [dispatch]);

    const validateUser = (user) => {
        if (!user) {
            return 'User is required.'
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

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    const handleCancel = () => {
        navigate("/admin");
    };


    if (!redactorRoles.includes('admin')) {
        return <Navigate to={'/'}/>
    }

    return (
        <>
            <div className={"form-body"}>
                <form>
                    <div className={"form-info"}>
                        <h1>Delete user purchase</h1>
                        <div className={`input-box ${errors.user ? "error" : ""}`}>
                            <label>User</label>
                            <select
                                name="user"
                                value={credentials.user}
                                onChange={handleChange}
                            >
                                <option
                                    value="">{dictionary[language]?.select} a user
                                </option>
                                {users.items.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.login}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.user}</p>
                        </div>
                        <button className={'btn'} type="button" onClick={handleCancel}>{dictionary[language]?.cancel}</button>
                    </div>
                </form>
                <PurchasesTable user={credentials.user}/>
            </div>
        </>
    );
}

export default DeleteUserPurchase;