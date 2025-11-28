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

-- 2. Insert Sản phẩm (Đã fix giá và category)
INSERT INTO Product (ProductID, Name, Brand, Category, Price, Stock, Description, ImageURL) VALUES
-- Laptop (cat-1)
(1, N'Lenovo Legion 5 15"', 'Lenovo', 'cat-1', 22990000, 50, N'Laptop gaming hiệu năng cao.', '/assets/images/laptop_lenovo_legion.jpg'),
(2, N'Asus ROG Strix G15', 'Asus', 'cat-1', 34500000, 40, N'Chiến thần gaming.', '/assets/images/laptop_lenovo_legion.jpg'),
(3, N'Dell XPS 13', 'Dell', 'cat-1', 29900000, 30, N'Ultrabook mỏng nhẹ.', '/assets/images/laptop_dell.jpg'),
(4, N'Apple MacBook Air M1', 'Apple', 'cat-1', 26500000, 45, N'MacBook Air chip M1.', '/assets/images/laptop_macbook.jpg'),
(5, N'HP Pavilion 14', 'HP', 'cat-1', 15990000, 60, N'Laptop văn phòng bền bỉ.', '/assets/images/laptop_dell.jpg'),

-- Smartwatch -> Thiết bị đeo (cat-2)
(6, N'Apple Watch Series 9', 'Apple', 'cat-2', 9990000, 50, N'Smartwatch Apple mới nhất.', '/assets/images/apple_watch.jpg'),
(7, N'Samsung Galaxy Watch 6', 'Samsung', 'cat-2', 6490000, 55, N'Theo dõi sức khỏe toàn diện.', '/assets/images/galaxy_watch.jpg'),
(8, N'Garmin Forerunner 265', 'Garmin', 'cat-2', 10490000, 20, N'Đồng hồ chạy bộ chuyên nghiệp.', '/assets/images/galaxy_watch.jpg'),

-- Headphone -> Tai nghe (cat-3)
(9, N'Sony WH-1000XM4', 'Sony', 'cat-3', 4199000, 40, N'Tai nghe chống ồn Sony.', '/assets/images/headp_sony.jpg'),
(10, N'JBL Tune 510BT', 'JBL', 'cat-3', 899000, 100, N'Tai nghe bass mạnh mẽ.', '/assets/images/headp_sony.jpg'),
(11, N'Apple AirPods Pro (2nd Gen)', 'Apple', 'cat-3', 4990000, 80, N'Tai nghe True Wireless.', '/assets/images/headp_sony.jpg'),

-- Speaker -> Loa (cat-4)
(12, N'Bose SoundLink Revolve', 'Bose', 'cat-4', 3990000, 25, N'Loa 360 độ.', '/assets/images/bose.jpg'),
(13, N'Anker Soundcore Motion+', 'Anker', 'cat-4', 1499000, 60, N'Loa di động chống nước.', '/assets/images/bose.jpg'),

-- Smartphone -> Điện thoại (cat-5)
(14, N'iPhone 14 Pro', 'Apple', 'cat-5', 27990000, 35, N'iPhone 14 Pro.', '/assets/images/iphone.jpg'),
(15, N'Samsung Galaxy S23', 'Samsung', 'cat-5', 22990000, 40, N'Flagship Samsung nhỏ gọn.', '/assets/images/ss_galaxy.jpg'),
(16, N'Xiaomi Redmi Note 12', 'Xiaomi', 'cat-5', 5490000, 90, N'Điện thoại giá rẻ cấu hình cao.', '/assets/images/ss_galaxy.jpg'),
(17, N'Google Pixel 7a', 'Google', 'cat-5', 9990000, 20, N'Camera xuất sắc.', '/assets/images/iphone.jpg'),

-- Tablet (cat-6)
(18, N'iPad Air', 'Apple', 'cat-6', 16990000, 30, N'Tablet mỏng nhẹ.', '/assets/images/ipad.jpg'),
(19, N'Samsung Galaxy Tab S8', 'Samsung', 'cat-6', 18490000, 25, N'Tablet Android cao cấp.', '/assets/images/ipad.jpg'),

-- Camera (cat-7)
(20, N'Canon EOS M50 Mark II', 'Canon', 'cat-7', 11990000, 15, N'Máy ảnh cho Vlogger.', '/assets/images/camera_sony.jpg'),
(21, N'Sony Alpha a6400', 'Sony', 'cat-7', 18500000, 18, N'Máy ảnh lấy nét nhanh.', '/assets/images/camera_sony.jpg'),

