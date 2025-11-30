import { IconCurrencyDollar, IconShoppingCart } from "@tabler/icons-react";

const Dashboard = () => {
  return (
    <div>
      {/* Hàng thống kê (Stats Grid) */}
      <div className="row row-deck row-cards mb-4">
        {/* Card 1 */}
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Doanh thu</div>
                <div className="ms-auto lh-1">
                  {/* Dropdown menu nếu muốn */}
                </div>
              </div>
              <div className="h1 mb-3">24.500.000đ</div>
              <div className="d-flex mb-2">
                <span className="text-success me-2 d-inline-flex align-items-center font-weight-medium">
                  +5% <IconCurrencyDollar size={16} className="ms-1" />
                </span>
                <span className="text-secondary">so với tháng trước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Đơn hàng mới</div>
              </div>
              <div className="h1 mb-3">1,240</div>
              <div className="d-flex mb-2">
                <div className="progress progress-sm w-100">
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu (Table) */}
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Đơn hàng gần đây</h3>
          </div>
          <div className="table-responsive">
            <table className="table card-table table-vcenter text-nowrap datatable">
              <thead>
                <tr>
                  <th className="w-1">ID</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="text-muted">001</span>
                  </td>
                  <td>Nguyễn Văn A</td>
                  <td>15/10/2025</td>
                  <td>
                    <span className="badge bg-success me-1"></span> Hoàn thành
                  </td>
                  <td>1.200.000đ</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary">
                      Chi tiết
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text-muted">002</span>
                  </td>
                  <td>Trần Thị B</td>
                  <td>14/10/2025</td>
                  <td>
                    <span className="badge bg-warning me-1"></span> Pending
                  </td>
                  <td>500.000đ</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
