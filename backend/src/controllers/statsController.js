import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/UserModel.js";

export const getStats = async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    const totalProducts = products.length;
    // orders
    const pool = await (await import("../config/database.js")).sql.connect();
    const ordersRes = await pool
      .request()
      .query("SELECT COUNT(*) as total FROM [Order]");
    const totalOrders = ordersRes.recordset[0]?.total || 0;
    // users
    const usersRes = await pool
      .request()
      .query("SELECT COUNT(*) as total FROM Customer");
    const totalUsers = usersRes.recordset[0]?.total || 0;

    res.json({ totalProducts, totalOrders, totalUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { getStats };
