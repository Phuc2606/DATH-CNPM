import React, { useState, useEffect } from "react";
import { IconBuildingStore } from "@tabler/icons-react";
import storeService from "../../services/storeService";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
// Import Component con vừa tách
import BranchCard from "../../components/BranchCard/BranchCard";

const StoreLocator = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await storeService.getStores();
        setStores(data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi tải danh sách cửa hàng:", err);
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <main className="grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <IconBuildingStore size={32} className="text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Hệ thống Cửa hàng
            </h1>
            <p className="text-lg text-gray-600">
              Danh sách các chi nhánh chính thức. Tìm địa điểm gần bạn nhất để
              được phục vụ.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            /* Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {stores.map((store) => (
                // Gọi Component con ở đây
                <BranchCard key={store.BranchID} store={store} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && stores.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <IconBuildingStore
                size={64}
                className="text-gray-300 mx-auto mb-4"
                stroke={1}
              />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Chưa có dữ liệu
              </h3>
              <p className="text-gray-500">
                Hiện chưa có chi nhánh nào được cập nhật trên hệ thống.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StoreLocator;
