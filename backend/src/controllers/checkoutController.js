import CartModel from "../models/CartModel.js";
import OrderModel from "../models/OrderModel.js";

export const checkout = async (req, res) => {
  try {
    const { cartId, customerId, paymentMethod } = req.body;

    const cart = await CartModel.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const items = await CartModel.getItems(cartId);
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Calculate total
    let total = 0;
    for (const it of items) {
      total += (it.Price || 0) * (it.Quantity || 1);
    }

    const order = new OrderModel({
      CustomerID: customerId,
      TotalAmount: total,
    });
    await order.save();

    for (const it of items) {
      await OrderModel.addItem(order.OrderID, {
        ProductID: it.ProductID,
        Quantity: it.Quantity,
        Price: it.Price,
      });
    }

    // Payment placeholder: create Payment record (simple)
    // In real app integrate payment gateway
    const pool = await (await import("../config/database.js")).sql.connect();
    await pool
      .request()
      .input(
        "orderId",
        (
          await import("../config/database.js")
        ).sql.Int,
        order.OrderID
      )
      .input(
        "amount",
        (await import("../config/database.js")).sql.Decimal(18, 2),
        total
      )
      .input(
        "method",
        (
          await import("../config/database.js")
        ).sql.NVarChar,
        paymentMethod || "unknown"
      )
      .query(
        "INSERT INTO Payment (OrderID,Amount,Method,PaidAt) VALUES (@orderId,@amount,@method,GETDATE())"
      );

    res.status(201).json({ message: "Order created", orderId: order.OrderID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { checkout };
