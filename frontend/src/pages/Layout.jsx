import {Link, Outlet} from "react-router-dom";
import "../App.css"
import {useDispatch, useSelector} from "react-redux";
import {selectorIsAuth} from "../redux/slices/auth";
import React from "react";
import {getDictionary, setLanguage} from "../redux/slices/languages";

function Layout() {
    const isAuth = useSelector(selectorIsAuth)
    const {data} = useSelector(state => state.auth)
    const roles = data?.roles?.map(role => role.name) || [];

    const dispatch = useDispatch();
    const language = useSelector(state => state.languages)
    const handleChangeLanguage = (e) => {
        dispatch(setLanguage(e.target.value))
    }
    const dictionary = getDictionary() || {EN:""};

    return (
        <>
            <header>
                <Link to="/"><img className="imglogo" src="https://azs.waw.pl/wp-content/uploads/2019/11/pjatk.png"
                                  alt="PJATK sklep"/></Link>
                <div className={'header-right'}>
                    <nav className="navbar">
                        {roles.includes('admin') ? <Link to="/admin">{dictionary[language]?.adminMenu}</Link> : ''}
                        <Link to="/subjects">{dictionary[language]?.subjects}</Link>
                        <Link to="/subjectTypes">{dictionary[language]?.subjectTypes}</Link>
                        <Link to="/products">{dictionary[language]?.products}</Link>
                        <Link to="/specialists">{dictionary[language]?.specialists}</Link>
                        {isAuth ? '' : <Link to="/login">{dictionary[language]?.login}</Link>}
                        {isAuth ? '' : <Link to="/register">{dictionary[language]?.register}</Link>}
                        {!isAuth ? '' : <Link to="/userview">{dictionary[language]?.profile}</Link>}
                    </nav>
                    <select
                        className={'lang'}
                        name="language"
                        value={language}
                        onChange={handleChangeLanguage}
                    >
                        <option value="EN">EN</option>
                        <option value="PL">PL</option>
                    </select>
                </div>

            </header>
            <div className={"myBody"}>
                <Outlet/>
            </div>
            <footer>
                <p>© 2024 Pjatk Sklep</p>
            </footer>
        </>
    )
}

export default Layout;