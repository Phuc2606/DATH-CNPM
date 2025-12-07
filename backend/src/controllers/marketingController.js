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
export const updateVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    const { code, discount, expireDate } = req.body;
    const updateResult = await sql.query(
      `UPDATE Vouchers SET code = '${code}', discount = ${discount}, expireDate = '${expireDate}' WHERE id = ${id}`
    );
    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, error: 'Voucher not found' });
    }
    return res.status(200).json({ success: true, message: 'Voucher updated' });
  } catch (error) {
    console.error('Error updating voucher:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteResult = await sql.query(`DELETE FROM Vouchers WHERE id = ${id}`);
    if (deleteResult.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, error: 'Voucher not found' });
    }
    return res.status(200).json({ success: true, message: 'Voucher deleted' });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
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
export const createEvent = async (req, res) => {
  try {
    const { name, startDate, endDate, description } = req.body;
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }
    await sql.query(
      `INSERT INTO SaleOffEvents (name, startDate, endDate, description) VALUES ('${name}', '${startDate}', '${endDate}', '${description}')`
    );
    return res.status(201).json({ success: true, message: 'Event created' });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, startDate, endDate, description } = req.body;
    const updateResult = await sql.query(
      `UPDATE SaleOffEvents SET name = '${name}', startDate = '${startDate}', endDate = '${endDate}', description = '${description}' WHERE id = ${id}`
    );
    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, message: 'Event updated' });
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteResult = await sql.query(`DELETE FROM SaleOffEvents WHERE id = ${id}`);
    if (deleteResult.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export default { createVoucher, updateVoucher, getVoucherByCode, deleteVoucher, assignVoucherToProduct, createEvent, updateEvent, deleteEvent};
