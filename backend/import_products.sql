USE OnlineShopDB;
GO

INSERT INTO Branch (Name, Address, Expense, AvailableCapacity) VALUES
('Branch HCM 1', 'District 1, HCM', 15000, 200),
('Branch HCM 2', 'District 3, HCM', 10000, 180),
('Branch Hanoi', 'Cau Giay, Hanoi', 12000, 150),
('Branch Danang', 'Hai Chau, Danang', 9000, 120),
('Branch Can Tho', 'Ninh Kieu, Can Tho', 7000, 100);

INSERT INTO Category (CategoryID, Name, Icon) VALUES
('cat-1', N'Laptop', 'PiLaptopFill'),
('cat-2', N'Thiết bị đeo', 'PiWatchFill'),
('cat-3', N'Tai nghe', 'PiHeadphonesFill'),
('cat-4', N'Loa', 'PiSpeakerHighFill'),
('cat-5', N'Điện thoại', 'PiDeviceMobileFill'),
('cat-6', N'Tablet', 'PiDeviceTabletFill'),
('cat-7', N'Camera', 'PiCameraFill'),
('cat-8', N'Gaming', 'PiGameControllerFill');

SET IDENTITY_INSERT Product ON;

INSERT INTO Product (ProductID, Name, Brand, Category, Price, Stock, Description, ImageURL) VALUES
-- Laptop (cat-1) - 10 sản phẩm
(1,  N'MacBook Air M2 13"', 'Apple', 'cat-1', 28990000, 35, N'MacBook Air chip M2 siêu mỏng nhẹ', '/uploads/Laptop/MacBook-Air-M2.jpg'),
(2,  N'MacBook Pro 14 M3', 'Apple', 'cat-1', 48990000, 20, N'MacBook Pro 14 inch chip M3 mạnh mẽ', '/uploads/Laptop/MacBook-Pro-M3-14.jpg'),
(3,  N'Dell XPS 13 9340', 'Dell', 'cat-1', 41990000, 25, N'Ultrabook cao cấp màn OLED', '/uploads/Laptop/Dell-Xps-13-9340.jpg'),
(4,  N'ASUS Zenbook 14 OLED', 'Asus', 'cat-1', 27990000, 40, N'Màn hình OLED 2.8K siêu đẹp', 'uploads/Laptop/Asus-Zenbook-14-Oled.webp'),
(5,  N'Lenovo Legion 5 Pro 2024', 'Lenovo', 'cat-1', 39990000, 30, N'Laptop gaming RTX 4060', '/uploads/Laptop/Lenovo-Legion-5-Pro-2024.webp'),
(6,  N'HP Spectre x360 14', 'HP', 'cat-1', 35990000, 22, N'Laptop 2-in-1 cảm ứng cao cấp', '/uploads/Laptop/HP-Spectre-X360-14.jpg'),
(7,  N'MSI Stealth 16 Studio', 'MSI', 'cat-1', 52990000, 15, N'Laptop gaming mỏng nhẹ RTX 4070', '/uploads/Laptop/MSI-Stealth-16-Studio.png'),
(8,  N'Acer Swift X 14', 'Acer', 'cat-1', 24990000, 45, N'Laptop sáng tạo OLED RTX 4050', '/uploads/Laptop/Acer-Swift-X-14.png'),
(9,  N'LG Gram 16 2024', 'LG', 'cat-1', 33990000, 28, N'Laptop siêu nhẹ chỉ 1.19kg', '/uploads/Laptop/LG-Gram-16-2024.jpg'),
(10, N'Razer Blade 14 2024', 'Razer', 'cat-1', 61990000, 12, N'Laptop gaming cao cấp nhất', '/uploads/Laptop/Razer-Blade-14-2024.jpg'),

