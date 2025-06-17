DELETE FROM message;
DELETE FROM chat;
DELETE FROM notification;
DELETE FROM review;
DELETE FROM favorite;
DELETE FROM booking;
DELETE FROM contract;
DELETE FROM availability;
DELETE FROM service;
DELETE FROM user_location;
DELETE FROM subcategory;
DELETE FROM category;
DELETE FROM "user";

-- Resetear las secuencias
ALTER SEQUENCE "user_id_seq" RESTART WITH 1;
ALTER SEQUENCE user_location_id_seq RESTART WITH 1;
ALTER SEQUENCE category_id_seq RESTART WITH 1;
ALTER SEQUENCE subcategory_id_seq RESTART WITH 1;
ALTER SEQUENCE service_id_seq RESTART WITH 1;
ALTER SEQUENCE availability_id_seq RESTART WITH 1;
ALTER SEQUENCE contract_id_seq RESTART WITH 1;
ALTER SEQUENCE booking_id_seq RESTART WITH 1;
ALTER SEQUENCE chat_id_seq RESTART WITH 1;
ALTER SEQUENCE message_id_seq RESTART WITH 1;
ALTER SEQUENCE review_id_seq RESTART WITH 1;
ALTER SEQUENCE favorite_id_seq RESTART WITH 1;
ALTER SEQUENCE notification_id_seq RESTART WITH 1;

-- Inserción de usuarios con ubicaciones en Murcia
INSERT INTO "user" ("firstName", "lastName", email, password, "isActive", "createdAt", "updatedAt") VALUES 
('María', 'García', 'maria@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Juan', 'Martínez', 'juan@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Ana', 'López', 'ana@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Pedro', 'Sánchez', 'pedro@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Laura', 'Fernández', 'laura@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Carlos', 'Rodríguez', 'carlos@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Sofía', 'González', 'sofia@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Miguel', 'Pérez', 'miguel@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Elena', 'Díaz', 'elena@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('David', 'Moreno', 'david@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Carmen', 'Jiménez', 'carmen@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Javier', 'Ruiz', 'javier@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Isabel', 'Hernández', 'isabel@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Antonio', 'López', 'antonio@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Lucía', 'Martín', 'lucia@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Pablo', 'Gómez', 'pablo@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Marta', 'Soto', 'marta@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Diego', 'Torres', 'diego@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Raquel', 'Molina', 'raquel@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Alberto', 'Reyes', 'alberto@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Natalia', 'Castro', 'natalia@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Roberto', 'Ortega', 'roberto@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Patricia', 'Rubio', 'patricia@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Fernando', 'Méndez', 'fernando@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Cristina', 'Aguilar', 'cristina@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW()),
('Vladyslav', 'Kapkan', 'vladickbaraza@gmail.com', '$2b$10$jGfWU6wSqggVFbwerKelmetJowYPUQejIYYARh23bEiFiM531R89i', true, NOW(), NOW());

-- Inserción de ubicaciones en Murcia
INSERT INTO user_location ("userId", latitude, longitude, address, "streetName", "streetNumber", city, province, country, "postalCode") VALUES
(1, 37.9922, -1.1307, 'Calle Mayor 1', 'Calle Mayor', '1', 'Murcia', 'Murcia', 'España', '30001'),
(2, 37.9856, -1.1284, 'Avenida Libertad 15', 'Avenida Libertad', '15', 'Murcia', 'Murcia', 'España', '30002'),
(3, 37.9789, -1.1293, 'Plaza Circular 8', 'Plaza Circular', '8', 'Murcia', 'Murcia', 'España', '30003'),
(4, 37.9912, -1.1315, 'Calle Trapería 3', 'Calle Trapería', '3', 'Murcia', 'Murcia', 'España', '30004'),
(5, 37.9845, -1.1278, 'Calle San Nicolás 12', 'Calle San Nicolás', '12', 'Murcia', 'Murcia', 'España', '30005'),
(6, 37.9778, -1.1302, 'Calle Sagasta 25', 'Calle Sagasta', '25', 'Murcia', 'Murcia', 'España', '30006'),
(7, 37.9901, -1.1323, 'Calle Platería 7', 'Calle Platería', '7', 'Murcia', 'Murcia', 'España', '30007'),
(8, 37.9834, -1.1272, 'Calle San Miguel 18', 'Calle San Miguel', '18', 'Murcia', 'Murcia', 'España', '30008'),
(9, 37.9767, -1.1311, 'Calle San Antonio 22', 'Calle San Antonio', '22', 'Murcia', 'Murcia', 'España', '30009'),
(10, 37.9890, -1.1332, 'Calle San Juan 14', 'Calle San Juan', '14', 'Murcia', 'Murcia', 'España', '30010'),
(11, 37.9823, -1.1261, 'Calle San Pedro 9', 'Calle San Pedro', '9', 'Murcia', 'Murcia', 'España', '30011'),
(12, 37.9756, -1.1290, 'Calle San Pablo 17', 'Calle San Pablo', '17', 'Murcia', 'Murcia', 'España', '30012'),
(13, 37.9889, -1.1321, 'Calle San Lucas 5', 'Calle San Lucas', '5', 'Murcia', 'Murcia', 'España', '30013'),
(14, 37.9812, -1.1250, 'Calle San Marcos 20', 'Calle San Marcos', '20', 'Murcia', 'Murcia', 'España', '30014'),
(15, 37.9745, -1.1279, 'Calle San Mateo 11', 'Calle San Mateo', '11', 'Murcia', 'Murcia', 'España', '30015'),
(16, 37.9878, -1.1308, 'Calle San Felipe 13', 'Calle San Felipe', '13', 'Murcia', 'Murcia', 'España', '30016'),
(17, 37.9801, -1.1237, 'Calle San Andrés 19', 'Calle San Andrés', '19', 'Murcia', 'Murcia', 'España', '30017'),
(18, 37.9734, -1.1266, 'Calle San Bartolomé 6', 'Calle San Bartolomé', '6', 'Murcia', 'Murcia', 'España', '30018'),
(19, 37.9867, -1.1295, 'Calle San Cristóbal 24', 'Calle San Cristóbal', '24', 'Murcia', 'Murcia', 'España', '30019'),
(20, 37.9790, -1.1224, 'Calle San Daniel 8', 'Calle San Daniel', '8', 'Murcia', 'Murcia', 'España', '30020'),
(21, 37.9723, -1.1253, 'Calle San Esteban 15', 'Calle San Esteban', '15', 'Murcia', 'Murcia', 'España', '30021'),
(22, 37.9856, -1.1282, 'Calle San Francisco 21', 'Calle San Francisco', '21', 'Murcia', 'Murcia', 'España', '30022'),
(23, 37.9789, -1.1211, 'Calle San Gabriel 10', 'Calle San Gabriel', '10', 'Murcia', 'Murcia', 'España', '30023'),
(24, 37.9712, -1.1240, 'Calle San Hilario 16', 'Calle San Hilario', '16', 'Murcia', 'Murcia', 'España', '30024'),
(25, 37.9845, -1.1269, 'Calle San Ignacio 23', 'Calle San Ignacio', '23', 'Murcia', 'Murcia', 'España', '30025'),
(26, 37.9778, -1.1198, 'Calle San Isidro 9', 'Calle San Isidro', '9', 'Murcia', 'Murcia', 'España', '30026');

