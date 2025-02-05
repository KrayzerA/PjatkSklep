import {Link, useNavigate} from "react-router-dom";
import {getToken} from "../../redux/slices/auth";

function SubjectTypeRow({subjectType, roles, onDelete, dictionary, language}) {
    const navigate = useNavigate()

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this subjectType?");
        if (!confirm) return;
        try {
            const response = await fetch(`/subjectTypes/${subjectType._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to delete subjectType.");
                alert(`Error: ${errorData.message || "Failed to delete subjectType."}`);
                return;
            }

            onDelete(subjectType._id)
            navigate("/subjectTypes");
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }
    return (
        <tr>
            <td>{subjectType.name}</td>
            <td><Link to={`/subjectTypes/${subjectType._id}`}>{dictionary[language]?.infoButton}</Link></td>
            {roles.includes('admin') ? <td><Link to={`/subjectTypes/${subjectType._id}/edit`}>{dictionary[language]?.modifyButton}</Link></td>: ''}
            {roles.includes('admin') ? <td><Link to={`/subjectTypes`} onClick={handleDelete}>{dictionary[language]?.deleteButton}</Link></td>: ''}
        </tr>
    );
}

export default SubjectTypeRow;