-- Gaming Console -> Gaming (cat-8)
(22, N'Xbox Series S', 'Microsoft', 'cat-8', 8990000, 20, N'Máy chơi game nhỏ gọn.', '/assets/images/xbox.jpg');
SET IDENTITY_INSERT Product OFF;
GO

--SMARTPHONE
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('iPhone 15',              'Apple',      'Smartphone', 900,  50, 'Apple iPhone 15 128GB'),
('iPhone 15 Pro',          'Apple',      'Smartphone', 1200, 40, 'Apple iPhone 15 Pro 128GB'),
('Samsung Galaxy S24',     'Samsung',    'Smartphone', 950,  45, 'Flagship Samsung Galaxy S24'),
('Samsung Galaxy S24 Ultra','Samsung',   'Smartphone', 1200, 35, 'Samsung Galaxy S24 Ultra 5G'),
('Xiaomi 14',              'Xiaomi',     'Smartphone', 700,  60, 'Xiaomi 14 5G flagship'),
('Redmi Note 13 Pro',      'Xiaomi',     'Smartphone', 350,  80, 'Mid-range Redmi Note 13 Pro'),
('OPPO Find X7',           'OPPO',       'Smartphone', 800,  40, 'OPPO Find X7 5G'),
('vivo X100',              'vivo',       'Smartphone', 780,  40, 'vivo X100 5G with telephoto'),
('Google Pixel 8',         'Google',     'Smartphone', 800,  30, 'Google Pixel 8 5G'),
('Google Pixel 8 Pro',     'Google',     'Smartphone', 1100, 25, 'Google Pixel 8 Pro flagship'),
('OnePlus 12',             'OnePlus',    'Smartphone', 850,  35, 'OnePlus 12 5G performance phone'),
('realme 12 Pro+',         'realme',     'Smartphone', 500,  70, 'realme 12 Pro+ with periscope camera'),
('Asus ROG Phone 8',       'ASUS',       'Smartphone', 1100, 20, 'Gaming smartphone ROG Phone 8'),
('Samsung Galaxy A55',     'Samsung',    'Smartphone', 420,  90, 'Galaxy A55 mid-range 5G'),
('Nokia G42 5G',           'Nokia',      'Smartphone', 260,  75, 'Affordable Nokia G42 5G');

--LAPTOP
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('MacBook Air 13 M2',          'Apple',    'Laptop', 1200, 25, 'Apple MacBook Air 13-inch M2'),
('MacBook Pro 14 M3',          'Apple',    'Laptop', 2200, 15, 'Apple MacBook Pro 14-inch M3'),
('Dell XPS 13',                'Dell',     'Laptop', 1500, 20, 'Dell XPS 13 ultrabook'),
('Dell Inspiron 15',           'Dell',     'Laptop', 750,  30, 'Dell Inspiron 15 everyday laptop'),
('HP Spectre x360 14',         'HP',       'Laptop', 1600, 18, 'HP Spectre x360 2-in-1 14-inch'),
('HP Pavilion 14',             'HP',       'Laptop', 800,  28, 'HP Pavilion 14 student laptop'),
('ASUS Zenbook 14 OLED',       'ASUS',     'Laptop', 1300, 20, 'ASUS Zenbook 14 OLED ultrabook'),
('ASUS Vivobook 15',           'ASUS',     'Laptop', 700,  35, 'ASUS Vivobook 15 everyday use'),
('Lenovo ThinkPad X1 Carbon',  'Lenovo',   'Laptop', 1900, 12, 'Lenovo ThinkPad X1 Carbon business'),
('Lenovo IdeaPad 3 15',        'Lenovo',   'Laptop', 650,  32, 'Lenovo IdeaPad 3 15-inch'),
('Acer Aspire 5 15',           'Acer',     'Laptop', 680,  30, 'Acer Aspire 5 slim laptop'),
('MSI GF63 Thin',              'MSI',      'Laptop', 950,  22, 'MSI GF63 Thin gaming laptop'),
('Razer Blade 15',             'Razer',    'Laptop', 2300, 10, 'Razer Blade 15 gaming laptop'),
('LG Gram 14',                 'LG',       'Laptop', 1400, 14, 'LG Gram 14 ultra-light laptop'),
('Huawei MateBook D15',        'Huawei',   'Laptop', 800,  24, 'Huawei MateBook D15 15-inch');

