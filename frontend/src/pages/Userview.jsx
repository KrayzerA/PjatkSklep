import "../App.css"
import {useDispatch, useSelector} from "react-redux";
import {fetchUser, logout, selectorIsAuth} from "../redux/slices/auth";
import {Link, Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import PurchasesTable from "../components/purchases/PurchasesTable";
import {getDictionary} from "../redux/slices/languages";

function Userview() {
    const isAuth = useSelector(selectorIsAuth);
    const dispatch = useDispatch()
    const {data} = useSelector(state => state.auth)
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    useEffect(() => {
        dispatch(fetchUser())
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            dispatch(logout());
            window.localStorage.removeItem('token')
        }
    }

    if (!isAuth) {
        return <Navigate to={'/'}/>
    }

    return (
        <div>
            <div className={"userview"}>
                <div className={"userview-container"}>
                    <h1>{dictionary[language]?.welcome}, {data.login}</h1>
                    <p>Login: {data.login}</p>
                    <p>Email: {data.email} </p>
                    <p>{dictionary[language]?.money}: {data.money} </p>
                    <Link to={'/'} className={'logout-button'} onClick={handleLogout}>{dictionary[language]?.logout}</Link>
                </div>
                <h1>{dictionary[language]?.yourPurchases}:</h1>
                <PurchasesTable/>
            </div>
        </div>
    )
}

export default Userview;