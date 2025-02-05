import {Link} from "react-router-dom";
import {getToken} from "../../redux/slices/auth";

function PurchaseRow({purchase, onDelete,isAdmin, dictionary, language}) {

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this purchase?");
        if (!confirm) return;
        try {
            const response = await fetch(`/purchases/${purchase._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to delete purchase.");
                alert(`Error: ${errorData.message || "Failed to delete purchase."}`);
                return;
            }

            onDelete(purchase._id)
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const purchaseDate = new Date(purchase.purchaseDate).toLocaleDateString("en-US", options);
    return (
        <tr>
            <td>{purchase.product.subject?.name}</td>
            <td>{purchase.product.subjectType?.name}</td>
            <td>{purchase.specialist?.firstName} {purchase.specialist?.lastName}</td>
            <td>{purchase.product?.price}</td>
            <td>{purchaseDate}</td>
            <td><Link to={`/purchases/${purchase._id}`}>{dictionary[language]?.infoButton}</Link></td>
            <td><Link to={isAdmin ? '/admin' : '/userview'} onClick={handleDelete}>{dictionary[language]?.deleteButton}</Link></td>
        </tr>
    );
}

export default PurchaseRow;