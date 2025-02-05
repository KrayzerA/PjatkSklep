import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getDictionary} from "../../redux/slices/languages";

function SubjectTypeInfoPage() {
    const {id} = useParams();
    const [subjectType, setSubjectType] = useState({});
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};

    useEffect(() => {
        fetch(`/subjectTypes/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.subjectType) {
                    setSubjectType(data.subjectType);
                }
                if (data.message) {
                    setError(data.message);
                }
                if (data.error) {
                    setMessage(data.error);
                }
            })
            .catch(err => console.log(err))
    }, [])

    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const createdDate = new Date(subjectType.createdAt).toLocaleDateString("en-US", options);
    const updatedDate = new Date(subjectType.updatedAt).toLocaleDateString("en-US", options);
    return (
        <div>
            {error ? (
                <div>
                    <h1>{message}</h1>
                    <h1>{error}</h1>
                </div>) : (
                <div className={"info-container"}>
                    <div className={"info-wrapper"}>
                        <h2>{dictionary[language]?.name}: {subjectType?.name}</h2>
                        <h2>{dictionary[language]?.created}: {createdDate}</h2>
                        <h2>{dictionary[language]?.updated}: {updatedDate}</h2>
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default SubjectTypeInfoPage;