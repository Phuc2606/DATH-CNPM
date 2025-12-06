import { sql } from "../config/database.js";

const Voucher = {

  async findByCode(code, { transaction } = {}) {
    const request = transaction ? transaction.request() : new sql.Request();

    const result = await request
      .input("code", sql.NVarChar, code.toUpperCase())
      .query(`
        SELECT VoucherID, Type, Discount, ApplicableCondition, TotalQuantity
        FROM Voucher 
        WHERE UPPER(Type) = @code
          AND AvailableDay <= CAST(GETDATE() AS DATE)
          AND ExpiredDay >= CAST(GETDATE() AS DATE)
      `);

    return result.recordset[0] || null;
  },

  // CHECK TỔNG LƯỢT ĐÃ DÙNG SO VỚI TOTALQUANTITY
  async hasStock(voucherId, { transaction } = {}) {
    const request = transaction ? transaction.request() : new sql.Request();

    const result = await request
      .input("vid", sql.Int, voucherId)
      .query(`
        SELECT TotalQuantity,
               (SELECT COUNT(*) FROM VoucherUsage WHERE VoucherID = @vid) AS UsedCount
        FROM Voucher 
        WHERE VoucherID = @vid
      `);

    if (result.recordset.length === 0) return false;
    const { TotalQuantity, UsedCount } = result.recordset[0];

    if (TotalQuantity === null) return true;
    return UsedCount < TotalQuantity;
  },

  async markAsUsed(voucherId, customerId, orderId, { transaction } = {}) {
    const request = transaction ? transaction.request() : new sql.Request();

    await request
      .input("vid", sql.Int, voucherId)
      .input("cid", sql.Int, customerId)
      .input("oid", sql.Int, orderId || null)
      .query(`
        INSERT INTO VoucherUsage (VoucherID, CustomerID, OrderID, UsedAt)
        VALUES (@vid, @cid, @oid, GETDATE())
      `);
  }
};

export default Voucher;