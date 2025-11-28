import MarketingModel from "../models/MarketingModel.js";

export const createVoucher = async (req, res) => {
  try {
    const { Code, DiscountPercent, StartDate, EndDate } = req.body;
    const v = await MarketingModel.createVoucher({
      Code,
      DiscountPercent,
      StartDate,
      EndDate,
    });
    res.status(201).json(v);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVoucherByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const v = await MarketingModel.findVoucherByCode(code);
    if (!v) return res.status(404).json({ message: "Voucher not found" });
    res.json(v);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignVoucherToProduct = async (req, res) => {
  try {
    const { ProductID, VoucherID } = req.body;
    const pool = await (await import("../config/database.js")).sql.connect();
    const inserted = await pool
      .request()
      .input(
        "productId",
        (
          await import("../config/database.js")
        ).sql.Int,
        ProductID
      )
      .input(
        "voucherId",
        (
          await import("../config/database.js")
        ).sql.Int,
        VoucherID
      )
      .query(
        "INSERT INTO ProductVoucher (ProductID,VoucherID) VALUES (@productId,@voucherId); SELECT SCOPE_IDENTITY() as id;"
      );
    res.status(201).json(inserted.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { createVoucher, getVoucherByCode, assignVoucherToProduct };