--TABLET
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('iPad 10th Gen 10.9"',     'Apple',    'Tablet', 450,  40, 'Apple iPad 10th Gen 64GB'),
('iPad Air 5',              'Apple',    'Tablet', 700,  30, 'Apple iPad Air 5th Gen'),
('iPad Pro 12.9 M2',        'Apple',    'Tablet', 1300,20, 'iPad Pro 12.9-inch M2'),
('Galaxy Tab S9',           'Samsung',  'Tablet', 900,  25, 'Samsung Galaxy Tab S9'),
('Galaxy Tab A9',           'Samsung',  'Tablet', 260,  50, 'Samsung Galaxy Tab A9 10-inch'),
('Xiaomi Pad 6',            'Xiaomi',   'Tablet', 400,  45, 'Xiaomi Pad 6 11-inch'),
('Lenovo Tab P11 Pro',      'Lenovo',   'Tablet', 450,  30, 'Lenovo Tab P11 Pro'),
('Huawei MatePad 11',       'Huawei',   'Tablet', 420,  28, 'Huawei MatePad 11 with pen support'),
('Amazon Fire HD 10',       'Amazon',   'Tablet', 180,  60, 'Amazon Fire HD 10 tablet'),
('realme Pad 2',            'realme',   'Tablet', 250,  50, 'realme Pad 2 11-inch tablet'),
('OPPO Pad Air',            'OPPO',     'Tablet', 260,  40, 'OPPO Pad Air slim tablet'),
('Nokia T20',               'Nokia',    'Tablet', 230,  35, 'Nokia T20 10.4-inch tablet'),
('TCL Tab 10s',             'TCL',      'Tablet', 210,  35, 'TCL Tab 10s tablet'),
('Surface Go 4',            'Microsoft','Tablet', 650,  18, 'Microsoft Surface Go 4 2-in-1'),
('Surface Pro 9',           'Microsoft','Tablet', 1500,15, 'Microsoft Surface Pro 9 tablet PC');

--HEADPHONE/EARPHONE
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('AirPods Pro 2',                   'Apple',       'Headphone', 250, 80, 'Apple AirPods Pro 2 true wireless'),
('AirPods 3',                       'Apple',       'Headphone', 180, 90, 'Apple AirPods 3rd generation'),
('Sony WH-1000XM5',                 'Sony',        'Headphone', 350, 40, 'Sony WH-1000XM5 noise-cancelling'),
('Sony WF-1000XM5',                 'Sony',        'Headphone', 280, 50, 'Sony WF-1000XM5 TWS earbuds'),
('Bose QuietComfort 45',            'Bose',        'Headphone', 330, 35, 'Bose QuietComfort 45 over-ear'),
('Bose QuietComfort Earbuds II',    'Bose',        'Headphone', 290, 45, 'Bose QC Earbuds II'),
('JBL Tune 510BT',                  'JBL',         'Headphone', 60,  120,'JBL Tune 510BT wireless on-ear'),
('JBL Live 660NC',                  'JBL',         'Headphone', 150, 70, 'JBL Live 660NC ANC over-ear'),
('Sennheiser HD 560S',              'Sennheiser',  'Headphone', 220, 30, 'Sennheiser HD 560S open-back'),
('Sennheiser Momentum 4 Wireless',  'Sennheiser',  'Headphone', 350, 25, 'Momentum 4 Wireless over-ear'),
('Anker Soundcore Life Q35',        'Anker',       'Headphone', 130, 80, 'Soundcore Life Q35 ANC'),
('Logitech G435 Lightspeed',        'Logitech',    'Headphone', 90,  60, 'Logitech G435 gaming headset'),
('Razer BlackShark V2',             'Razer',       'Headphone', 110, 50, 'Razer BlackShark V2 esports headset'),
('Samsung Galaxy Buds2 Pro',        'Samsung',     'Headphone', 200, 55, 'Samsung Galaxy Buds2 Pro'),
('Apple EarPods (USB-C)',           'Apple',       'Headphone', 25,  150,'Apple wired EarPods USB-C');

