import React, {useEffect} from "react";
import SubjectTypeTable from "../components/subjectTypes/SubjectTypeTable";
import {useDispatch, useSelector} from "react-redux";
import {deleteSubjectTypes, fetchSubjectTypes} from "../redux/slices/products";

function SubjectTypesPage() {
    const {data} = useSelector(state => state.auth)
    const roles = data?.roles?.map(role => role.name) || [];

    const dispatch = useDispatch();
    const {subjectTypes} = useSelector((state) => state.products);
    const pagination = subjectTypes.pagination;
    const handlePageChange = (page) => {
        dispatch(fetchSubjectTypes({page, limit: pagination.pageSize}));
    };

    useEffect(() => {
        dispatch(fetchSubjectTypes({page: pagination.currentPage, limit: pagination.pageSize}));
    }, [dispatch, pagination.currentPage, pagination.pageSize]);

    const handleDelete = (deletedId) => {
        dispatch(deleteSubjectTypes(deletedId))
    }
    return (
        <div className={"form-body"}>
            <div>
                <SubjectTypeTable
                    roles={roles}
                    pagination={pagination}
                    subjectTypes={subjectTypes}
                    handlePageChange={handlePageChange}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
}

export default SubjectTypesPage;