CREATE DATABASE OnlineShopDB;
GO
USE OnlineShopDB;
GO
CREATE TABLE Branch (
    BranchID INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Address NVARCHAR(200),
    Expense DECIMAL(18,2),
    AvailableCapacity INT
);

-- New
CREATE TABLE Category (
        CategoryID VARCHAR(20) PRIMARY KEY, 
        Name NVARCHAR(100) NOT NULL,
        Icon NVARCHAR(50)
);

CREATE TABLE Product (
    ProductID INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(200),
    Brand NVARCHAR(100),
    Category VARCHAR(20), 
    Price DECIMAL(18,2),
    Stock INT,
    Description NVARCHAR(MAX), 
    ImageURL NVARCHAR(MAX), -- New
    
    CONSTRAINT FK_Product_Category FOREIGN KEY (Category) REFERENCES Category(CategoryID) -- New
);

CREATE TABLE Supplier (
    SupplierID INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(200),
    Address NVARCHAR(200),
    PhoneNumber NVARCHAR(20),
    TaxNumber NVARCHAR(50)
);
CREATE TABLE ProductSupplier (
    ProductID INT NOT NULL,
    SupplierID INT NOT NULL,
    CONSTRAINT PK_ProductSupplier PRIMARY KEY (ProductID, SupplierID),
    CONSTRAINT FK_PS_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    CONSTRAINT FK_PS_Supplier FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID)
);
CREATE TABLE Voucher (
    VoucherID INT IDENTITY PRIMARY KEY,
    Type NVARCHAR(100),
    Discount DECIMAL(18,2),
    ApplicableCondition NVARCHAR(200),
    AvailableDay DATE,
    ExpiredDay DATE
);
CREATE TABLE ProductVoucher (
    ProductID INT NOT NULL,
    VoucherID INT NOT NULL,
    CONSTRAINT PK_ProductVoucher PRIMARY KEY (ProductID, VoucherID),
    CONSTRAINT FK_PV_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    CONSTRAINT FK_PV_Voucher FOREIGN KEY (VoucherID) REFERENCES Voucher(VoucherID)
);
CREATE TABLE Customer (
    CustomerID INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100),
    DateOfBirth DATE,
    Email NVARCHAR(100) UNIQUE,
    PasswordHash NVARCHAR(200),
    PhoneNumber NVARCHAR(20),
    Gender NVARCHAR(20),
    Address NVARCHAR(200),
    Role NVARCHAR(20) DEFAULT 'Customer', -- 'Admin' hoặc 'Customer' (NEW)
);

CREATE TABLE Cart (
    CartID INT IDENTITY PRIMARY KEY,
    CustomerID INT UNIQUE,
    CONSTRAINT FK_Cart_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);
CREATE TABLE CartItem (
    CartID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT CHECK (Quantity > 0),
    CONSTRAINT PK_CartItem PRIMARY KEY (CartID, ProductID),
    CONSTRAINT FK_CI_Cart FOREIGN KEY (CartID) REFERENCES Cart(CartID),
    CONSTRAINT FK_CI_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);
CREATE TABLE [Order] (
    OrderID INT IDENTITY PRIMARY KEY,
    CustomerID INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    Description NVARCHAR(500),
    DeliveryLocation NVARCHAR(200),
    Weight DECIMAL(10,2),
    Status NVARCHAR(50),
    OrderType CHAR(1) NULL,
    CONSTRAINT FK_Order_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);
CREATE TABLE Store (
    BranchID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    CONSTRAINT PK_Store PRIMARY KEY (BranchID, ProductID),
    CONSTRAINT FK_Store_Branch FOREIGN KEY (BranchID) REFERENCES Branch(BranchID),
    CONSTRAINT FK_Store_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);
CREATE TABLE OrderItem (
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT CHECK (Quantity > 0),
    UnitPrice DECIMAL(18,2),
    CONSTRAINT PK_OrderItem PRIMARY KEY (OrderID, ProductID),
    CONSTRAINT FK_OI_Order FOREIGN KEY (OrderID) REFERENCES [Order](OrderID),
    CONSTRAINT FK_OI_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);
CREATE TABLE Payment (
    PaymentID INT IDENTITY PRIMARY KEY,
    OrderID INT UNIQUE NOT NULL,
    Method NVARCHAR(50),
    Status NVARCHAR(50),
    PaymentDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Payment_Order FOREIGN KEY (OrderID) REFERENCES [Order](OrderID)
);
CREATE TABLE Bill (
    BillID INT IDENTITY PRIMARY KEY,
    OrderID INT UNIQUE NOT NULL,
    PaymentMethod NVARCHAR(50),
    PaymentStatus NVARCHAR(50),
    Address NVARCHAR(200),
    TaxIdentificationNumber NVARCHAR(50),
    CONSTRAINT FK_Bill_Order FOREIGN KEY (OrderID) REFERENCES [Order](OrderID)
);
CREATE TABLE SaleOffEvent (
    EventID INT IDENTITY PRIMARY KEY,
    EventName NVARCHAR(200),
    StartDay DATE,
    EndDay DATE,
    MinimumMoney DECIMAL(18,2),
    BelongToCategories NVARCHAR(200),
    AgeRestrictions NVARCHAR(100),
    DiscountAmount DECIMAL(18,2),
    DiscountType NVARCHAR(50)
);
ALTER TABLE [Order]
ADD EventID INT NULL,
    CONSTRAINT FK_Order_Event FOREIGN KEY (EventID) REFERENCES SaleOffEvent(EventID);
CREATE TABLE Review (
    ReviewID INT IDENTITY PRIMARY KEY,
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    StarRating INT CHECK (StarRating BETWEEN 1 AND 5),
    Note NVARCHAR(500),
    ReviewTime DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Review_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    CONSTRAINT FK_Review_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

