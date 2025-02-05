import ProductRow from "./ProductRow";
import {Link} from "react-router-dom";
import React from "react";
import Pagination from "../Pagination";
import {useSelector} from "react-redux";
import {getDictionary} from "../../redux/slices/languages";

function ProductsTable({roles, products, pagination, handlePageChange, handleDelete}) {
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN: ""};

    if (products.status === 'loading') {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <table className="styled-table">
                <thead>
                <tr>
                    <th>{dictionary[language]?.name}</th>
                    <th>{dictionary[language]?.type}</th>
                    <th>{dictionary[language]?.price}</th>
                    <th>{dictionary[language]?.available}</th>
                    <th></th>
                    {roles.includes('admin') && <th></th>}
                    {roles.includes('admin') && <th></th>}
                    {roles.includes('user') && <th></th>}
                </tr>
                </thead>
                <tbody>
                {
                    products.items.map((prod, i) => (
                        <ProductRow
                            key={i}
                            product={prod}
                            roles={roles}
                            onDelete={handleDelete}
                            dictionary={dictionary}
                            language={language}
                        />))
                }
                </tbody>
            </table>
            <Pagination pagination={pagination} handlePageChange={handlePageChange}/>
            {roles.includes('admin') && <Link className={'btn-table'} to="/products/create">{dictionary[language]?.createButton}</Link>}

        </div>
    );
}

export default ProductsTable;