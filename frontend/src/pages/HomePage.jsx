import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchSubjects, fetchSubjectTypes} from "../redux/slices/products";
import {getDictionary} from "../redux/slices/languages";


function HomePage() {
    const dispatch = useDispatch()
    const {subjectTypes, subjects} = useSelector(state => state.products)
    const language = useSelector(state => state.languages)
    const dictionary = getDictionary() || {EN:""};

    useEffect(() => {
        dispatch(fetchSubjectTypes({page: 1, limit: 5}))
        dispatch(fetchSubjects({page: 1, limit: 5}))
    }, []);

    return (
        <div>
            <div className="content">
                <div className="info">
                    <h1>{dictionary[language]?.mainPhrase}</h1>
                    <p>{dictionary[language]?.mainPhrase1}, <span>{dictionary[language]?.mainPhrase2}</span></p>
                </div>
                <div className="wszystkietowary">
                    <div className="towary">
                        <h2 id="towary">{dictionary[language]?.subjectTypes}</h2>
                        <ul>
                            {subjectTypes.items.map((sub, i) => (<li key={i}>{sub.name}</li>))}
                        </ul>
                    </div>
                    <div className="towary">
                        <h2 id="popularneTowary">{dictionary[language]?.popularSubjects}</h2>
                        <ol>
                            <ul>
                                {subjects.items.map((sub, i) => (<li key={i}>{sub.abbreviation}: {sub.name}</li>))}
                            </ul>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;