import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../layout/app";
import HomePage from "../../../feaatures/home/HomePage";
import Catalog from "../../../feaatures/catalog/Catalog";
import ProductDetails from "../../../feaatures/catalog/ProductDetails";
import AboutPage from "../../../feaatures/about/AboutPage";
import ContactPage from "../../../feaatures/contact/ContactPage";
import ServerError from "../../errors/ServerError";
import NotFound from "../../errors/NotFound";
import BasketPage from "../../../feaatures/basket/BasketPage";
import CheckoutPage from "../../../feaatures/checkout/CheckoutPage";
import LoginForm from "../../../feaatures/account/LoginForm";
import RegisterForm from "../../../feaatures/account/RegisterForm";
import RequireAuth from "./RequireAuth";
import CheckOutSuccess from "../../../feaatures/checkout/CheckOutSuccess";
import OrderPage from "../../../feaatures/orders/OrderPage";
import OrderDetailedPage from "../../../feaatures/orders/OrderDetailedPage";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [
                    { path: '/checkout', element: <CheckoutPage /> },
                    { path: '/checkout/success', element: <CheckOutSuccess /> },
                    { path: '/orders', element: <OrderPage /> },
                    { path: '/orders/:id', element: <OrderDetailedPage /> }
                ]
            },
            { path: '', element: <HomePage /> },
            { path: '/catalog', element: <Catalog /> },
            { path: '/catalog/:id', element: <ProductDetails /> },
            { path: '/about', element: <AboutPage /> },
            { path: '/contact', element: <ContactPage /> },
            { path: '/basket', element: <BasketPage /> },
            { path: '/server-error', element: <ServerError /> },
            { path: '/login', element: <LoginForm /> },
            { path: '/register', element: <RegisterForm /> },
            { path: '/not-found', element: <NotFound /> },
            { path: '*', element: <Navigate replace to='/not-found' /> }
        ]
    }
])
