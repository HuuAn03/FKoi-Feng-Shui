import React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/home";
import Dashboard from "./components/dashboard";
import ManageCategory from "./pages/admin/manage-category";
import ManageStore from "./pages/admin/manage-store";
import ManageServiceGroup from "./pages/admin/manage-store-group";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "./components/layout";
import ProductPage from "./pages/Product";
import ADS from "./pages/Ads";
import FateCalculator from "./pages/destiny";
import User from "./pages/user/User";
import SuccessPage from "./pages/success/success";
import BlogPage from "./pages/blog/blog";
import ManageProduct from "./pages/admin/manage-product/manageProduct";
import ProductDetailPage from "./pages/Product/productDetail";
import BlogDetail from "./pages/blog/blogDetail";
import BlogList from "./pages/admin/manage-store-group/blogList";


function App() {
  const ProtectRouteAuth = ({ children }) => {
    const user = useSelector((store) => store.user);
    console.log(user);

    if (user && user?.role === "ADMIN") {
      return children;
    }
    toast.error("You are not allowed to access this!");
    return <Navigate to={"auth/login"} />;
  };

  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "adv",
          element: <ADS />,
        },
        {
          path: "product",
          element: <ProductPage />,
        },
        {
          path: "destiny",
          element: <FateCalculator />,
        },
        {
          path: "user",
          element: <User/>,
        },
        {
          path: "success",
          element: <SuccessPage/>,
        },
        {
          path: "blog",
          element: <BlogPage/>,
        },
        {
          path: "blog/:blogId",
          element: <BlogDetail/>,
        },
        {
        path: "product",
          element: <ProductPage />,
        },
        {
          path: "/product/:id",
          element: <ProductDetailPage />,
        },
        
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
    },

    {
      path: "register",
      element: <RegisterPage />,
    },

    {
      path: "dashboard",
      element: (
        <ProtectRouteAuth>
          <Dashboard />
        </ProtectRouteAuth>
      ),
      children: [
        {
          path: "category",
          element: <ManageCategory />,
        },
        {
          path: "store",
          element: <ManageStore />,
        },
        {
          path: "manage-blog",
          element: <ManageServiceGroup />,
        },
        {
          path: "manage-product",
          element: <ManageProduct />,
        },
        {
          path: "service-group",
          element: <BlogList />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
