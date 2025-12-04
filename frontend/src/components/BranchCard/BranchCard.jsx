import React from "react";
import {
  IconMapPin,
  IconClock,
  IconPhone,
  IconArrowUpRight,
} from "@tabler/icons-react";

const BranchCard = ({ store }) => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 transition-all duration-300 p-6 h-full">
      {/* 1. Card Header: Icon lớn + Tên Branch */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Icon điểm nhấn */}
          <div className="w-12 h-12 flex shrink-0 items-center justify-center bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <IconMapPin size={24} stroke={1.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {store.Name}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      {/* 2. Card Body: Thông tin chi tiết */}
      <div className="flex-1 space-y-4 text-gray-600 mb-6">
        {/* Địa chỉ */}
        <div className="flex items-start gap-3">
          <IconMapPin className="shrink-0 text-gray-400 mt-1" size={20} />
          <span className="leading-relaxed">{store.Address}</span>
        </div>

        {/* Giờ mở cửa */}
        <div className="flex items-center gap-3 py-2 border-t border-b border-gray-50">
          <IconClock className="shrink-0 text-gray-400" size={20} />
          <span>08:00 - 22:00 (Tất cả các ngày)</span>
        </div>

        {/* Số điện thoại */}
        {store.Phone ? (
          <div className="flex items-center gap-3">
            <IconPhone className="shrink-0 text-gray-400" size={20} />
            <a
              href={`tel:${store.Phone}`}
              className="font-medium text-gray-900 hover:text-blue-600 transition"
            >
              {store.Phone}
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-gray-400">
            <IconPhone className="shrink-0" size={20} />
            <span>Liên hệ tại cửa hàng</span>
          </div>
        )}
      </div>

      {/* 3. Card Footer: Nút chỉ đường */}
      <div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            store.Address + " " + store.Name
          )}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 bg-gray-50 hover:bg-blue-50 text-gray-900 hover:text-blue-700 font-semibold rounded-xl transition-colors duration-300 group-hover:border-blue-200 border border-transparent"
        >
          Chỉ đường ngay
          <IconArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
};

export default BranchCard;