-- Smartwatch - Thiết bị đeo (cat-2) - 10 sản phẩm
(11, N'Apple Watch Series 10 46mm', 'Apple', 'cat-2', 13490000, 50, N'Apple Watch mới nhất 2024', '/uploads/Smartwatch/Apple-Watch-Series-10-46mm.jpg'),
(12, N'Apple Watch Ultra 2', 'Apple', 'cat-2', 21990000, 25, N'Phiên bản adventure siêu bền', '/uploads/Smartwatch/Apple-Watch-Ultra-2.jpg'),
(13, N'Samsung Galaxy Watch 7 44mm', 'Samsung', 'cat-2', 8990000, 60, N'Galaxy Watch7 bản 2024', '/uploads/Smartwatch/Samsung-Galaxy-Watch-7-44mm.jpg'),
(14, N'Garmin Fenix 8', 'Garmin', 'cat-2', 26990000, 18, N'Đồng hồ thể thao cao cấp nhất', '/uploads/Smartwatch/Garmin-Fenix-8.jpg'),
(15, N'Garmin Forerunner 965', 'Garmin', 'cat-2', 15990000, 30, N'Chuyên chạy bộ và triathlon', '/uploads/Smartwatch/Garmin-Forerunner-965.jpg'),
(16, N'Huawei Watch GT 5 Pro 46mm', 'Huawei', 'cat-2', 9990000, 40, N'Pin trâu 14 ngày, titanium', '/uploads/Smartwatch/Huawei-Watch-GT-5-Pro-46mm.jpg'),
(17, N'Xiaomi Watch S4', 'Xiaomi', 'cat-2', 5490000, 80, N'Giá rẻ pin lâu màn AMOLED', '/uploads/Smartwatch/Xiaomi-Watch-S4.jpg'),
(18, N'Amazfit T-Rex 3', 'Amazfit', 'cat-2', 6490000, 55, N'Smartwatch siêu bền quân đội', '/uploads/Smartwatch/Amazfit-T-Rex-3.jpg'),
(19, N'Fitbit Charge 6', 'Fitbit', 'cat-2', 4490000, 70, N'Theo dõi sức khỏe chuyên sâu', '/uploads/Smartwatch/Fitbit-Charge-6.jpg'),
(20, N'Google Pixel Watch 3 45mm', 'Google', 'cat-2', 10990000, 35, N'Wear OS mượt mà nhất', '/uploads/Smartwatch/Google-Pixel-Watch-3-45mm.jpg'),

-- Tai nghe (cat-3) - 10 sản phẩm
(21, N'Sony WH-1000XM5', 'Sony', 'cat-3', 7990000, 45, N'Tai nghe chống ồn tốt nhất thế giới', '/uploads/Headphone/Sony-WH-1000XM5.jpg'),
(22, N'Apple AirPods Pro 2 USB-C', 'Apple', 'cat-3', 5990000, 90, N'Tai nghe true wireless cao cấp', '/uploads/Headphone/Apple-AirPods-Pro-2-USB-C.jpg'),
(23, N'Bose QuietComfort Ultra', 'Bose', 'cat-3', 8990000, 30, N'Chống ồn đỉnh cao mới 2024', '/uploads/Headphone/Bose-QuietComfort-Ultra.jpg'),
(24, N'Sennheiser Momentum 4', 'Sennheiser', 'cat-3', 8490000, 35, N'Âm thanh audiophile pin 60h', '/uploads/Headphone/Sennheiser-Momentum-4.jpg'),
(25, N'JBL Tour One M2', 'JBL', 'cat-3', 5490000, 50, N'Chống ồn + bass mạnh', '/uploads/Headphone/JBL-Tour-One-M2.jpg'),
(26, N'Anker Soundcore Space Q45', 'Anker', 'cat-3', 2990000, 80, N'Giá rẻ pin 65h chống ồn tốt', '/uploads/Headphone/Anker-Soundcore-Space-Q45.png'),
(27, N'Sony WF-1000XM5', 'Sony', 'cat-3', 6490000, 60, N'TWS chống ồn đỉnh cao', '/uploads/Headphone/Sony-WF-1000XM5.jpg'),
(28, N'Samsung Galaxy Buds3 Pro', 'Samsung', 'cat-3', 5490000, 70, N'Buds3 Pro chống ồn AI', '/uploads/Headphone/Samsung-Galaxy-Buds3-Pro.jpg'),
(29, N'Beats Studio Pro', 'Beats', 'cat-3', 7990000, 40, N'Tai nghe phong cách trẻ', '/uploads/Headphone/Beats-Studio-Pro.png'),
(30, N'SoundPEATS Capsule3 Pro', 'SoundPEATS', 'cat-3', 1590000, 120, N'Giá siêu rẻ chất lượng bất ngờ', '/uploads/Headphone/SoundPEATS-Capsule3-Pro.jpg'),

