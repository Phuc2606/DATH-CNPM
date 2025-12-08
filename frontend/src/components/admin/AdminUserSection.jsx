import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconLogout, IconLogin } from "@tabler/icons-react";
import { getCurrentUser, logout } from "../../services/authService";

const AdminUserSection = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
  }, []);

  // 1. Lấy thông tin User từ LocalStorage khi mới vào
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      try {
        const parsedUser = JSON.parse(loggedInUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Lỗi đọc user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // 2. Hàm đăng xuất
  const handleLogout = async () => {
    try {
      await logout();

      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Lỗi logout:", error);
      toast.error("Lỗi kết nối!");
    }
  };

  if (!user) {
    return (
      <div className="mt-auto p-3">
        <button
          className="btn btn-primary w-100"
          onClick={() => navigate("/login")}
        >
          <IconLogin size={20} className="me-2" /> Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="mt-auto p-3 border-top">
      <div className="d-flex align-items-center gap-2">
        {/* Avatar */}
        {/* <span
          className="avatar avatar-sm rounded-circle"
          style={{
            backgroundImage: `url(https://ui-avatars.com/api/?name=${user.username}&background=random)`,
          }}
        ></span> */}

        {/* Tên & Role */}
        <div className="d-none d-xl-block ps-2">
          <div className="fw-bold text-dark">{user.name}</div>
          <div
            className="small text-muted text-truncate"
            style={{ maxWidth: "100px" }}
          >
            {user.email || "Admin"}
          </div>
        </div>

        {/* Nút Logout nhỏ bên cạnh */}
        <button
          className="btn btn-icon btn-ghost-danger ms-auto"
          title="Đăng xuất"
          onClick={handleLogout}
        >
          <IconLogout size={20} />
        </button>
      </div>
    </div>
  );
};

export default AdminUserSection;
