import './App.css';
import React, {useEffect} from "react";
import {Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import AddNewProductForm from "./components/products/AddNewProductForm";
import AddNewSpecialistForm from "./components/specialists/AddNewSpecialistForm";
import ProductInfoPage from "./pages/info/ProductInfoPage";
import Userview from "./pages/Userview";
import Layout from "./pages/Layout";
import SpecialistsPage from "./pages/SpecialistsPage";
import SpecialistInfoPage from "./pages/info/SpecialistInfoPage";
import {useDispatch} from "react-redux";
import {fetchUser} from "./redux/slices/auth";
import SubjectsPage from "./pages/SubjectsPage";
import AddNewSubjectForm from "./components/subjects/AddNewSubjectForm";
import SubjectInfoPage from "./pages/info/SubjectInfoPage";
import SubjectTypesPage from "./pages/SubjectTypesPage";
import SubjectTypeInfoPage from "./pages/info/SubjectTypeInfoPage";
import AddNewSubjectTypeForm from "./components/subjectTypes/AddNewSubjectTypeForm";
import AdminMenuPage from "./pages/AdminMenuPage";
import AddRole from "./components/admin/AddRole";
import AssignRole from "./components/admin/AssignRole";
import AssignSpecialist from "./components/admin/AssignSpecialist";
import PurchaseForm from "./components/purchases/PurchaseForm";
import DonateToUserForm from "./components/admin/DonateToUserForm";
import PurchaseInfoPage from "./pages/info/PurchaseInfoPage";
import DeleteUserPurchase from "./components/admin/DeleteUserPurchase";

function App() {
    const dispatch = useDispatch()

    window.localStorage.setItem('currentLanguage', 'EN')

    useEffect(() => {
        fetch('/dictionary')
            .then(response => response.json())
            .then(dict => window.localStorage.setItem('dictionary',JSON.stringify(dict)))
            .catch(err=> console.log(err));
        dispatch(fetchUser())
    }, []);

    return (
        <div className="App">
            <Routes>
                <Route path={"/"} element={<Layout/>}>
                    <Route index element={<HomePage/>}/>

                    <Route path={"/products"} element={<ProductsPage/>}/>
                    <Route path={"/subjects"} element={<SubjectsPage/>}/>
                    <Route path={"/specialists"} element={<SpecialistsPage/>}/>
                    <Route path={"/subjectTypes"} element={<SubjectTypesPage/>}/>

                    <Route path={"/products/:id"} element={<ProductInfoPage/>}/>
                    <Route path={"/subjects/:id"} element={<SubjectInfoPage/>}/>
                    <Route path={"/specialists/:id"} element={<SpecialistInfoPage/>}/>
                    <Route path={"/subjectTypes/:id"} element={<SubjectTypeInfoPage/>}/>
                    <Route path={"/purchases/:id"} element={<PurchaseInfoPage/>}/>

                    <Route path={"/products/:id/edit"} element={<AddNewProductForm/>}/>
                    <Route path={"/subjects/:id/edit"} element={<AddNewSubjectForm/>}/>
                    <Route path={"/specialists/:id/edit"} element={<AddNewSpecialistForm/>}/>
                    <Route path={"/subjectTypes/:id/edit"} element={<AddNewSubjectTypeForm/>}/>

                    <Route path={"/products/create"} element={<AddNewProductForm/>}/>
                    <Route path={"/subjects/create"} element={<AddNewSubjectForm/>}/>
                    <Route path={"/specialists/create"} element={<AddNewSpecialistForm/>}/>
                    <Route path={"/subjectTypes/create"} element={<AddNewSubjectTypeForm/>}/>

                    <Route path={"/admin"} element={<AdminMenuPage/>}/>
                    <Route path={"/admin/addRole"} element={<AddRole/>}/>
                    <Route path={"/admin/assignRole"} element={<AssignRole/>}/>
                    <Route path={"/admin/assignSpecialist"} element={<AssignSpecialist/>}/>
                    <Route path={"/admin/donateToUser"} element={<DonateToUserForm/>}/>
                    <Route path={"/admin/deleteUserPurchase"} element={<DeleteUserPurchase/>}/>

                    <Route path={"/userview"} element={<Userview/>}/>
                    <Route path={"/products/:id/buy"} element={<PurchaseForm/>}/>
                </Route>
                <Route path={"/login"} element={<LoginPage/>}/>
                <Route path={"/register"} element={<RegisterPage/>}/>
                <Route path={"*"} element={<NotFoundPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