-- Inserción de categorías
INSERT INTO category (id, name, description, "createdAt", "updatedAt") VALUES 
(1, 'Hogar', 'Servicios de hogar', NOW(), NOW()),
(2, 'Clases', 'Servicios de clases', NOW(), NOW()),
(3, 'Deporte', 'Servicios de deporte', NOW(), NOW()),
(4, 'Cuidados', 'Servicios de cuidados', NOW(), NOW()),
(5, 'Mascotas', 'Servicios de mascotas', NOW(), NOW()),
(6, 'Otros', 'Otros servicios', NOW(), NOW());

-- Inserción de subcategorías
INSERT INTO subcategory (id, name, description, "categoryId", "createdAt", "updatedAt") VALUES 
-- Hogar
(7, 'Plancha', 'Servicio de planchado a domicilio', 1, NOW(), NOW()),
(8, 'Limpieza', 'Servicio de limpieza del hogar', 1, NOW(), NOW()),
(9, 'Manitas', 'Reparaciones y mantenimiento del hogar', 1, NOW(), NOW()),
(10, 'Jardinería', 'Mantenimiento de jardines', 1, NOW(), NOW()),

-- Clases
(11, 'Música', 'Clases de música', 2, NOW(), NOW()),
(12, 'Idiomas', 'Clases de idiomas', 2, NOW(), NOW()),
(13, 'Colegio', 'Apoyo escolar', 2, NOW(), NOW()),

-- Deporte
(14, 'Boxeo', 'Clases de boxeo', 3, NOW(), NOW()),
(15, 'Personal Training', 'Entrenamiento personalizado', 3, NOW(), NOW()),
(16, 'Yoga', 'Clases de yoga', 3, NOW(), NOW()),
(17, 'Pilates', 'Clases de pilates', 3, NOW(), NOW()),
(18, 'Pádel', 'Clases de pádel', 3, NOW(), NOW()),
(19, 'Tenis', 'Clases de tenis', 3, NOW(), NOW()),

-- Cuidados
(20, 'Niños', 'Cuidado de niños', 4, NOW(), NOW()),
(21, 'Ancianos', 'Cuidado de ancianos', 4, NOW(), NOW()),

-- Mascotas
(22, 'Peluquería', 'Peluquería para mascotas', 5, NOW(), NOW()),
(23, 'Paseador', 'Servicio de paseo de perros', 5, NOW(), NOW()),

-- Otros
(24, 'Fotógrafo', 'Servicios de fotografía', 6, NOW(), NOW()),
(25, 'Masajista', 'Servicios de masajes', 6, NOW(), NOW()),
(26, 'Fisioterapeuta', 'Servicios de fisioterapia', 6, NOW(), NOW());

-- Inserción de servicios
INSERT INTO service (description, price, "isActive", "requiresAcceptance", "userId", "subcategoryId", radius, "createdAt", "updatedAt") VALUES 
-- Hogar
('Limpieza profesional de hogares', 15.00, true, true, 1, 8, 50000, NOW(), NOW()),
('Planchado a domicilio', 18.00, true, true, 2, 7, 50000, NOW(), NOW()),
('Servicio de manitas', 25.00, true, true, 3, 9, 50000, NOW(), NOW()),
('Mantenimiento de jardines', 30.00, true, true, 4, 10, 50000, NOW(), NOW()),
('Limpieza de ventanas', 20.00, true, true, 5, 8, 50000, NOW(), NOW()),
('Planchado express', 15.00, true, true, 6, 7, 50000, NOW(), NOW()),
('Reparaciones eléctricas', 35.00, true, true, 7, 9, 50000, NOW(), NOW()),
('Diseño de jardines', 40.00, true, true, 8, 10, 50000, NOW(), NOW()),

-- Clases
('Clases de piano', 20.00, true, true, 9, 11, 50000, NOW(), NOW()),
('Clases de inglés', 15.00, true, true, 10, 12, 50000, NOW(), NOW()),
('Apoyo escolar primaria', 12.00, true, true, 11, 13, 50000, NOW(), NOW()),
('Clases de guitarra', 18.00, true, true, 12, 11, 50000, NOW(), NOW()),
('Clases de francés', 16.00, true, true, 13, 12, 50000, NOW(), NOW()),
('Apoyo escolar secundaria', 14.00, true, true, 14, 13, 50000, NOW(), NOW()),
('Clases de violín', 22.00, true, true, 15, 11, 50000, NOW(), NOW()),
('Clases de alemán', 17.00, true, true, 16, 12, 50000, NOW(), NOW()),

