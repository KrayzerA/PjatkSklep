import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getDictionary} from "../../redux/slices/languages";

function SpecialistInfoPage() {
    const {id} = useParams();
    const [specialist, setSpecialist] = useState({});
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};

    useEffect(() => {
        fetch(`/specialists/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.specialist) {
                    setSpecialist(data.specialist);
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
    const createdDate = new Date(specialist.createdAt).toLocaleDateString("en-US", options);
    const updatedDate = new Date(specialist.updatedAt).toLocaleDateString("en-US", options);
    return (
        <div>
            {error ? (
                <div>
                    <h1>{message}</h1>
                    <h1>{error}</h1>
                </div>) : (
                <div className={"info-container"}>
                    <div className={"info-wrapper"}>
                        <h2>{dictionary[language]?.firstName}: {specialist?.firstName}</h2>
                        <h2>{dictionary[language]?.lastName}: {specialist?.lastName}</h2>
                        <h2>{dictionary[language]?.created}: {createdDate}</h2>
                        <h2>{dictionary[language]?.updated}: {updatedDate}</h2>
                        <h2>{dictionary[language]?.specialist} {dictionary[language]?.subjects}: {specialist.subjects?.map((sub,i) => <p key={i}>
                            <i>{sub.abbreviation}:{sub.name}</i>
                        </p>)}</h2>
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default SpecialistInfoPage;