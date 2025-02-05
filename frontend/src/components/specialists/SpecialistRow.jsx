import {Link, useNavigate} from "react-router-dom";
import {getToken} from "../../redux/slices/auth";

function SpecialistRow({specialist, roles, onDelete, dictionary, language}) {
    const navigate = useNavigate()

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this specialist?");
        if (!confirm) return;
        try {
            const response = await fetch(`/specialists/${specialist._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to delete specialist.");
                alert(`Error: ${errorData.message || "Failed to delete specialist."}`);
                return;
            }

            onDelete(specialist._id)
            navigate("/specialists");
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }
    return (
        <tr>
            <td>{specialist.firstName}</td>
            <td>{specialist.lastName}</td>
            <td><Link to={`/specialists/${specialist._id}`}>{dictionary[language]?.infoButton}</Link></td>
            {roles.includes('admin') ? <td><Link to={`/specialists/${specialist._id}/edit`}>{dictionary[language]?.modifyButton}</Link></td> : ''}
            {roles.includes('admin') ? <td><Link to={`/specialists`} onClick={handleDelete}>{dictionary[language]?.deleteButton}</Link></td> : ''}
        </tr>
    );
}

export default SpecialistRow;