-- Loa (cat-4) - 10 sản phẩm
(31, N'Bose SoundLink Max', 'Bose', 'cat-4', 10990000, 25, N'Loa di động cao cấp chống nước', '/uploads/Loudspeaker/Bose-SoundLink-Max.jpg'),
(32, N'JBL Charge 6', 'JBL', 'cat-4', 4490000, 70, N'Loa di động kiêm sạc dự phòng', '/uploads/Loudspeaker/JBL-Charge-6.webp'),
(33, N'Sony SRS-XG300', 'Sony', 'cat-4', 5990000, 40, N'Loa party bass mạnh', '/uploads/Loudspeaker/Sony-SRS-XG300.jpg'),
(34, N'Anker Soundcore Motion Boom Plus', 'Anker', 'cat-4', 3990000, 60, N'Loa chống nước IP67 bass khủng', '/uploads/Loudspeaker/Anker-Soundcore-Motion-Boom-Plus.jpg'),
(35, N'Marshall Emberton II', 'Marshall', 'cat-4', 4490000, 50, N'Phong cách rock cổ điển', '/uploads/Loudspeaker/Marshall-Emberton-II.jpg'),
(36, N'Ultimate Ears HYPERBOOM', 'Ultimate Ears', 'cat-4', 8990000, 20, N'Loa party lớn nhất', '/uploads/Loudspeaker/Ultimate-Ears-HYPERBOOM.png'),
(37, N'Bang & Olufsen Beosound A1 Gen 2', 'B&O', 'cat-4', 7990000, 30, N'Loa cao cấp sang trọng', '/uploads/Loudspeaker/Bang & Olufsen-Beosound-A1-Gen-2.jpg'),
(38, N'Tribit StormBox Pro', 'Tribit', 'cat-4', 2490000, 90, N'Giá rẻ âm thanh 360 độ', '/uploads/Loudspeaker/Tribit-StormBox-Pro.webp'),
(39, N'Harman Kardon Go + Play 3', 'Harman Kardon', 'cat-4', 7490000, 25, N'Loa cầm tay cao cấp', '/uploads/Loudspeaker/Harman-Kardon-Go+Play3.jpg'),
(40, N'Xiaomi Sound Pocket', 'Xiaomi', 'cat-4', 990000, 150, N'Loa mini giá siêu rẻ', '/uploads/Loudspeaker/Xiaomi-Sound-Pocket.jpg'),

