import {Link, Navigate} from "react-router-dom";
import React from "react";
import {useSelector} from "react-redux";
import {getDictionary} from "../redux/slices/languages";

function AdminMenuPage() {
    const {data} = useSelector(state => state.auth)
    const roles = data?.roles?.map(role => role.name) || [];
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};

    if (!roles.includes('admin')) {
        return <Navigate to={'/'}/>
    }

    return (
        <div className={'form-body'}>
            <div className="admin-menu">
                <h2>{dictionary[language]?.adminMenu}</h2>
                <ul className="admin-menu-list">
                    <li><Link to="/admin/addRole">{dictionary[language]?.addRole}</Link></li>
                    <li><Link to="/admin/assignRole">{dictionary[language]?.assignRole}</Link></li>
                    <li><Link to="/admin/assignSpecialist">{dictionary[language]?.assignSpecialist}</Link></li>
                    <li><Link to="/admin/donateToUser">{dictionary[language]?.donateToUser}</Link></li>
                    <li><Link to="/admin/deleteUserPurchase">{dictionary[language]?.deleteUserPurchase}</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default AdminMenuPage;