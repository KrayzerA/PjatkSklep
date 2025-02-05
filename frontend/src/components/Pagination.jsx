import React from "react";
import {useSelector} from "react-redux";
import {getDictionary} from "../redux/slices/languages";

function Pagination({pagination, handlePageChange}) {
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};
    return (
        <div className="pagination">
            <p>{pagination.currentPage}/{pagination.totalPages}</p>
            <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
            >
                {dictionary[language]?.paginationPrevious}
            </button>
            {[...Array(pagination.totalPages).keys()].map((num) => (
                <button
                    key={num}
                    className={pagination.currentPage === num + 1 ? "active" : ""}
                    onClick={() => handlePageChange(num + 1)}
                >
                    {num + 1}
                </button>
            ))}
            <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
            >
                {dictionary[language]?.paginationNext}
            </button>
        </div>
    )
}

export default Pagination;