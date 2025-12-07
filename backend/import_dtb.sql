USE OnlineShopDB;
GO
INSERT INTO Branch (Name, Address, Expense, AvailableCapacity) VALUES
('Branch HCM 1', 'District 1, HCM', 15000, 200),
('Branch HCM 2', 'District 3, HCM', 10000, 180),
('Branch Hanoi', 'Cau Giay, Hanoi', 12000, 150),
('Branch Danang', 'Hai Chau, Danang', 9000, 120),
('Branch Can Tho', 'Ninh Kieu, Can Tho', 7000, 100);

USE OnlineShopDB;
GO
-- 1. Insert Danh mục sản phẩm với icon
INSERT INTO Category (CategoryID, Name, Icon) VALUES
('cat-1', N'Laptop', 'PiLaptopFill'),
('cat-2', N'Thiết bị đeo', 'PiWatchFill'), -- Smartwatch
('cat-3', N'Tai nghe', 'PiHeadphonesFill'),
('cat-4', N'Loa', 'PiSpeakerHighFill'),
('cat-5', N'Điện thoại', 'PiDeviceMobileFill'),
('cat-6', N'Tablet', 'PiDeviceTabletFill'),
('cat-7', N'Camera', 'PiCameraFill'),
('cat-8', N'Gaming', 'PiGameControllerFill');
GO

INSERT INTO Supplier (Name, Address, PhoneNumber, TaxNumber) VALUES
('Tech Distribution Co','HCM','0281111111','SUP001'),
('Global IT Supply','Hanoi','0242222222','SUP002'),
('Gadget World','Danang','0236333333','SUP003');

INSERT INTO ProductSupplier (ProductID, SupplierID) VALUES
(1,1),(2,1),(3,1),(4,1),(5,1),
(6,2),(7,2),(8,2),(9,2),(10,2),
(11,3),(12,3),(13,3),(14,3),(15,3);

INSERT INTO Voucher (Type, Discount, ApplicableCondition, AvailableDay, ExpiredDay) VALUES
('Percent',10,'Bill over 100$', '2024-01-01','2024-12-31'),
('Direct',50,'Laptop only','2024-03-01','2024-06-30'),
('Percent',20,'Accessory category','2024-05-01','2024-08-31');

INSERT INTO SaleOffEvent (EventName, StartDay, EndDay, MinimumMoney, BelongToCategories, AgeRestrictions, DiscountAmount, DiscountType) VALUES
('Tet Sale','2024-02-01','2024-02-10',100,'Accessory','None',10,'Percentage'),
('Back To School','2024-08-01','2024-08-30',200,'Laptop','15+',200,'Direct'),
('Black Friday','2024-11-25','2024-11-30',50,'All','None',20,'Percentage'),
('Year End Sale','2024-12-15','2024-12-31',100,'Smartphone','None',300,'Direct'),
('Summer Sale','2024-06-01','2024-06-15',30,'Accessory','None',15,'Percentage'),
('Birthday Month','2024-05-01','2024-05-31',100,'Laptop','18+',150,'Direct'),
('Mid-Year Sale','2024-07-01','2024-07-07',80,'Smartphone','None',25,'Percentage'),
('Mega Sale','2024-09-09','2024-09-15',120,'Laptop','None',350,'Direct'),
('Double Day 12.12','2024-12-12','2024-12-12',30,'Accessory','None',12,'Percentage'),
('Flash Sale Weekend','2024-04-13','2024-04-14',20,'All','None',5,'Percentage');

INSERT INTO Store (BranchID, ProductID, Quantity) VALUES
(1,1,20),(1,2,15),(1,3,30),(1,4,10),(1,5,12),
(2,6,8),(2,7,40),(2,8,50),(2,9,20),(2,10,18),
(3,11,25),(3,12,30),(3,13,15),(3,14,10),(3,15,20),
(4,1,12),(4,5,15),(4,7,20),(4,9,25),(4,11,18),
(5,2,10),(5,4,12),(5,6,14),(5,8,18),(5,10,15);

INSERT INTO CartItem (CartID, ProductID, Quantity) VALUES
(1,1,2),(1,4,1),(1,7,5),(1,10,3),(1,14,4),
(2,2,1),(2,5,3),(2,8,2),(2,11,4),(2,15,5),
(3,3,3),(3,6,2),(3,9,4),(3,12,5),(3,13,1),
(4,4,1),(4,7,2),(4,10,3),(4,1,4),(4,5,5),
(5,5,2),(5,8,5),(5,11,4),(5,14,3),(5,2,1),
(6,6,3),(6,9,1),(6,12,5),(6,3,4),(6,7,2),
(7,7,1),(7,10,4),(7,13,3),(7,4,5),(7,8,2),
(8,8,4),(8,11,3),(8,14,2),(8,1,1),(8,9,5),
(9,9,5),(9,12,3),(9,15,1),(9,2,4),(9,6,2),
(10,10,2),(10,13,1),(10,3,4),(10,7,5),(10,11,3);

