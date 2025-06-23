import { createBrowserRouter } from "react-router-dom";
import App from "../../layout/app";
import HomePage from "../../../feaatures/home/HomePage";
import Catalog from "../../../feaatures/catalog/Catalog";
import ProductDetails from "../../../feaatures/catalog/ProductDetails";
import AboutPage from "../../../feaatures/about/AboutPage";
import ContactPage from "../../../feaatures/contact/ContactPage";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element:<HomePage />},
            {path: '/catalog', element:<Catalog />},
            {path: '/catalog/:id', element:<ProductDetails />},
            {path: '/about', element:<AboutPage />},
            {path: '/contact', element:<ContactPage />},
        ]
    }
])