-- Deporte
('Clases de boxeo', 25.00, true, true, 17, 14, 50000, NOW(), NOW()),
('Entrenamiento personal', 30.00, true, true, 18, 15, 50000, NOW(), NOW()),
('Clases de yoga', 15.00, true, true, 19, 16, 50000, NOW(), NOW()),
('Clases de pilates', 18.00, true, true, 20, 17, 50000, NOW(), NOW()),
('Clases de pádel', 20.00, true, true, 21, 18, 50000, NOW(), NOW()),
('Clases de tenis', 22.00, true, true, 22, 19, 50000, NOW(), NOW()),
('Clases de kickboxing', 23.00, true, true, 23, 14, 50000, NOW(), NOW()),
('Entrenamiento funcional', 28.00, true, true, 24, 15, 50000, NOW(), NOW()),

-- Cuidados
('Cuidado de niños', 10.00, true, true, 25, 20, 50000, NOW(), NOW()),
('Cuidado de ancianos', 12.00, true, true, 26, 21, 50000, NOW(), NOW()),
('Cuidado de bebés', 11.00, true, true, 1, 20, 50000, NOW(), NOW()),
('Cuidado de personas dependientes', 13.00, true, true, 2, 21, 50000, NOW(), NOW()),

-- Mascotas
('Peluquería canina', 20.00, true, false, 3, 22, 50000, NOW(), NOW()),
('Paseo de perros', 8.00, true, false, 4, 23, 50000, NOW(), NOW()),
('Peluquería felina', 18.00, true, false, 5, 22, 50000, NOW(), NOW()),
('Cuidado de mascotas', 15.00, true, false, 6, 23, 50000, NOW(), NOW()),

-- Otros
('Servicio de fotografía', 50.00, true, true, 7, 24, 50000, NOW(), NOW()),
('Masajes relajantes', 35.00, true, true, 8, 25, 50000, NOW(), NOW()),
('Fisioterapia a domicilio', 40.00, true, true, 9, 26, 50000, NOW(), NOW()),
('Fotografía de eventos', 45.00, true, true, 10, 24, 50000, NOW(), NOW()),
('Masajes deportivos', 38.00, true, true, 11, 25, 50000, NOW(), NOW()),
('Fisioterapia deportiva', 42.00, true, true, 12, 26, 50000, NOW(), NOW());

-- Inserción de disponibilidades
INSERT INTO availability ("userId", "dayOfWeek", "startTime", "endTime", "isActive", "createdAt", "updatedAt") VALUES
-- Usuario 1
(1, 1, '09:00', '17:00', true, NOW(), NOW()),
(1, 2, '09:00', '17:00', true, NOW(), NOW()),
(1, 3, '09:00', '17:00', true, NOW(), NOW()),
(1, 4, '09:00', '17:00', true, NOW(), NOW()),
(1, 5, '09:00', '17:00', true, NOW(), NOW()),

-- Usuario 2
(2, 1, '08:00', '16:00', true, NOW(), NOW()),
(2, 2, '08:00', '16:00', true, NOW(), NOW()),
(2, 3, '08:00', '16:00', true, NOW(), NOW()),
(2, 4, '08:00', '16:00', true, NOW(), NOW()),
(2, 5, '08:00', '16:00', true, NOW(), NOW()),

-- Usuario 3
(3, 1, '10:00', '18:00', true, NOW(), NOW()),
(3, 2, '10:00', '18:00', true, NOW(), NOW()),
(3, 3, '10:00', '18:00', true, NOW(), NOW()),
(3, 4, '10:00', '18:00', true, NOW(), NOW()),
(3, 5, '10:00', '18:00', true, NOW(), NOW()),

-- Usuario 4
(4, 1, '07:00', '15:00', true, NOW(), NOW()),
(4, 2, '07:00', '15:00', true, NOW(), NOW()),
(4, 3, '07:00', '15:00', true, NOW(), NOW()),
(4, 4, '07:00', '15:00', true, NOW(), NOW()),
(4, 5, '07:00', '15:00', true, NOW(), NOW()),

-- Usuario 5
(5, 1, '16:00', '20:00', true, NOW(), NOW()),
(5, 2, '16:00', '20:00', true, NOW(), NOW()),
(5, 3, '16:00', '20:00', true, NOW(), NOW()),
(5, 4, '16:00', '20:00', true, NOW(), NOW()),
(5, 5, '16:00', '20:00', true, NOW(), NOW()),

-- Usuario 6
(6, 1, '09:00', '13:00', true, NOW(), NOW()),
(6, 2, '09:00', '13:00', true, NOW(), NOW()),
(6, 3, '09:00', '13:00', true, NOW(), NOW()),
(6, 4, '09:00', '13:00', true, NOW(), NOW()),
(6, 5, '09:00', '13:00', true, NOW(), NOW()),

-- Usuario 7
(7, 1, '15:00', '19:00', true, NOW(), NOW()),
(7, 2, '15:00', '19:00', true, NOW(), NOW()),
(7, 3, '15:00', '19:00', true, NOW(), NOW()),
(7, 4, '15:00', '19:00', true, NOW(), NOW()),
(7, 5, '15:00', '19:00', true, NOW(), NOW()),

-- Usuario 8
(8, 1, '08:00', '12:00', true, NOW(), NOW()),
(8, 2, '08:00', '12:00', true, NOW(), NOW()),
(8, 3, '08:00', '12:00', true, NOW(), NOW()),
(8, 4, '08:00', '12:00', true, NOW(), NOW()),
(8, 5, '08:00', '12:00', true, NOW(), NOW()),