--SMARTWATCH
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('Apple Watch Series 9 41mm', 'Apple',    'Smartwatch', 430, 40, 'Apple Watch Series 9 GPS 41mm'),
('Apple Watch SE 2 40mm',     'Apple',    'Smartwatch', 280, 60, 'Apple Watch SE 2nd Gen'),
('Apple Watch Ultra 2',       'Apple',    'Smartwatch', 800, 20, 'Apple Watch Ultra 2 adventure watch'),
('Galaxy Watch6 40mm',        'Samsung',  'Smartwatch', 320, 50, 'Samsung Galaxy Watch6 40mm'),
('Galaxy Watch6 Classic 47mm','Samsung',  'Smartwatch', 450, 30, 'Galaxy Watch6 Classic 47mm'),
('Garmin Forerunner 265',     'Garmin',   'Smartwatch', 500, 25, 'Garmin Forerunner 265 running watch'),
('Garmin Venu 3',             'Garmin',   'Smartwatch', 480, 25, 'Garmin Venu 3 AMOLED smartwatch'),
('Fitbit Versa 4',            'Fitbit',   'Smartwatch', 230, 55, 'Fitbit Versa 4 fitness watch'),
('Fitbit Charge 6',           'Fitbit',   'Smartwatch', 180, 70, 'Fitbit Charge 6 activity tracker'),
('Xiaomi Watch S3',           'Xiaomi',   'Smartwatch', 200, 60, 'Xiaomi Watch S3 AMOLED'),
('Huawei Watch GT 4 46mm',    'Huawei',   'Smartwatch', 280, 40, 'Huawei Watch GT 4 46mm'),
('Amazfit GTR 4',             'Amazfit',  'Smartwatch', 230, 50, 'Amazfit GTR 4 GPS watch'),
('OPPO Watch X',              'OPPO',     'Smartwatch', 270, 45, 'OPPO Watch X Wear OS'),
('Redmi Watch 4',             'Redmi',    'Smartwatch', 120, 90, 'Redmi Watch 4 budget smartwatch'),
('Fossil Gen 6',              'Fossil',   'Smartwatch', 260, 35, 'Fossil Gen 6 Wear OS watch');
--CAMERA
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('Canon EOS R8',            'Canon',     'Camera', 1700,15, 'Canon EOS R8 full-frame mirrorless'),
('Canon EOS R50',           'Canon',     'Camera', 900, 20, 'Canon EOS R50 entry mirrorless'),
('Nikon Z5',                'Nikon',     'Camera', 1400,12, 'Nikon Z5 full-frame camera'),
('Nikon Z30',               'Nikon',     'Camera', 800, 18, 'Nikon Z30 vlogging camera'),
('Sony A7 IV',              'Sony',      'Camera', 2500,10,'Sony Alpha A7 IV full-frame'),
('Sony ZV-E10',             'Sony',      'Camera', 900, 20, 'Sony ZV-E10 vlogging camera'),
('Fujifilm X-T5',           'Fujifilm',  'Camera', 1900,12,'Fujifilm X-T5 APS-C camera'),
('Fujifilm X-S20',          'Fujifilm',  'Camera', 1300,15,'Fujifilm X-S20 hybrid camera'),
('Panasonic Lumix S5 II',   'Panasonic', 'Camera', 2000,10,'Panasonic Lumix S5 II full-frame'),
('Panasonic Lumix G100',    'Panasonic', 'Camera', 650, 18,'Lumix G100 vlogging camera'),
('GoPro HERO 12 Black',     'GoPro',     'Camera', 450, 40,'GoPro HERO 12 action camera'),
('Insta360 X3',             'Insta360',  'Camera', 430, 35,'Insta360 X3 360-degree camera'),
('DJI Osmo Pocket 3',       'DJI',       'Camera', 520, 25,'DJI Osmo Pocket 3 pocket gimbal'),
('Canon PowerShot G7 X III','Canon',     'Camera', 700, 20,'Canon G7 X Mark III compact camera'),
('Sony RX100 VII',          'Sony',      'Camera', 1200,12,'Sony RX100 VII premium compact');

