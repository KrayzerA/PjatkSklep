import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getToken} from "../../redux/slices/auth";
import {useSelector} from "react-redux";
import {getDictionary} from "../../redux/slices/languages";

function PurchaseInfoPage() {
    const {id} = useParams();
    const [purchase, setPurchase] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(true);
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};

    useEffect(() => {
        const method = "GET";
        const url = `/purchases/${id}`;
        fetch(url, {
            method: method,
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.purchase) {
                    setPurchase(data.purchase);
                }
                if (data.error) {
                    setError(data.error);
                }
                setLoading(false)
            })
            .catch(err => {
                console.log(err);
                setError("An unexpected error occurred.");
                setLoading(false);
            })
    }, [id])

    if (isLoading) {
        return <div>
            Loading...
        </div>
    }

    if (!purchase) {
        return <div>No purchase data available.</div>;
    }

    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const createdDate = new Date(purchase.createdAt).toLocaleDateString("en-US", options);
    const updatedDate = new Date(purchase.updatedAt).toLocaleDateString("en-US", options);
    const purchaseDate = new Date(purchase.purchaseDate).toLocaleDateString("en-US", options);
    return (
        <div>
            {error ? (
                <div>
                    <h1>{message}</h1>
                    <h1>{error}</h1>
                </div>) : (
                <div className={"info-container"}>
                    <div className={"info-wrapper"}>
                        <h2>{dictionary[language]?.specialist}: {purchase.specialist?.firstName} {purchase.specialist?.lastName}</h2>
                        <h2>{dictionary[language]?.subject}: {purchase.product?.subject?.name}</h2>
                        <h2>{dictionary[language]?.abbreviation}: {purchase.product?.subject?.abbreviation}</h2>
                        <h2>{dictionary[language]?.type}: {purchase.product?.subjectType?.name}</h2>
                        <h2>{dictionary[language]?.price}: {purchase.product?.price}</h2>
                        <h2>{dictionary[language]?.purchaseDate}: {purchaseDate}</h2>
                        <h2>{dictionary[language]?.created}: {createdDate}</h2>
                        <h2>{dictionary[language]?.updated}: {updatedDate}</h2>
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default PurchaseInfoPage;