-- Usuario 9
(9, 1, '13:00', '17:00', true, NOW(), NOW()),
(9, 2, '13:00', '17:00', true, NOW(), NOW()),
(9, 3, '13:00', '17:00', true, NOW(), NOW()),
(9, 4, '13:00', '17:00', true, NOW(), NOW()),
(9, 5, '13:00', '17:00', true, NOW(), NOW()),

-- Usuario 10
(10, 1, '10:00', '14:00', true, NOW(), NOW()),
(10, 2, '10:00', '14:00', true, NOW(), NOW()),
(10, 3, '10:00', '14:00', true, NOW(), NOW()),
(10, 4, '10:00', '14:00', true, NOW(), NOW()),
(10, 5, '10:00', '14:00', true, NOW(), NOW()),

-- Usuario 11
(11, 1, '16:00', '20:00', true, NOW(), NOW()),
(11, 2, '16:00', '20:00', true, NOW(), NOW()),
(11, 3, '16:00', '20:00', true, NOW(), NOW()),
(11, 4, '16:00', '20:00', true, NOW(), NOW()),
(11, 5, '16:00', '20:00', true, NOW(), NOW()),

-- Usuario 12
(12, 1, '09:00', '13:00', true, NOW(), NOW()),
(12, 2, '09:00', '13:00', true, NOW(), NOW()),
(12, 3, '09:00', '13:00', true, NOW(), NOW()),
(12, 4, '09:00', '13:00', true, NOW(), NOW()),
(12, 5, '09:00', '13:00', true, NOW(), NOW()),

-- Usuario 13
(13, 1, '15:00', '19:00', true, NOW(), NOW()),
(13, 2, '15:00', '19:00', true, NOW(), NOW()),
(13, 3, '15:00', '19:00', true, NOW(), NOW()),
(13, 4, '15:00', '19:00', true, NOW(), NOW()),
(13, 5, '15:00', '19:00', true, NOW(), NOW()),

-- Usuario 14
(14, 1, '08:00', '12:00', true, NOW(), NOW()),
(14, 2, '08:00', '12:00', true, NOW(), NOW()),
(14, 3, '08:00', '12:00', true, NOW(), NOW()),
(14, 4, '08:00', '12:00', true, NOW(), NOW()),
(14, 5, '08:00', '12:00', true, NOW(), NOW()),

-- Usuario 15
(15, 1, '13:00', '17:00', true, NOW(), NOW()),
(15, 2, '13:00', '17:00', true, NOW(), NOW()),
(15, 3, '13:00', '17:00', true, NOW(), NOW()),
(15, 4, '13:00', '17:00', true, NOW(), NOW()),
(15, 5, '13:00', '17:00', true, NOW(), NOW()),

-- Usuario 16
(16, 1, '09:00', '17:00', true, NOW(), NOW()),
(16, 2, '09:00', '17:00', true, NOW(), NOW()),
(16, 3, '09:00', '17:00', true, NOW(), NOW()),
(16, 4, '09:00', '17:00', true, NOW(), NOW()),
(16, 5, '09:00', '17:00', true, NOW(), NOW()),

-- Usuario 17
(17, 1, '08:00', '16:00', true, NOW(), NOW()),
(17, 2, '08:00', '16:00', true, NOW(), NOW()),
(17, 3, '08:00', '16:00', true, NOW(), NOW()),
(17, 4, '08:00', '16:00', true, NOW(), NOW()),
(17, 5, '08:00', '16:00', true, NOW(), NOW()),

-- Usuario 18
(18, 1, '10:00', '18:00', true, NOW(), NOW()),
(18, 2, '10:00', '18:00', true, NOW(), NOW()),
(18, 3, '10:00', '18:00', true, NOW(), NOW()),
(18, 4, '10:00', '18:00', true, NOW(), NOW()),
(18, 5, '10:00', '18:00', true, NOW(), NOW()),

-- Usuario 19
(19, 1, '07:00', '15:00', true, NOW(), NOW()),
(19, 2, '07:00', '15:00', true, NOW(), NOW()),
(19, 3, '07:00', '15:00', true, NOW(), NOW()),
(19, 4, '07:00', '15:00', true, NOW(), NOW()),
(19, 5, '07:00', '15:00', true, NOW(), NOW()),

-- Usuario 20
(20, 1, '16:00', '20:00', true, NOW(), NOW()),
(20, 2, '16:00', '20:00', true, NOW(), NOW()),
(20, 3, '16:00', '20:00', true, NOW(), NOW()),
(20, 4, '16:00', '20:00', true, NOW(), NOW()),
(20, 5, '16:00', '20:00', true, NOW(), NOW()),

-- Usuario 21
(21, 1, '09:00', '13:00', true, NOW(), NOW()),
(21, 2, '09:00', '13:00', true, NOW(), NOW()),
(21, 3, '09:00', '13:00', true, NOW(), NOW()),
(21, 4, '09:00', '13:00', true, NOW(), NOW()),
(21, 5, '09:00', '13:00', true, NOW(), NOW()),

-- Usuario 22
(22, 1, '15:00', '19:00', true, NOW(), NOW()),
(22, 2, '15:00', '19:00', true, NOW(), NOW()),
(22, 3, '15:00', '19:00', true, NOW(), NOW()),
(22, 4, '15:00', '19:00', true, NOW(), NOW()),
(22, 5, '15:00', '19:00', true, NOW(), NOW()),

-- Usuario 23
(23, 1, '08:00', '12:00', true, NOW(), NOW()),
(23, 2, '08:00', '12:00', true, NOW(), NOW()),
(23, 3, '08:00', '12:00', true, NOW(), NOW()),
(23, 4, '08:00', '12:00', true, NOW(), NOW()),
(23, 5, '08:00', '12:00', true, NOW(), NOW()),

-- Usuario 24
(24, 1, '13:00', '17:00', true, NOW(), NOW()),
(24, 2, '13:00', '17:00', true, NOW(), NOW()),
(24, 3, '13:00', '17:00', true, NOW(), NOW()),
(24, 4, '13:00', '17:00', true, NOW(), NOW()),
(24, 5, '13:00', '17:00', true, NOW(), NOW()),

