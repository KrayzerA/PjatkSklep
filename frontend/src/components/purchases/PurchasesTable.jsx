import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Pagination from "../Pagination";
import {deletePurchase, fetchPurchases} from "../../redux/slices/purchases";
import PurchaseRow from "./PurchaseRow";
import {getDictionary} from "../../redux/slices/languages";

function PurchasesTable({user}) {
    const {data} = useSelector(state => state.auth)
    const roles = data?.roles?.map(role => role.name) || [];
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};

    const dispatch = useDispatch();
    const {purchases} = useSelector((state) => state.purchases);
    const pagination = purchases.pagination;
    const handlePageChange = (page) => {
        dispatch(fetchPurchases({
            page,
            limit: pagination.pageSize,
            userId: user ? user : data._id
        }));
    };

    useEffect(() => {
        dispatch(fetchPurchases({
            page: pagination.currentPage,
            limit: pagination.pageSize,
            userId: user ? user : data._id
        }));
    }, [dispatch, user, pagination.currentPage, pagination.pageSize]);

    const handleDelete = (deletedId) => {
        dispatch(deletePurchase(deletedId))
    }

    if (purchases.status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <table className="styled-table">
                <thead>
                <tr>
                    <th>{dictionary[language]?.name}</th>
                    <th>{dictionary[language]?.type}</th>
                    <th>{dictionary[language]?.specialist}</th>
                    <th>{dictionary[language]?.price}</th>
                    <th>{dictionary[language]?.purchaseDate}</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {
                    purchases.items.map((pur, i) => (
                        <PurchaseRow
                            key={i}
                            purchase={pur}
                            isAdmin={Boolean(user)}
                            onDelete={handleDelete}
                            dictionary={dictionary}
                            language={language}
                        />))
                }
                </tbody>
            </table>
            <Pagination pagination={pagination} handlePageChange={handlePageChange}/>
        </div>
    );
}

export default PurchasesTable;