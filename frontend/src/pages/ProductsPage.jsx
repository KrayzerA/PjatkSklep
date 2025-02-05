import React, {useEffect} from "react";
import ProductsTable from "../components/products/ProductsTable";
import {useDispatch, useSelector} from "react-redux";
import {deleteProducts, fetchProducts} from "../redux/slices/products";

function ProductsPage() {
    const {data} = useSelector(state => state.auth)
    const roles = data?.roles?.map(role => role.name) || [];

    const dispatch = useDispatch();
    const {products} = useSelector((state) => state.products);
    const pagination = products.pagination;
    const handlePageChange = (page) => {
        dispatch(fetchProducts({page, limit: pagination.pageSize}));
    };

    useEffect(() => {
        dispatch(fetchProducts({page: pagination.currentPage, limit: pagination.pageSize}));
    }, [dispatch, pagination.currentPage, pagination.pageSize]);

    const handleDelete = (deletedId) => {
        dispatch(deleteProducts(deletedId))
    }
    return (
        <div className={"form-body"}>
            <div>
                <ProductsTable
                    roles={roles}
                    pagination={pagination}
                    products={products}
                    handlePageChange={handlePageChange}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
}

export default ProductsPage;