-- Usuario 25
(25, 1, '10:00', '14:00', true, NOW(), NOW()),
(25, 2, '10:00', '14:00', true, NOW(), NOW()),
(25, 3, '10:00', '14:00', true, NOW(), NOW()),
(25, 4, '10:00', '14:00', true, NOW(), NOW()),
(25, 5, '10:00', '14:00', true, NOW(), NOW()),

-- Usuario 26
(26, 1, '16:00', '20:00', true, NOW(), NOW()),
(26, 2, '16:00', '20:00', true, NOW(), NOW()),
(26, 3, '16:00', '20:00', true, NOW(), NOW()),
(26, 4, '16:00', '20:00', true, NOW(), NOW()),
(26, 5, '16:00', '20:00', true, NOW(), NOW());

-- Inserción de contratos
INSERT INTO contract ("serviceId", "clientId", "providerId", status, "agreedPrice", amount, "createdAt", "updatedAt") VALUES 
(1, 2, 1, 'paid', 15.00, 15.00, NOW(), NOW()),
(2, 3, 2, 'paid', 18.00, 18.00, NOW(), NOW()),
(3, 4, 3, 'paid', 25.00, 25.00, NOW(), NOW()),
(4, 5, 4, 'paid', 30.00, 30.00, NOW(), NOW()),
(5, 6, 5, 'paid', 20.00, 20.00, NOW(), NOW()),
(6, 7, 6, 'paid', 15.00, 15.00, NOW(), NOW()),
(7, 8, 7, 'paid', 12.00, 12.00, NOW(), NOW()),
(8, 9, 8, 'paid', 25.00, 25.00, NOW(), NOW()),
(9, 10, 9, 'paid', 30.00, 30.00, NOW(), NOW()),
(10, 11, 10, 'paid', 15.00, 15.00, NOW(), NOW()),
(11, 12, 11, 'paid', 18.00, 18.00, NOW(), NOW()),
(12, 13, 12, 'paid', 20.00, 20.00, NOW(), NOW()),
(13, 14, 13, 'paid', 22.00, 22.00, NOW(), NOW()),
(14, 15, 14, 'paid', 10.00, 10.00, NOW(), NOW()),
(15, 1, 15, 'paid', 12.00, 12.00, NOW(), NOW());

-- Inserción de reservas
WITH contract_ids AS (
    SELECT id, "serviceId" FROM contract ORDER BY id
)
INSERT INTO booking ("contractId", "serviceId", "clientId", "providerId", "availabilityId", date, "startTime", "endTime", status, "totalPrice", "createdAt", "updatedAt")
SELECT 
    c.id,
    c."serviceId",
    s."userId",
    s."userId",
    a.id,
    CASE 
        WHEN c."serviceId" = 1 THEN TO_TIMESTAMP('2025-06-10', 'YYYY-MM-DD')
        WHEN c."serviceId" = 2 THEN TO_TIMESTAMP('2025-06-11', 'YYYY-MM-DD')
        WHEN c."serviceId" = 3 THEN TO_TIMESTAMP('2025-06-12', 'YYYY-MM-DD')
        WHEN c."serviceId" = 4 THEN TO_TIMESTAMP('2025-06-13', 'YYYY-MM-DD')
        WHEN c."serviceId" = 5 THEN TO_TIMESTAMP('2025-06-14', 'YYYY-MM-DD')
        WHEN c."serviceId" = 6 THEN TO_TIMESTAMP('2025-06-15', 'YYYY-MM-DD')
        WHEN c."serviceId" = 7 THEN TO_TIMESTAMP('2025-06-16', 'YYYY-MM-DD')
        WHEN c."serviceId" = 8 THEN TO_TIMESTAMP('2025-06-17', 'YYYY-MM-DD')
        WHEN c."serviceId" = 9 THEN TO_TIMESTAMP('2025-06-18', 'YYYY-MM-DD')
        WHEN c."serviceId" = 10 THEN TO_TIMESTAMP('2025-06-19', 'YYYY-MM-DD')
        WHEN c."serviceId" = 11 THEN TO_TIMESTAMP('2025-06-20', 'YYYY-MM-DD')
        WHEN c."serviceId" = 12 THEN TO_TIMESTAMP('2025-06-21', 'YYYY-MM-DD')
        WHEN c."serviceId" = 13 THEN TO_TIMESTAMP('2025-06-22', 'YYYY-MM-DD')
        WHEN c."serviceId" = 14 THEN TO_TIMESTAMP('2025-06-23', 'YYYY-MM-DD')
        WHEN c."serviceId" = 15 THEN TO_TIMESTAMP('2025-06-24', 'YYYY-MM-DD')
    END,
    CASE 
        WHEN c."serviceId" = 1 THEN '10:00'
        WHEN c."serviceId" = 2 THEN '09:00'
        WHEN c."serviceId" = 3 THEN '14:00'
        WHEN c."serviceId" = 4 THEN '11:00'
        WHEN c."serviceId" = 5 THEN '16:00'
        WHEN c."serviceId" = 6 THEN '15:00'
        WHEN c."serviceId" = 7 THEN '13:00'
        WHEN c."serviceId" = 8 THEN '08:00'
        WHEN c."serviceId" = 9 THEN '13:00'
        WHEN c."serviceId" = 10 THEN '10:00'
        WHEN c."serviceId" = 11 THEN '16:00'
        WHEN c."serviceId" = 12 THEN '09:00'
        WHEN c."serviceId" = 13 THEN '15:00'
        WHEN c."serviceId" = 14 THEN '08:00'
        WHEN c."serviceId" = 15 THEN '13:00'
    END,
    CASE 
        WHEN c."serviceId" = 1 THEN '12:00'
        WHEN c."serviceId" = 2 THEN '11:00'
        WHEN c."serviceId" = 3 THEN '16:00'
        WHEN c."serviceId" = 4 THEN '13:00'
        WHEN c."serviceId" = 5 THEN '18:00'
        WHEN c."serviceId" = 6 THEN '17:00'
        WHEN c."serviceId" = 7 THEN '15:00'
        WHEN c."serviceId" = 8 THEN '10:00'
        WHEN c."serviceId" = 9 THEN '15:00'
        WHEN c."serviceId" = 10 THEN '12:00'
        WHEN c."serviceId" = 11 THEN '18:00'
        WHEN c."serviceId" = 12 THEN '11:00'
        WHEN c."serviceId" = 13 THEN '17:00'
        WHEN c."serviceId" = 14 THEN '10:00'
        WHEN c."serviceId" = 15 THEN '15:00'
    END,
    'confirmed',
    CASE 
        WHEN c."serviceId" = 1 THEN 30.00
        WHEN c."serviceId" = 2 THEN 36.00
        WHEN c."serviceId" = 3 THEN 50.00
        WHEN c."serviceId" = 4 THEN 60.00
        WHEN c."serviceId" = 5 THEN 40.00
        WHEN c."serviceId" = 6 THEN 30.00
        WHEN c."serviceId" = 7 THEN 24.00
        WHEN c."serviceId" = 8 THEN 50.00
        WHEN c."serviceId" = 9 THEN 60.00
        WHEN c."serviceId" = 10 THEN 30.00
        WHEN c."serviceId" = 11 THEN 36.00
        WHEN c."serviceId" = 12 THEN 40.00
        WHEN c."serviceId" = 13 THEN 44.00
        WHEN c."serviceId" = 14 THEN 20.00
        WHEN c."serviceId" = 15 THEN 24.00
    END,
    NOW(),
    NOW()
