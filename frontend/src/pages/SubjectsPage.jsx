import React, {useEffect} from "react";
import SubjectTable from "../components/subjects/SubjectTable";
import {useDispatch, useSelector} from "react-redux";
import {deleteSubject, fetchSubjects} from "../redux/slices/products";

function SubjectsPage() {
    const {data} = useSelector(state => state.auth)
    const roles = data?.roles?.map(role => role.name) || [];

    const dispatch = useDispatch();
    const {subjects} = useSelector((state) => state.products);
    const pagination = subjects.pagination;
    const handlePageChange = (page) => {
        dispatch(fetchSubjects({page, limit: pagination.pageSize}));
    };

    useEffect(() => {
        dispatch(fetchSubjects({page: pagination.currentPage, limit: pagination.pageSize}));
    }, [dispatch, pagination.currentPage, pagination.pageSize]);

    const handleDelete = (deletedId) => {
        dispatch(deleteSubject(deletedId))
    }

    return (
        <div className={"form-body"}>
            <div>
                <SubjectTable
                    roles={roles}
                    pagination={pagination}
                    subjects={subjects}
                    handlePageChange={handlePageChange}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
}

export default SubjectsPage;