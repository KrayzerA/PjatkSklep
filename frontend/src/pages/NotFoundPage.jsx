import {Link} from "react-router-dom";

function NotFoundPage() {
    return (
        <>
            <h1> 404 - Page does not exists!</h1>
            <Link to={"/"}>Go to homepage</Link>
        </>
    );
}

export default NotFoundPage;