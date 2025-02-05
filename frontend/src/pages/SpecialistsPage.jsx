import React, {useEffect} from "react";
import SpecialistsTable from "../components/specialists/SpecialistsTable";
import {useDispatch, useSelector} from "react-redux";
import {deleteSpecialist, fetchSpecialists} from "../redux/slices/products";

function SpecialistsPage() {
    const {data} = useSelector(state => state.auth)
    const roles = data?.roles?.map(role => role.name) || [];

    const dispatch = useDispatch();
    const {specialists} = useSelector((state) => state.products);
    const pagination = specialists.pagination;
    const handlePageChange = (page) => {
        dispatch(fetchSpecialists({page, limit: pagination.pageSize}));
    };

    useEffect(() => {
        dispatch(fetchSpecialists({page: pagination.currentPage, limit: pagination.pageSize}));
    }, [dispatch, pagination.currentPage, pagination.pageSize]);

    const handleDelete = (deletedId) => {
        dispatch(deleteSpecialist(deletedId))
    }
    return (
        <div className={"form-body"}>
            <div>
                <SpecialistsTable
                    roles={roles}
                    pagination={pagination}
                    specialists={specialists}
                    handlePageChange={handlePageChange}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
}

export default SpecialistsPage;