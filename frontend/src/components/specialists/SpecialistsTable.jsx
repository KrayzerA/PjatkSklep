import {Link} from "react-router-dom";
import React, {useEffect} from "react";
import Pagination from "../Pagination";
import SpecialistRow from "./SpecialistRow";
import {useSelector} from "react-redux";
import {getDictionary} from "../../redux/slices/languages";

function SpecialistsTable({roles, specialists, pagination, handlePageChange, handleDelete}) {
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN: ""};
    if (specialists.status === 'loading') {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <table className="styled-table">
                <thead>
                <tr>
                    <th>{dictionary[language]?.firstName}</th>
                    <th>{dictionary[language]?.lastName}</th>
                    <th></th>
                    {roles.includes('admin') && <th></th>}
                    {roles.includes('admin') && <th></th>}
                </tr>
                </thead>
                <tbody>
                {
                    specialists.items.map((spec, i) => (
                        <SpecialistRow
                            key={i}
                            specialist={spec}
                            roles={roles}
                            onDelete={handleDelete}
                            dictionary={dictionary}
                            language={language}
                        />))
                }
                </tbody>
            </table>
            <Pagination pagination={pagination} handlePageChange={handlePageChange}/>
            {roles.includes('admin') && <Link className={'btn-table'} to="/specialists/create">{dictionary[language]?.createButton}</Link>}
        </div>
    );
}

export default SpecialistsTable;