FROM contract_ids c
JOIN service s ON s.id = c."serviceId"
JOIN availability a ON a."userId" = s."userId"
WHERE a.id IN (1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71);

-- Inserción de chats
INSERT INTO chat ("userId", "serviceProviderId", "serviceId", "isActive", "createdAt", "updatedAt") VALUES
(2, 1, 1, true, NOW(), NOW()),
(3, 2, 2, true, NOW(), NOW()),
(4, 3, 3, true, NOW(), NOW()),
(5, 4, 4, true, NOW(), NOW()),
(6, 5, 5, true, NOW(), NOW()),
(7, 6, 6, true, NOW(), NOW()),
(8, 7, 7, true, NOW(), NOW()),
(9, 8, 8, true, NOW(), NOW()),
(10, 9, 9, true, NOW(), NOW()),
(11, 10, 10, true, NOW(), NOW()),
(12, 11, 11, true, NOW(), NOW()),
(13, 12, 12, true, NOW(), NOW()),
(14, 13, 13, true, NOW(), NOW()),
(15, 14, 14, true, NOW(), NOW()),
(1, 15, 15, true, NOW(), NOW());

-- Inserción de mensajes del sistema
WITH chat_ids AS (
    SELECT id, "serviceId" FROM chat ORDER BY id
)
INSERT INTO message ("chatId", "senderId", content, "isRead", "isSystemMessage", "createdAt")
SELECT 
    c.id,
    1, -- ID del sistema
    CASE 
        WHEN c."serviceId" = 1 THEN E'Chat iniciado sobre el servicio: Limpieza profesional de hogares\nCategoría: Hogar\nSubcategoría: Limpieza\nPrecio: 15.00€'
        WHEN c."serviceId" = 2 THEN E'Chat iniciado sobre el servicio: Planchado a domicilio\nCategoría: Hogar\nSubcategoría: Plancha\nPrecio: 18.00€'
        WHEN c."serviceId" = 3 THEN E'Chat iniciado sobre el servicio: Servicio de manitas\nCategoría: Hogar\nSubcategoría: Manitas\nPrecio: 25.00€'
        WHEN c."serviceId" = 4 THEN E'Chat iniciado sobre el servicio: Mantenimiento de jardines\nCategoría: Hogar\nSubcategoría: Jardinería\nPrecio: 30.00€'
        WHEN c."serviceId" = 5 THEN E'Chat iniciado sobre el servicio: Clases de piano\nCategoría: Clases\nSubcategoría: Música\nPrecio: 20.00€'
        WHEN c."serviceId" = 6 THEN E'Chat iniciado sobre el servicio: Clases de inglés\nCategoría: Clases\nSubcategoría: Idiomas\nPrecio: 15.00€'
        WHEN c."serviceId" = 7 THEN E'Chat iniciado sobre el servicio: Apoyo escolar primaria\nCategoría: Clases\nSubcategoría: Colegio\nPrecio: 12.00€'
        WHEN c."serviceId" = 8 THEN E'Chat iniciado sobre el servicio: Clases de boxeo\nCategoría: Deporte\nSubcategoría: Boxeo\nPrecio: 25.00€'
        WHEN c."serviceId" = 9 THEN E'Chat iniciado sobre el servicio: Entrenamiento personal\nCategoría: Deporte\nSubcategoría: Personal Training\nPrecio: 30.00€'
        WHEN c."serviceId" = 10 THEN E'Chat iniciado sobre el servicio: Clases de yoga\nCategoría: Deporte\nSubcategoría: Yoga\nPrecio: 15.00€'
        WHEN c."serviceId" = 11 THEN E'Chat iniciado sobre el servicio: Clases de pilates\nCategoría: Deporte\nSubcategoría: Pilates\nPrecio: 18.00€'
        WHEN c."serviceId" = 12 THEN E'Chat iniciado sobre el servicio: Clases de pádel\nCategoría: Deporte\nSubcategoría: Pádel\nPrecio: 20.00€'
        WHEN c."serviceId" = 13 THEN E'Chat iniciado sobre el servicio: Clases de tenis\nCategoría: Deporte\nSubcategoría: Tenis\nPrecio: 22.00€'
        WHEN c."serviceId" = 14 THEN E'Chat iniciado sobre el servicio: Cuidado de niños\nCategoría: Cuidados\nSubcategoría: Niños\nPrecio: 10.00€'
        WHEN c."serviceId" = 15 THEN E'Chat iniciado sobre el servicio: Cuidado de ancianos\nCategoría: Cuidados\nSubcategoría: Ancianos\nPrecio: 12.00€'
    END,
    true,
    true,
    NOW()