-- Smartphone (cat-5) - 10 sản phẩm
(41, N'iPhone 16 Pro Max 256GB', 'Apple', 'cat-5', 36990000, 40, N'iPhone 16 Pro Max mới nhất', '/uploads/Smartphone/Iphone-16-Pro-Max-256GB.jpg'),
(42, N'Samsung Galaxy S24 Ultra', 'Samsung', 'cat-5', 32990000, 35, N'Flagship Android đỉnh cao', '/uploads/Smartphone/Samsung-Galaxy-S24-Ultra.jpg'),
(43, N'Xiaomi 14 Ultra', 'Xiaomi', 'cat-5', 26990000, 30, N'Camera Leica hợp tác', '/uploads/Smartphone/Xiaomi-14-Ultra.jpg'),
(44, N'OPPO Find X8 Pro', 'OPPO', 'cat-5', 28990000, 25, N'Camera Hasselblad', '/uploads/Smartphone/OPPO-Find-X8-Pro.jpg'),
(45, N'Vivo X100 Pro', 'vivo', 'cat-5', 27990000, 28, N'Camera ZEISS telephoto', '/uploads/Smartphone/Vivo-X100-Pro.jpg'),
(46, N'Google Pixel 9 Pro XL', 'Google', 'cat-5', 29990000, 20, N'Camera AI tốt nhất', '/uploads/Smartphone/Google-Pixel-9-Pro-XL.png'),
(47, N'OnePlus 13', 'OnePlus', 'cat-5', 23990000, 45, N'Hiệu năng khủng sạc siêu nhanh', '/uploads/Smartphone/OnePlus-13.jpg'),
(48, N'ASUS ROG Phone 9', 'Asus', 'cat-5', 27990000, 18, N'Gaming phone mạnh nhất', '/uploads/Smartphone/ASUS-ROG-Phone-9.jpg'),
(49, N'Samsung Galaxy Z Fold6', 'Samsung', 'cat-5', 44990000, 15, N'Điện thoại gập cao cấp', '/uploads/Smartphone/Samsung-Galaxy-Z-Fold6.jpg'),
(50, N'Redmi Note 14 Pro+', 'Xiaomi', 'cat-5', 9990000, 80, N'Giá rẻ camera 200MP', '/uploads/Smartphone/Redmi-Note-14-Pro+.jpg'),

-- Tablet (cat-6) - 10 sản phẩm
(51, N'iPad Pro 13 M4 2024', 'Apple', 'cat-6', 39990000, 20, N'Tablet mạnh nhất thế giới', '/uploads/Tablet/IPad-Pro-13-M4-2024.jpg'),
(52, N'iPad Air 13 M2', 'Apple', 'cat-6', 21990000, 35, N'iPad Air 13 inch chip M2', '/uploads/Tablet/IPad-Air-13-M2.jpg'),
(53, N'Samsung Galaxy Tab S10 Ultra', 'Samsung', 'cat-6', 28990000, 22, N'Tablet Android cao cấp nhất', '/uploads/Tablet/Samsung-Galaxy-Tab-S10-Ultra.jpg'),
(54, N'Xiaomi Pad 7 Pro', 'Xiaomi', 'cat-6', 12990000, 50, N'Giá tốt chip Snapdragon 8 Gen 2', '/uploads/Tablet/Xiaomi-Pad-7-Pro.png'),
(55, N'Lenovo Tab P12 Pro', 'Lenovo', 'cat-6', 14990000, 40, N'Màn AMOLED 120Hz', '/uploads/Tablet/Lenovo-Tab-P12-Pro.jpg'),
(56, N'Huawei MatePad Pro 13.2', 'Huawei', 'cat-6', 21990000, 25, N'Màn PaperMatte siêu mỏng', '/uploads/Tablet/Huawei-MatePad-Pro-13.2.jpg'),
(57, N'OnePlus Pad 2', 'OnePlus', 'cat-6', 15990000, 38, N'Chip Snapdragon 8 Gen 3', '/uploads/Tablet/OnePlus-Pad-2.jpg'),
(58, N'Honor Pad 9', 'Honor', 'cat-6', 8990000, 60, N'Màn 12.1" 120Hz giá rẻ', '/uploads/Tablet/Honor-Pad-9.jpg'),
(59, N'Amazon Fire Max 11', 'Amazon', 'cat-6', 5990000, 70, N'Tablet giải trí giá cực tốt', '/uploads/Tablet/Amazon-Fire-Max-11.jpg'),
(60, N'Microsoft Surface Pro 11', 'Microsoft', 'cat-6', 33990000, 15, N'2-in-1 Windows mạnh mẽ', '/uploads/Tablet/Microsoft-Surface-Pro-11.jpg'),