--GAMING CONSOLE & ACCESSORY
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('PlayStation 5 Slim',            'Sony',     'Gaming Console', 500, 35, 'Sony PlayStation 5 Slim console'),
('Xbox Series X',                 'Microsoft','Gaming Console', 500, 30, 'Microsoft Xbox Series X'),
('Xbox Series S',                 'Microsoft','Gaming Console', 300, 40, 'Microsoft Xbox Series S'),
('Nintendo Switch OLED',          'Nintendo', 'Gaming Console', 350, 45, 'Nintendo Switch OLED model'),
('Nintendo Switch Lite',          'Nintendo', 'Gaming Console', 200, 50, 'Nintendo Switch Lite handheld'),
('Steam Deck OLED 512GB',         'Valve',    'Gaming Console', 650, 20, 'Steam Deck OLED 512GB'),
('ASUS ROG Ally',                 'ASUS',     'Gaming Console', 700, 18, 'ASUS ROG Ally handheld PC'),
('Meta Quest 3',                  'Meta',     'Gaming Console', 500, 25, 'Meta Quest 3 VR headset'),
('Logitech G Cloud',              'Logitech', 'Gaming Console', 300, 25, 'Logitech G Cloud gaming handheld'),
('Nintendo Switch Pro Controller','Nintendo', 'Gaming Console', 70,  80, 'Nintendo Switch Pro Controller'),
('PS5 DualSense Wireless Controller','Sony',  'Gaming Console', 70,  90, 'PS5 DualSense controller'),
('Xbox Wireless Controller',      'Microsoft','Gaming Console', 65,  85, 'Xbox Series Wireless Controller'),
('Nintendo Joy-Con Pair',         'Nintendo', 'Gaming Console', 80,  70, 'Nintendo Joy-Con controller pair'),
('Ring Fit Adventure Set',        'Nintendo', 'Gaming Console', 90,  30, 'Ring Fit Adventure game + ring'),
('8BitDo Pro 2 Controller',       '8BitDo',   'Gaming Console', 60,  60, '8BitDo Pro 2 multi-platform pad');

--MONITOR
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('LG UltraGear 27GN950',       'LG',       'Monitor', 800, 15, '27" 4K 144Hz gaming monitor'),
('Samsung Odyssey G7 32"',     'Samsung',  'Monitor', 700, 18, '32" Odyssey G7 QHD 240Hz'),
('ASUS TUF Gaming VG27AQ',     'ASUS',     'Monitor', 420, 25, '27" QHD 165Hz gaming monitor'),
('Dell UltraSharp U2723QE',    'Dell',     'Monitor', 650, 20, '27" 4K USB-C UltraSharp'),
('Acer Nitro XV272U',          'Acer',     'Monitor', 350, 30, '27" QHD 144Hz Nitro'),
('MSI Optix MAG274QRF',        'MSI',      'Monitor', 430, 22, '27" QHD 165Hz Optix'),
('Gigabyte G27Q',              'Gigabyte', 'Monitor', 330, 25, '27" QHD 144Hz IPS'),
('BenQ EW2780U',               'BenQ',     'Monitor', 500, 18, '27" 4K HDR monitor'),
('AOC 24G2',                   'AOC',      'Monitor', 200, 40, '24" 144Hz gaming monitor'),
('Philips 325E1 32"',          'Philips',  'Monitor', 280, 25, '32" QHD monitor'),
('LG 27UP850',                 'LG',       'Monitor', 450, 20, '27" 4K USB-C monitor'),
('Samsung Smart Monitor M8',   'Samsung',  'Monitor', 700, 15, '32" 4K Smart Monitor M8'),
('Huawei MateView 28"',        'Huawei',   'Monitor', 600, 15, '28" 3:2 4K+ monitor'),
('Xiaomi Mi Desktop Monitor 27','Xiaomi',  'Monitor', 230, 35, '27" FHD office monitor'),
('ViewSonic VA2432-h',         'ViewSonic','Monitor', 130, 45, '24" IPS business monitor');

--KEYBOARD & MOUSE
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('Logitech MX Keys S',          'Logitech',   'Keyboard & Mouse', 120, 40, 'Logitech MX Keys S wireless keyboard'),
('Logitech MX Master 3S',       'Logitech',   'Keyboard & Mouse', 110, 50, 'Logitech MX Master 3S mouse'),
('Logitech G Pro X Keyboard',   'Logitech',   'Keyboard & Mouse', 140, 30, 'G Pro X mechanical gaming keyboard'),
('Logitech G502 X',             'Logitech',   'Keyboard & Mouse', 80,  60, 'Logitech G502 X gaming mouse'),
('Razer Huntsman V2',           'Razer',      'Keyboard & Mouse', 180, 25, 'Razer Huntsman V2 optical keyboard'),
('Razer DeathAdder V3',         'Razer',      'Keyboard & Mouse', 90,  55, 'Razer DeathAdder V3 gaming mouse'),
('SteelSeries Apex Pro TKL',    'SteelSeries','Keyboard & Mouse', 200, 20, 'Apex Pro TKL adjustable keyboard'),
('SteelSeries Rival 5',         'SteelSeries','Keyboard & Mouse', 70,  45, 'SteelSeries Rival 5 gaming mouse'),
('Corsair K70 RGB Pro',         'Corsair',    'Keyboard & Mouse', 170, 25, 'Corsair K70 RGB Pro keyboard'),
('Corsair Harpoon RGB',         'Corsair',    'Keyboard & Mouse', 40,  60, 'Corsair Harpoon RGB mouse'),
('Keychron K2 V2',              'Keychron',   'Keyboard & Mouse', 90,  35, 'Keychron K2 V2 wireless keyboard'),
('Ducky One 3 TKL',             'Ducky',      'Keyboard & Mouse', 120, 25, 'Ducky One 3 TKL mechanical keyboard'),
('Apple Magic Keyboard',        'Apple',      'Keyboard & Mouse', 110, 40, 'Apple Magic Keyboard'),
('Apple Magic Mouse 2',         'Apple',      'Keyboard & Mouse', 80,  45, 'Apple Magic Mouse 2'),
('Microsoft Surface Mouse',     'Microsoft',  'Keyboard & Mouse', 50,  50, 'Microsoft Surface Bluetooth Mouse');