INSERT INTO [Order] (CustomerID, Description, DeliveryLocation, Weight, Status, OrderType, EventID) VALUES
(1,'Order 1','HCM',1.2,'Pending','F', NULL),
(2,'Order 2','Hanoi',0.8,'Confirmed','F', NULL),
(3,'Order 3','Danang',1.5,'Delivered','F', NULL),
(4,'Order 4','Hue',2.1,'Pending','C', NULL),
(5,'Order 5','Can Tho',0.6,'Confirmed','F', NULL),
(6,'Order 6','Vung Tau',3.2,'Cancelled','C', NULL),
(7,'Order 7','HCM',1.1,'Pending','F', NULL),
(8,'Order 8','Hanoi',0.9,'Delivered','F', NULL),
(9,'Order 9','Danang',1.4,'Confirmed','C', NULL),
(10,'Order 10','Hue',1.3,'Pending','F', NULL),
(1,'Order 11','HCM',2.0,'Confirmed','F', NULL),
(3,'Order 12','Danang',1.1,'Delivered','F', NULL),
(4,'Order 13','Hue',0.7,'Pending','C', NULL),
(7,'Order 14','HCM',1.5,'Cancelled','C', NULL),
(8,'Order 15','Hanoi',2.2,'Delivered','F', NULL);

INSERT INTO OrderItem (OrderID, ProductID, Quantity, UnitPrice) VALUES
(1,1,1,1200),(1,7,2,249),(1,9,1,350),
(2,4,1,999),(2,8,1,99),(2,3,1,800),
(3,2,1,1100),(3,5,1,1150),(3,7,1,249),
(4,1,1,1200),(4,3,1,800),(4,4,1,999),
(5,6,1,1300),(5,8,1,99),(5,9,1,350),
(6,2,1,1100),(6,5,1,1150),(6,7,1,249),
(7,3,1,800),(7,4,1,999),(7,8,1,99),
(8,1,1,1200),(8,6,1,1300),(8,9,1,350),
(9,2,1,1100),(9,3,1,800),(9,7,1,249),
(10,5,1,1150),(10,8,1,99),(10,11,1,799),
(11,12,1,129),(11,3,1,800),(11,14,1,1499),
(12,7,1,249),(12,4,1,999),(12,10,1,899),
(13,6,1,1300),(13,15,1,199),(13,2,1,1100),
(14,1,1,1200),(14,9,1,350),(14,5,1,1150),
(15,3,1,800),(15,8,1,99),(15,12,1,129);

INSERT INTO Payment (OrderID, Method, Status) VALUES
(1,'COD','Pending'),
(2,'Bank Transfer','Paid'),
(3,'MOMO','Paid'),
(4,'COD','Pending'),
(5,'ZaloPay','Paid'),
(6,'Bank Transfer','Failed'),
(7,'COD','Pending'),
(8,'MOMO','Paid'),
(9,'Bank Transfer','Paid'),
(10,'COD','Pending'),
(11,'ZaloPay','Paid'),
(12,'MOMO','Paid'),
(13,'Bank Transfer','Paid'),
(14,'COD','Failed'),
(15,'MOMO','Paid');

INSERT INTO Bill (OrderID, PaymentMethod, PaymentStatus, Address, TaxIdentificationNumber) VALUES
(1,'COD','Pending','HCM','TX001'),
(2,'Bank Transfer','Paid','Hanoi','TX002'),
(3,'MOMO','Paid','Danang','TX003'),
(4,'COD','Pending','Hue','TX004'),
(5,'ZaloPay','Paid','Can Tho','TX005'),
(6,'Bank Transfer','Failed','Vung Tau','TX006'),
(7,'COD','Pending','HCM','TX007'),
(8,'MOMO','Paid','Hanoi','TX008'),
(9,'Bank Transfer','Paid','Danang','TX009'),
(10,'COD','Pending','Hue','TX010'),
(11,'ZaloPay','Paid','HCM','TX011'),
(12,'MOMO','Paid','Danang','TX012'),
(13,'Bank Transfer','Paid','Hue','TX013'),
(14,'COD','Failed','HCM','TX014'),
(15,'MOMO','Paid','Hanoi','TX015');

INSERT INTO Review (CustomerID, ProductID, StarRating, Note) VALUES
(1,1,5,'Excellent'),
(2,1,4,'Good but pricey'),
(3,2,5,'Amazing device'),
(4,2,4,'Very good'),
(5,3,4,'Nice'),
(6,3,3,'Average'),
(7,4,5,'Perfect laptop'),
(8,5,4,'Premium feel'),
(9,6,5,'Great gaming'),
(10,7,5,'Amazing sound'),
(1,8,4,'Smooth mouse'),
(2,9,5,'Best headphones'),
(3,10,4,'Useful tablet'),
(4,11,5,'Great screen'),
(5,12,4,'Nice for reading'),
(6,13,5,'Fast phone'),
(7,14,5,'Very powerful'),
(8,15,4,'Good speaker'),
(9,7,5,'Love it'),
(10,5,4,'Solid laptop');

