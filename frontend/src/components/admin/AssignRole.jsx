import "../../App.css"
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getToken, selectorIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {fetchRoles, fetchUsers} from "../../redux/slices/users";
import {getDictionary} from "../../redux/slices/languages";

function AssignRole() {

    const {data} = useSelector(state => state.auth)
    const redactorRoles = data?.roles?.map(role => role.name) || [];
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuth = useSelector(selectorIsAuth);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    const {users, roles} = useSelector(state => state.users)
    const [credentials, setCredentials] = useState({
        user: '',
        role: '',
    });

    const [errors, setErrors] = useState({
        user: '',
        role: '',
    });

    useEffect(() => {
        dispatch(fetchRoles({page: 1, limit: 100000}));
        dispatch(fetchUsers({page: 1, limit: 100000}));
    }, []);

    const validateRole = (role) => {
        if (!role) {
            return 'Role is required.'
        }
        return ''
    }
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
        if (name === 'role') error = validateRole(value);

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
        const roleError = validateRole(credentials.role);

        setErrors({
            user: userError,
            role: roleError,
        });

        //true if valid
        return !(userError || roleError)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const method = "POST";
            const url = "/assignRole";
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: credentials.user,
                    role: credentials.role,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to assign role.");
                alert(`Error: ${errorData.message || "Failed to assign role."}`);
                return;
            }

            const data = await response.json();

            alert('Role successfully assigned.')
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
                        <h1>{dictionary[language]?.assignRole}</h1>
                        <div className={`input-box ${errors.user ? "error" : ""}`}>
                            <label>User</label>
                            <select
                                name="user"
                                value={credentials.user}
                                onChange={handleChange}
                            >
                                <option
                                    value="">{dictionary[language]?.select} user</option>
                                {users.items.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.login}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.user}</p>
                        </div>
                        <div className={`input-box ${errors.role ? "error" : ""}`}>
                            <label>Role</label>
                            <select
                                name="role"
                                value={credentials.role}
                                onChange={handleChange}
                            >
                                <option
                                    value="">{dictionary[language]?.select} role</option>
                                {roles.items.map((role) => (
                                    <option key={role._id} value={role._id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.role}</p>
                        </div>
                        <input className={'btn'} type="submit" value="Assign"/>
                        <button className={'btn'} type="button" onClick={handleCancel}>{dictionary[language]?.cancel}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AssignRole;