FROM chat_ids c;

-- Inserción de mensajes de los usuarios
WITH chat_ids AS (
    SELECT id FROM chat ORDER BY id
)
INSERT INTO message ("chatId", "senderId", content, "isRead", "isSystemMessage", "createdAt")
SELECT 
    c.id,
    CASE 
        WHEN c.id = 1 THEN 2
        WHEN c.id = 2 THEN 3
        WHEN c.id = 3 THEN 4
        WHEN c.id = 4 THEN 5
        WHEN c.id = 5 THEN 6
        WHEN c.id = 6 THEN 7
        WHEN c.id = 7 THEN 8
        WHEN c.id = 8 THEN 9
        WHEN c.id = 9 THEN 10
        WHEN c.id = 10 THEN 11
        WHEN c.id = 11 THEN 12
        WHEN c.id = 12 THEN 13
        WHEN c.id = 13 THEN 14
        WHEN c.id = 14 THEN 15
        WHEN c.id = 15 THEN 1
    END,
    CASE 
        WHEN c.id = 1 THEN 'Hola, me gustaría contratar tu servicio de limpieza'
        WHEN c.id = 2 THEN 'Buenas, ¿tienes disponibilidad para planchado?'
        WHEN c.id = 3 THEN 'Hola, necesito ayuda con algunas reparaciones en casa'
        WHEN c.id = 4 THEN 'Buenas, ¿podrías ayudarme con el jardín?'
        WHEN c.id = 5 THEN 'Hola, me interesan las clases de piano'
        WHEN c.id = 6 THEN 'Buenas, ¿das clases de inglés?'
        WHEN c.id = 7 THEN 'Hola, busco apoyo escolar para mi hijo'
        WHEN c.id = 8 THEN 'Buenas, ¿tienes clases de boxeo?'
        WHEN c.id = 9 THEN 'Hola, me interesa el entrenamiento personal'
        WHEN c.id = 10 THEN 'Buenas, ¿das clases de yoga?'
        WHEN c.id = 11 THEN 'Hola, busco clases de pilates'
        WHEN c.id = 12 THEN 'Buenas, ¿tienes clases de pádel?'
        WHEN c.id = 13 THEN 'Hola, me interesan las clases de tenis'
        WHEN c.id = 14 THEN 'Buenas, ¿tienes disponibilidad para cuidar niños?'
        WHEN c.id = 15 THEN 'Hola, busco alguien para cuidar a mi madre'
    END,
    false,
    false,
    NOW()
FROM chat_ids c;

-- Inserción de reseñas
INSERT INTO review ("userId", "serviceId", rating, comment, "createdAt", "updatedAt") VALUES
-- Reseñas para servicios de Hogar
(2, 1, 5, 'Excelente servicio de limpieza, muy profesional y puntual', NOW(), NOW()),
(3, 1, 4, 'Muy buena limpieza, aunque un poco cara', NOW(), NOW()),
(4, 1, 5, 'La mejor limpieza que he tenido, muy detallista', NOW(), NOW()),
(5, 2, 4, 'Muy buen servicio de planchado, muy ordenado', NOW(), NOW()),
(6, 2, 5, 'Planchado perfecto, muy profesional', NOW(), NOW()),
(7, 2, 4, 'Buen servicio, puntual y eficiente', NOW(), NOW()),
(8, 3, 5, 'Gran trabajo con las reparaciones, muy profesional', NOW(), NOW()),
(9, 3, 4, 'Buen servicio de manitas, resolvió todos los problemas', NOW(), NOW()),
(10, 3, 5, 'Excelente trabajo, muy recomendable', NOW(), NOW()),
(11, 4, 4, 'Buen trabajo en el jardín, muy detallista', NOW(), NOW()),
(12, 4, 5, 'Jardín precioso, muy profesional', NOW(), NOW()),
(13, 4, 4, 'Buen servicio, aunque un poco lento', NOW(), NOW()),

-- Reseñas para servicios de Clases
(14, 9, 5, 'Excelente profesor de piano, muy paciente', NOW(), NOW()),
(15, 9, 4, 'Muy buenas clases, aprendí mucho', NOW(), NOW()),
(16, 9, 5, 'Profesor muy profesional y amable', NOW(), NOW()),
(17, 10, 4, 'Muy buenas clases de inglés, aprendí mucho', NOW(), NOW()),
(18, 10, 5, 'Excelente profesor, muy didáctico', NOW(), NOW()),
(19, 10, 4, 'Buenas clases, aunque un poco caras', NOW(), NOW()),
(20, 11, 5, 'Gran apoyo escolar, mi hijo ha mejorado mucho', NOW(), NOW()),
(21, 11, 4, 'Muy buen profesor, muy paciente', NOW(), NOW()),
(22, 11, 5, 'Excelente apoyo, muy recomendable', NOW(), NOW()),

-- Reseñas para servicios de Deporte
(23, 17, 4, 'Buenas clases de boxeo, muy profesional', NOW(), NOW()),
(24, 17, 5, 'Excelente entrenador, muy motivador', NOW(), NOW()),
(25, 17, 4, 'Muy buenas clases, aprendí mucho', NOW(), NOW()),
(26, 18, 5, 'Excelente entrenador personal, muy motivador', NOW(), NOW()),
(1, 18, 4, 'Muy buen entrenamiento, muy profesional', NOW(), NOW()),
(2, 18, 5, 'Gran entrenador, muy recomendable', NOW(), NOW()),
(3, 19, 4, 'Muy buenas clases de yoga, muy relajante', NOW(), NOW()),
(4, 19, 5, 'Excelente profesora, muy profesional', NOW(), NOW()),
(5, 19, 4, 'Buenas clases, aunque un poco caras', NOW(), NOW()),

