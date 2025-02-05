import {Link} from "react-router-dom";
import React from "react";
import Pagination from "../Pagination";
import SubjectTypeRow from "./SubjectTypeRow";
import {useSelector} from "react-redux";
import {getDictionary} from "../../redux/slices/languages";

function SubjectTypeTable({roles, subjectTypes, pagination, handlePageChange, handleDelete}) {
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    if (subjectTypes.status === 'loading') {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <table className="styled-table">
                <thead>
                <tr>
                    <th>{dictionary[language]?.name}</th>
                    <th></th>
                    {roles.includes('admin') && <th></th>}
                    {roles.includes('admin') && <th></th>}
                </tr>
                </thead>
                <tbody>
                {
                    subjectTypes.items.map((sub, i) => (
                        <SubjectTypeRow
                            key={i}
                            subjectType={sub}
                            roles={roles}
                            onDelete={handleDelete}
                            dictionary={dictionary}
                            language={language}
                        />))
                }
                </tbody>
            </table>
            <Pagination pagination={pagination} handlePageChange={handlePageChange}/>
            {roles.includes('admin') && <Link className={'btn-table'} to="/subjectTypes/create">{dictionary[language]?.createButton}</Link>}
        </div>
    );
}

export default SubjectTypeTable;