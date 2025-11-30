import { sql } from "../config/database.js";

class Marketing {
  static async createVoucher({ Code, Discount, StartDate, EndDate }) {
    const request = new sql.Request();
    request.input("code", sql.NVarChar, Code);
    request.input("disc", sql.Decimal(18, 2), Discount);
    request.input("start", sql.Date, StartDate);
    request.input("end", sql.Date, EndDate);

    const res = await request.query(
      "INSERT INTO Voucher (Code, Discount, AvailableDay, ExpiredDay) VALUES (@code, @disc, @start, @end); SELECT SCOPE_IDENTITY() as id;"
    );
    return res.recordset[0].id;
  }

  static async findVoucherByCode(code) {
    const request = new sql.Request();
    request.input("code", sql.NVarChar, code);
    const res = await request.query("SELECT * FROM Voucher WHERE Code=@code");
    return res.recordset[0] || null;
  }
}

export default Marketing;