-- Reseñas para servicios de Cuidados
(6, 25, 5, 'Muy buen cuidado de niños, muy responsable', NOW(), NOW()),
(7, 25, 4, 'Buena cuidadora, muy atenta', NOW(), NOW()),
(8, 25, 5, 'Excelente servicio, muy recomendable', NOW(), NOW()),
(9, 26, 4, 'Muy buen cuidado de ancianos, muy atento', NOW(), NOW()),
(10, 26, 5, 'Excelente servicio, muy profesional', NOW(), NOW()),
(11, 26, 4, 'Buen cuidado, aunque un poco caro', NOW(), NOW()),

-- Reseñas para servicios de Mascotas
(12, 29, 5, 'Excelente peluquería canina, muy profesional', NOW(), NOW()),
(13, 29, 4, 'Muy buen servicio, mi perro quedó precioso', NOW(), NOW()),
(14, 29, 5, 'Gran peluquera, muy amable', NOW(), NOW()),
(15, 30, 4, 'Muy buen servicio de paseo de perros', NOW(), NOW()),
(16, 30, 5, 'Excelente paseador, muy responsable', NOW(), NOW()),
(17, 30, 4, 'Buen servicio, aunque un poco caro', NOW(), NOW()),

-- Reseñas para servicios de Otros
(18, 33, 5, 'Excelente fotógrafo, muy profesional', NOW(), NOW()),
(19, 33, 4, 'Muy buenas fotos, aunque un poco caro', NOW(), NOW()),
(20, 33, 5, 'Gran servicio, muy recomendable', NOW(), NOW()),
(21, 34, 4, 'Muy buenos masajes, muy relajante', NOW(), NOW()),
(22, 34, 5, 'Excelente masajista, muy profesional', NOW(), NOW()),
(23, 34, 4, 'Buen servicio, aunque un poco caro', NOW(), NOW()),
(24, 35, 5, 'Excelente fisioterapeuta, muy profesional', NOW(), NOW()),
(25, 35, 4, 'Muy buen servicio, me ayudó mucho', NOW(), NOW()),
(26, 35, 5, 'Gran profesional, muy recomendable', NOW(), NOW());

-- Inserción de favoritos
INSERT INTO favorite ("userId", "serviceId", "createdAt", "updatedAt") VALUES
(2, 1, NOW(), NOW()),
(3, 2, NOW(), NOW()),
(4, 3, NOW(), NOW()),
(5, 4, NOW(), NOW()),
(6, 5, NOW(), NOW()),
(7, 6, NOW(), NOW()),
(8, 7, NOW(), NOW()),
(9, 8, NOW(), NOW()),
(10, 9, NOW(), NOW()),
(11, 10, NOW(), NOW()),
(12, 11, NOW(), NOW()),
(13, 12, NOW(), NOW()),
(14, 13, NOW(), NOW()),
(15, 14, NOW(), NOW()),
(1, 15, NOW(), NOW());

-- Inserción de notificaciones
WITH chat_ids AS (
    SELECT id FROM chat ORDER BY id
)
INSERT INTO notification ("userId", type, title, message, "isRead", data, "createdAt")
SELECT 
    CASE 
        WHEN c.id = 1 THEN 2
        WHEN c.id = 2 THEN 3
        WHEN c.id = 3 THEN 4
        WHEN c.id = 4 THEN 5
        WHEN c.id = 5 THEN 6
        WHEN c.id = 6 THEN 7
        WHEN c.id = 7 THEN 8
        WHEN c.id = 8 THEN 9
        WHEN c.id = 9 THEN 10
        WHEN c.id = 10 THEN 11
        WHEN c.id = 11 THEN 12
        WHEN c.id = 12 THEN 13
        WHEN c.id = 13 THEN 14
        WHEN c.id = 14 THEN 15
        WHEN c.id = 15 THEN 1
    END,
    'new_message',
    'Nuevo mensaje',
    CASE 
        WHEN c.id = 1 THEN 'Tienes un nuevo mensaje de María García'
        WHEN c.id = 2 THEN 'Tienes un nuevo mensaje de Juan Martínez'
        WHEN c.id = 3 THEN 'Tienes un nuevo mensaje de Ana López'
        WHEN c.id = 4 THEN 'Tienes un nuevo mensaje de Pedro Sánchez'
        WHEN c.id = 5 THEN 'Tienes un nuevo mensaje de Laura Fernández'
        WHEN c.id = 6 THEN 'Tienes un nuevo mensaje de Carlos Rodríguez'
        WHEN c.id = 7 THEN 'Tienes un nuevo mensaje de Sofía González'
        WHEN c.id = 8 THEN 'Tienes un nuevo mensaje de Miguel Pérez'
        WHEN c.id = 9 THEN 'Tienes un nuevo mensaje de Elena Díaz'
        WHEN c.id = 10 THEN 'Tienes un nuevo mensaje de David Moreno'
        WHEN c.id = 11 THEN 'Tienes un nuevo mensaje de Carmen Jiménez'
        WHEN c.id = 12 THEN 'Tienes un nuevo mensaje de Javier Ruiz'
        WHEN c.id = 13 THEN 'Tienes un nuevo mensaje de Isabel Hernández'
        WHEN c.id = 14 THEN 'Tienes un nuevo mensaje de Antonio López'
        WHEN c.id = 15 THEN 'Tienes un nuevo mensaje de Lucía Martín'
    END,
    false,
    json_build_object('chatId', c.id),
    NOW()
FROM chat_ids c;