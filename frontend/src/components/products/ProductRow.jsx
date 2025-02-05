import {Link, useNavigate} from "react-router-dom";
import {getToken} from "../../redux/slices/auth";

function ProductRow({product, roles, onDelete, dictionary, language}) {
    const navigate = useNavigate()

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this product?");
        if (!confirm) return;
        try {
            const response = await fetch(`/products/${product._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to delete product.");
                alert(`Error: ${errorData.message || "Failed to delete product."}`);
                return;
            }

            onDelete(product._id)
            navigate("/products");
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }
    if (!product){
        return <p>Loading...</p>
    }
    return (
        <tr>
            <td>{product.subject?.name || "N/A"}</td>
            <td>{product.subjectType?.name || "N/A"}</td>
            <td>{product.price}</td>
            <td>{product.availableAmount}</td>
            <td><Link to={`/products/${product._id}`}>{dictionary[language]?.infoButton}</Link></td>
            {roles.includes('admin') ? <td><Link to={`/products/${product._id}/edit`}>{dictionary[language]?.modifyButton}</Link></td>: ''}
            {roles.includes('admin') ? <td><Link to={`/products`} onClick={handleDelete}>{dictionary[language]?.deleteButton}</Link></td>: ''}
            {roles.includes('user') ? <td><Link className={'buy-btn'} to={`/products/${product._id}/buy`}>{dictionary[language]?.buyButton}</Link></td>: ''}
        </tr>
    );
}

export default ProductRow;