--ROUTER & NETWORK
INSERT INTO Product (Name, Brand, Category, Price, Stock, Description) VALUES
('TP-Link Archer AX55',         'TP-Link',   'Router', 130, 50, 'Wi-Fi 6 AX3000 router Archer AX55'),
('TP-Link Deco X50 (3-pack)',   'TP-Link',   'Router', 280, 30, 'Deco X50 mesh Wi-Fi 6 (3-pack)'),
('ASUS RT-AX88U',               'ASUS',      'Router', 320, 25, 'ASUS RT-AX88U Wi-Fi 6 router'),
('ASUS ZenWiFi AX XT8 (2-pack)','ASUS',      'Router', 450, 20, 'ZenWiFi AX XT8 mesh system'),
('Netgear Nighthawk AX5400',    'Netgear',   'Router', 280, 25, 'Nighthawk AX5400 Wi-Fi 6 router'),
('Netgear Orbi RBK752 (2-pack)','Netgear',   'Router', 500, 15, 'Orbi RBK752 Wi-Fi 6 mesh'),
('Linksys Velop MX5300',        'Linksys',   'Router', 350, 18, 'Linksys Velop MX5300 Wi-Fi 6'),
('Xiaomi AX3000',               'Xiaomi',    'Router', 80,  70, 'Xiaomi AX3000 Wi-Fi 6 router'),
('Tenda AC10U',                 'Tenda',     'Router', 45,  80, 'Tenda AC10U AC1200 router'),
('D-Link EXO AX1500',           'D-Link',    'Router', 70,  60, 'D-Link EXO AX1500 Wi-Fi 6'),
('Google Nest Wifi Pro',        'Google',    'Router', 300, 25, 'Google Nest Wifi Pro mesh'),
('Amazon eero 6+ (3-pack)',     'Amazon',    'Router', 280, 25, 'Amazon eero 6+ mesh (3-pack)'),
('Huawei WiFi AX3',             'Huawei',    'Router', 90,  60, 'Huawei WiFi AX3 quad-core'),
('Mercusys MR70X',              'Mercusys',  'Router', 60,  70, 'Mercusys MR70X AX1800 router'),
('Ubiquiti UniFi Dream Router', 'Ubiquiti',  'Router', 320, 15, 'UniFi Dream Router all-in-one');


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

INSERT INTO ProductVoucher (ProductID, VoucherID) VALUES
(1,1),(2,1),(3,1),
(4,2),(5,2),(6,2),
(7,3),(8,3),(9,3),(15,3);

INSERT INTO Customer (Name, DateOfBirth, Email, PasswordHash, PhoneNumber, Gender, Address) VALUES
('Nguyen Van A','2000-01-01','a@gmail.com','123','0909000001','Male','HCM'),
('Tran Thi B','1999-05-20','b@gmail.com','456','0909000002','Female','Hanoi'),
('Le Hoang C','2001-10-12','c@gmail.com','789','0909000003','Male','Danang'),
('Pham Dieu D','1998-03-30','d@gmail.com','111','0909000004','Female','Hue'),
('Vo Thanh E','2002-07-18','e@gmail.com','222','0909000005','Male','Can Tho'),
('Hoang Gia F','2003-12-09','f@gmail.com','333','0909000006','Female','Vung Tau'),
('Bui Minh G','1999-11-22','g@gmail.com','444','0909000007','Male','HCM'),
('Doan Thu H','2001-02-05','h@gmail.com','555','0909000008','Female','Hanoi'),
('Luu Bao I','1998-09-19','i@gmail.com','666','0909000009','Male','Da Nang'),
('Ngo Kieu J','2000-06-14','j@gmail.com','777','0909000010','Female','Hue');

INSERT INTO Cart (CustomerID) VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

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