-- Camera (cat-7) - 10 sản phẩm
(61, N'Sony A7 IV', 'Sony', 'cat-7', 59990000, 12, N'Full-frame hybrid đỉnh cao', '/uploads/Camera/Sony-A7-IV.jpg'),
(62, N'Canon EOS R6 Mark II', 'Canon', 'cat-7', 55990000, 15, N'Full-frame tốc độ cao', '/uploads/Camera/Canon-EOS-R6-Mark-II.jpg'),
(63, N'Nikon Z6 III', 'Nikon', 'cat-7', 61990000, 10, N'Nikon full-frame mới 2024', '/uploads/Camera/Nikon-Z6-III.jpg'),
(64, N'Fujifilm X-T50', 'Fujifilm', 'cat-7', 35990000, 18, N'Phong cách film cổ điển', '/uploads/Camera/Fujifilm-X-T50.jpg'),
(65, N'Panasonic Lumix S5 IIX', 'Panasonic', 'cat-7', 49990000, 14, N'Chuyên quay phim 6K', '/uploads/Camera/Panasonic-Lumix-S5-IIX.jpg'),
(66, N'Sony ZV-E10 II', 'Sony', 'cat-7', 21990000, 30, N'Vlog camera giá tốt', '/uploads/Camera/Sony-ZV-E10-II.jpg'),
(67, N'Canon EOS R50', 'Canon', 'cat-7', 17990000, 35, N'Nhập môn mirrorless', '/uploads/Camera/Canon-EOS-R50.jpg'),
(68, N'DJI Osmo Pocket 3', 'DJI', 'cat-7', 13990000, 40, N'Gimbal camera bỏ túi', '/uploads/Camera/DJI-Osmo-Pocket-3.jpg'),
(69, N'GoPro HERO 13 Black', 'GoPro', 'cat-7', 11990000, 45, N'Action cam mới nhất', '/uploads/Camera/GoPro-HERO-13-Black.jpg'),
(70, N'Insta360 X4', 'Insta360', 'cat-7', 13990000, 38, N'Camera 360 độ 8K', '/uploads/Camera/Insta360-X4.jpg'),

-- Gaming Console (cat-8) - 10 sản phẩm
(71, N'PlayStation 5 Pro', 'Sony', 'cat-8', 19990000, 25, N'PS5 Pro nâng cấp GPU mạnh', '/uploads/Gaming Console/PlayStation-5-Pro.jpg'),
(72, N'PlayStation 5 Slim', 'Sony', 'cat-8', 13990000, 50, N'PS5 Slim bản nhỏ gọn', '/uploads/Gaming Console/PlayStation-5-Slim.jpg'),
(73, N'Xbox Series X 1TB', 'Microsoft', 'cat-8', 14990000, 30, N'Xbox mạnh nhất', '/uploads/Gaming Console/Xbox-Series-X-1TB.jpg'),
(74, N'Xbox Series S 1TB Black', 'Microsoft', 'cat-8', 9990000, 60, N'Xbox giá rẻ hiệu năng tốt', '/uploads/Gaming Console/Xbox-Series-S-1TB-Black.webp'),
(75, N'Nintendo Switch OLED', 'Nintendo', 'cat-8', 8990000, 70, N'Switch màn OLED', '/uploads/Gaming Console/Nintendo-Switch-OLED.webp'),
(76, N'Nintendo Switch 2 (2025)', 'Nintendo', 'cat-8', 11990000, 40, N'Switch thế hệ mới', '/uploads/Gaming Console/Nintendo-Switch-2(2025).png'),
(77, N'Steam Deck OLED 1TB', 'Valve', 'cat-8', 17990000, 20, N'PC cầm tay chơi game Steam', '/uploads/Gaming Console/Steam-Deck-OLED-1TB.jpg'),
(78, N'ASUS ROG Ally X', 'Asus', 'cat-8', 20990000, 18, N'Windows handheld mạnh nhất', '/uploads/Gaming Console/ASUS-ROG-Ally-X.jpg'),
(79, N'Ayn Odin 2 Pro', 'Ayn', 'cat-8', 9990000, 35, N'Máy chơi game Android mạnh', '/uploads/Gaming Console/Ayn-Odin-2-Pro.jpg'),
(80, N'Logitech G Cloud', 'Logitech', 'cat-8', 8990000, 30, N'Chuyên cloud gaming', '/uploads/Gaming Console/Logitech-G-Cloud.jpg');

SET IDENTITY_INSERT Product OFF;





