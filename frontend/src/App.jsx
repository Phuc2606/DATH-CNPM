import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Checkout from "./pages/Checkout/Checkout";
import CheckoutSuccess from "./pages/Checkout/CheckoutSuccess";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/DashBoard";
import ProductManager from "./pages/admin/ProductManager";
import UserManager from "./pages/admin/UserManager";
import SettingsManager from "./pages/admin/SettingsManager";
import OrderManager from "./pages/admin/OrderManager";
import NewsManager from "./pages/admin/NewsManager";
import CommentsManager from "./pages/admin/CommentsManager";
import ContactsManager from "./pages/admin/ContactsManager";
import FAQsManager from "./pages/admin/FAQsManager";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import CategoriesManager from "./pages/admin/CategoriesManager";
import InventoryManager from "./pages/admin/InventoryManager";
import SupplierManager from "./pages/admin/SupplierManager";

import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Homepage />} />

        <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="users" element={<UserManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="comments" element={<CommentsManager />} />
            <Route path="contacts" element={<ContactsManager />} />
            <Route path="faqs" element={<FAQsManager />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="suppliers" element={<SupplierManager />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
