import OrderModel from "../models/OrderModel.js";

export const listOrders = async (req, res) => {
  try {
    const pool = await (await import("../config/database.js")).sql.connect();
    const resOrders = await pool
      .request()
      .query("SELECT * FROM [Order] ORDER BY CreatedAt DESC");
    res.json(resOrders.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const items = await OrderModel.getItems(id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pool = await (await import("../config/database.js")).sql.connect();
    await pool
      .request()
      .input("id", (await import("../config/database.js")).sql.Int, id)
      .input(
        "status",
        (
          await import("../config/database.js")
        ).sql.NVarChar,
        status
      )
      .query("UPDATE [Order] SET Status=@status WHERE OrderID=@id");
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { listOrders, getOrder, updateOrderStatus };
