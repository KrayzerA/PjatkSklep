import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getDictionary} from "../../redux/slices/languages";

function ProductInfoPage() {
    const {id} = useParams();
    const [product, setProduct] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};

    useEffect(() => {
        fetch(`/products/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.product) {
                    setProduct(data.product);
                }
                if (data.message) {
                    setError(data.message);
                }
                if (data.error) {
                    setMessage(data.error);
                }
                setLoading(false);
            })
            .catch(err => console.log(err))
    }, [id])

    if (isLoading) {
        return <div>
            Loading...
        </div>
    }
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const createdDate = new Date(product.createdAt).toLocaleDateString("en-US", options);
    const updatedDate = new Date(product.updatedAt).toLocaleDateString("en-US", options);
    return (
        <div>
            {error ? (
                <div>
                    <h1>{message}</h1>
                    <h1>{error}</h1>
                </div>) : (
                <div className={"info-container"}>
                    <div className={"info-wrapper"}>
                        <h2>{dictionary[language]?.name}: {product.subject.name}</h2>
                        <h2>{dictionary[language]?.abbreviation}: {product.subject.abbreviation}</h2>
                        <h2>{dictionary[language]?.price}: {product.price}</h2>
                        <h2>{dictionary[language]?.available}: {product.availableAmount}</h2>
                        <h2>{dictionary[language]?.subjectType}: {product.subjectType.name}</h2>
                        <h2>{dictionary[language]?.created}: {createdDate}</h2>
                        <h2>{dictionary[language]?.updated}: {updatedDate}</h2>
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default ProductInfoPage;