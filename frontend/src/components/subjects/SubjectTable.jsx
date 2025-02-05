import {Link} from "react-router-dom";
import React from "react";
import Pagination from "../Pagination";
import SubjectRow from "./SubjectRow";
import {useSelector} from "react-redux";
import {getDictionary} from "../../redux/slices/languages";

function SubjectTable({roles, subjects, pagination, handlePageChange, handleDelete}) {
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN: ""};
    if (subjects.status === 'loading') {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <table className="styled-table">
                <thead>
                <tr>
                    <th>{dictionary[language]?.name}</th>
                    <th>{dictionary[language]?.abbreviation}</th>
                    <th></th>
                    {roles.includes('admin') && <th></th>}
                    {roles.includes('admin') && <th></th>}
                </tr>
                </thead>
                <tbody>
                {
                    subjects.items.map((sub, i) => (
                        <SubjectRow
                            key={i}
                            subject={sub}
                            roles={roles}
                            onDelete={handleDelete}
                            dictionary={dictionary}
                            language={language}/>))
                }
                </tbody>
            </table>
            <Pagination pagination={pagination} handlePageChange={handlePageChange}/>
            {roles.includes('admin') &&
                <Link className={'btn-table'} to="/subjects/create">{dictionary[language]?.createButton}</Link>}
        </div>
    );
}

export default SubjectTable;