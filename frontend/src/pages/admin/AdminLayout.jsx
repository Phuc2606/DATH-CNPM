import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconBox, // Sản phẩm (#3)
  IconShoppingCart, // Đơn hàng (#3)
  IconStar, // Bình luận/Đánh giá (#4)
  IconCategory, // Hỏi đáp/FAQ (#2)
  IconTruckDelivery, // Cấu hình thông tin trang (#1, #2)
  IconUsers, // Quản lý người dùng (#1, #2)
  IconBuildingWarehouse,
  IconTicket,
} from "@tabler/icons-react";
import AdminUserSection from "../../components/admin/AdminUserSection";

const AdminLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // === LOAD CSS TỪ CDN (Giữ nguyên phần này của bạn) ===
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta20/dist/css/tabler.min.css";
    link.id = "tabler-cdn-css";
    document.head.appendChild(link);
    // 2. Load CSS "Diệt Thanh Cuộn" (THÊM ĐOẠN NÀY)
    const style = document.createElement("style");
    style.id = "hide-scrollbar-style";
    style.innerHTML = `
      /* Ẩn thanh cuộn cho Chrome/Safari/Edge */
      #sidebar-menu::-webkit-scrollbar {
        display: none !important;
        width: 0px !important;
        background: transparent !important;
      }
      
      /* Ẩn cho Firefox */
      #sidebar-menu {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      /* Fix luôn cho cả cái thanh dọc chứa nó (phòng hờ) */
      .navbar-vertical.navbar-expand-lg {
        overflow-y: auto; 
      }
      .navbar-vertical.navbar-expand-lg::-webkit-scrollbar {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    document.body.classList.add("admin-mode");

    return () => {
      const existingLink = document.getElementById("tabler-cdn-css");
      if (existingLink) {
        existingLink.remove();
      }
      document.body.classList.remove("admin-mode");
    };
  }, []);

  const menuItems = [
    // --- NHÓM 1: KHO & SẢN PHẨM (Inventory) ---
    // Bổ sung: Category, Supplier, Branch
    {
      header: "KHO HÀNG", // (Optional) Dùng để render tiêu đề nhóm
    },
    {
      label: "Sản phẩm",
      icon: <IconBox size={20} />,
      path: "/admin/products",
    },
    {
      label: "Danh mục", // Cần thiết để map với bảng Category
      icon: <IconCategory size={20} />,
      path: "/admin/categories",
    },
    {
      label: "Nhà cung cấp", // Map với bảng Supplier
      icon: <IconTruckDelivery size={20} />,
      path: "/admin/suppliers",
    },
    {
      label: "Kho & Chi nhánh", // Map với bảng Branch & Store
      icon: <IconBuildingWarehouse size={20} />,
      path: "/admin/inventory",
    },

    // --- NHÓM 2: BÁN HÀNG (Sales) ---
    {
      header: "KINH DOANH",
    },
    {
      label: "Đơn hàng",
      icon: <IconShoppingCart size={20} />,
      path: "/admin/orders",
    },
    {
      label: "Khách hàng", // Quản lý user role Customer
      icon: <IconUsers size={20} />,
      path: "/admin/users",
    },

    // --- NHÓM 3: MARKETING (Mới thêm) ---
    // Map với bảng Voucher & SaleOffEvent
    {
      header: "MARKETING",
    },

    {
      label: "Đánh giá (Review)", // Map với bảng Review
      icon: <IconStar size={20} />,
      path: "/admin/reviews",
    },
  ];

  const currentItem = menuItems.find((item) => item.path === location.pathname);
  const pageTitle = currentItem ? currentItem.label : "Sản phẩm";

  return (
    <div className="page">
      <aside className="navbar navbar-vertical navbar-expand-lg navbar-light bg-white border-end">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <h1 className="navbar-brand navbar-brand-autodark">
            <Link to="/admin" className="text-decoration-none">
              <span className="text-primary fs-2 fw-bold">MY ADMIN</span>
            </Link>
          </h1>

          <div
            className={`collapse navbar-collapse d-lg-block ${
              isMobileMenuOpen ? "show" : ""
            }`}
            id="sidebar-menu"
            style={{ display: isMobileMenuOpen ? "block" : undefined }}
          >
            <ul className="navbar-nav ps-2 pt-3">
              {menuItems.map((item, index) => (
                <li
                  className={`nav-item ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  key={item.path || index}
                >
                  <Link
                    className="nav-link"
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      {item.icon}
                    </span>
                    <span className="nav-link-title">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <AdminUserSection />
        </div>
      </aside>

      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">{pageTitle}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
