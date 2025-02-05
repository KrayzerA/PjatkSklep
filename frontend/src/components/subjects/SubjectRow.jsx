import {Link, useNavigate} from "react-router-dom";
import {getToken} from "../../redux/slices/auth";

function SubjectRow({subject, roles, onDelete, dictionary, language}) {
    const navigate = useNavigate()

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this subject?");
        if (!confirm) return;
        try {
            const response = await fetch(`/subjects/${subject._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message || "Failed to delete subject.");
                alert(`Error: ${errorData.message || "Failed to delete subject."}`);
                return;
            }

            onDelete(subject._id)
            navigate("/subjects");
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }
    return (
        <tr>
            <td>{subject.name}</td>
            <td>{subject.abbreviation}</td>
            <td><Link to={`/subjects/${subject._id}`}>{dictionary[language]?.infoButton}</Link></td>
            {roles.includes('admin') ? <td><Link to={`/subjects/${subject._id}/edit`}>{dictionary[language]?.modifyButton}</Link></td>: ''}
            {roles.includes('admin') ? <td><Link to={`/subjects`} onClick={handleDelete}>{dictionary[language]?.deleteButton}</Link></td>: ''}
        </tr>
    );
}

export default SubjectRow;