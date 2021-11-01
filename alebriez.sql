/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100137
 Source Host           : localhost:3306
 Source Schema         : alebriez

 Target Server Type    : MySQL
 Target Server Version : 100137
 File Encoding         : 65001

 Date: 18/10/2021 14:39:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `type` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `totalGram` float NOT NULL,
  `purity` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `price` float NOT NULL,
  `density` float NOT NULL,
  `status` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `uri` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of transactions
-- ----------------------------
INSERT INTO `transactions` VALUES (1, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-8015d476-d4ec-439c-aaf3-a119c08277ea1382469340.jpg', '2021-10-14 17:00:56', '2021-10-14 17:00:56');
INSERT INTO `transactions` VALUES (2, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-8015d476-d4ec-439c-aaf3-a119c08277ea1382469340.jpg', '2021-10-14 17:12:22', '2021-10-14 17:12:22');
INSERT INTO `transactions` VALUES (3, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-099117a4-2abb-4d9f-9584-b8ec788c445b1917483450.jpg', '2021-10-14 17:12:47', '2021-10-14 17:12:47');
INSERT INTO `transactions` VALUES (4, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-099117a4-2abb-4d9f-9584-b8ec788c445b1917483450.jpg', '2021-10-14 17:15:23', '2021-10-14 17:15:23');
INSERT INTO `transactions` VALUES (5, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-1d5d5ddc-fcdf-4c9c-b046-f032295b2dd92086535299.jpg', '2021-10-14 17:17:29', '2021-10-14 17:17:29');
INSERT INTO `transactions` VALUES (6, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:19:49', '2021-10-14 17:19:49');
INSERT INTO `transactions` VALUES (7, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:20:08', '2021-10-14 17:20:08');
INSERT INTO `transactions` VALUES (8, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:20:10', '2021-10-14 17:20:10');
INSERT INTO `transactions` VALUES (9, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:20:14', '2021-10-14 17:20:14');
INSERT INTO `transactions` VALUES (10, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:20:23', '2021-10-14 17:20:23');
INSERT INTO `transactions` VALUES (11, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:21:07', '2021-10-14 17:21:07');
INSERT INTO `transactions` VALUES (12, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:21:10', '2021-10-14 17:21:10');
INSERT INTO `transactions` VALUES (13, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:21:18', '2021-10-14 17:21:18');
INSERT INTO `transactions` VALUES (14, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:21:18', '2021-10-14 17:21:18');
INSERT INTO `transactions` VALUES (15, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:21:19', '2021-10-14 17:21:19');
INSERT INTO `transactions` VALUES (16, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-899050b4-6d8b-4a01-baf5-dea82195f6bd1421408031.jpg', '2021-10-14 17:21:19', '2021-10-14 17:21:19');
INSERT INTO `transactions` VALUES (17, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-15386479-c9ac-44d8-940f-fd3ca0871259187496119.jpg', '2021-10-14 17:22:42', '2021-10-14 17:22:42');
INSERT INTO `transactions` VALUES (18, 'd', 'admin@admin.com', 'Sell', 3, '3', 3, 3, 'pending', 'file:///storage/emulated/0/Android/data/com.alebriez/files/Pictures/image-fe368337-cf99-4d9e-9ab9-168e8f7348eb1844952486.jpg', '2021-10-14 17:24:38', '2021-10-14 17:24:38');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `lastName` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `phoneNo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `passportNo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `selfieUrl` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `hash` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `type` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Jason', 'Watmore', 'admin@admin.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$w4EDGFokueb..BQ0z.23IeRObFnHNYI8ojneU6zWBR57XT.9ORMly', '2021-10-04 03:14:44', '2021-10-04 03:14:44', 'admin');
INSERT INTO `users` VALUES (2, 'Jason', 'Watmore', 'admisn@admin.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$HegR5Wq8oaTF8avZjpV2CumLoqZMEZBxFwkdKGKL.4elAChJH7TFO', '2021-10-04 03:24:05', '2021-10-04 03:24:05', NULL);
INSERT INTO `users` VALUES (3, 'Jason', 'Watmore', 'admisn@admi2n.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$Wa0IcmPbPgOkeLjsqXcJqOF4xQdggM5rEVwHpCy8jjrXkut8GppFK', '2021-10-12 15:00:26', '2021-10-12 15:00:26', NULL);
INSERT INTO `users` VALUES (4, 'Jason', 'Watmore', 'admisn@admis2n.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$CET6.atrA4zzbFhdqM562.ak3MEI/bTF0EWBDJRMFnJEMBR7lgTay', '2021-10-12 15:01:59', '2021-10-12 15:01:59', NULL);
INSERT INTO `users` VALUES (5, 'Jason', 'Watmore', 'admisn@admids2n.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$E0yFT3aP9cuiGPbosCROSuKUylU5TELrY6QiJJ6pGUyo.fEqPTeXC', '2021-10-12 15:02:29', '2021-10-12 15:02:29', NULL);
INSERT INTO `users` VALUES (6, 'Jason', 'Watmore', 'admdisn@admids2n.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$gmJOU6eLsvFciyZAE.pPLe7mr3v1d46ZaEZpuHJxhfPfBO2G/a1Zq', '2021-10-12 15:02:48', '2021-10-12 15:02:48', NULL);
INSERT INTO `users` VALUES (7, 'Jason', 'Watmore', 'addmdisn@admids2n.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$CX9RE2OELbcQoSgUeN81KuR5S0aBTC33rF8.dRBgDWzrN/40J8tSK', '2021-10-12 15:03:25', '2021-10-12 15:03:25', NULL);
INSERT INTO `users` VALUES (8, 'Jason', 'Watmore', 'adddmdisn@admids2n.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$99ibEFzX09kA94MNnNIyL.BCMLjl1SKkiDxdZ7NBJHbuSNoEy0mue', '2021-10-12 15:03:45', '2021-10-12 15:03:45', NULL);
INSERT INTO `users` VALUES (9, 'Jason', 'Watmore', 'adddmsdisn@admids2n.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$lIgEQF5dQo/TsyR8tgR7E.7QFT/yV5vVvZjVLqLBr8eTuv3cwk1UW', '2021-10-12 15:03:54', '2021-10-12 15:03:54', NULL);
INSERT INTO `users` VALUES (10, 'Jason', 'Watmore', 'adddmsdisn@admids2dn.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$Lvjey1Fv7vbOS4nyHnvIIeQYP5Bj4zZjZLavRtJbO66iu7enWfc5S', '2021-10-12 15:04:09', '2021-10-12 15:04:09', NULL);
INSERT INTO `users` VALUES (11, 'Jason', 'Watmore', 'addddmsdisn@admids2dn.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$f.yynnysPuEBDhh8Hw3AvuRwCJMajMsVOYFHetdLbODC78V9KF5Bm', '2021-10-12 15:04:20', '2021-10-12 15:04:20', NULL);
INSERT INTO `users` VALUES (12, 'Jason', 'Watmore', 'addddmsdidsn@admids2dn.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$InbS4A3qwuc9qq8zr05deerF0MuQfbxpf.CkySnOYo0JqREX.nPvy', '2021-10-12 15:04:49', '2021-10-12 15:04:49', NULL);
INSERT INTO `users` VALUES (13, 'Jason', 'Watmore', 'addddmsdidsnd@admids2dn.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$ApibR2BivrJrZ77e.9xQhefx3i1s0nDjcs/0KhVC3xRvNg5Iu0IFe', '2021-10-12 15:05:25', '2021-10-12 15:05:25', NULL);
INSERT INTO `users` VALUES (14, 'Jason', 'Watmore', 'adddddmsdidsnd@admids2dn.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$pehN5xLLgAwAxcnRJjRvGeasOZlN8ObmXWOf8azAeUS784kUx84Gu', '2021-10-12 15:08:17', '2021-10-12 15:08:17', NULL);
INSERT INTO `users` VALUES (15, 'Jason', 'Watmore', 'adddddmsdidsnd@admdids2dn.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$OAJHRgiFUMWe4bLY7GIOTuIM56F3C5G0GiXcLluUTjEhd7LrQJFvK', '2021-10-12 15:09:25', '2021-10-12 15:09:25', NULL);
INSERT INTO `users` VALUES (16, 'Jason', 'Watmore', 'adddddmsddidsnd@admdids2dn.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$n3Qi.qPur7oOtKQmYyfw7u2vTovmwTUVSMAMunIQT8G40KiieOHPG', '2021-10-12 15:11:17', '2021-10-12 15:11:17', NULL);
INSERT INTO `users` VALUES (17, 'Jason', 'Watmore', 'addddddmsddidsnd@admdids2dn.com', '16505551234', 'ajfljtelgelsajgle', 'aflawjgeljl', '$2a$10$BSGjCFdunL9bCqZoMQRTzOoSyQs..NxGOAcmJJq61g1ONT2DTHOs6', '2021-10-12 15:11:59', '2021-10-12 15:11:59', NULL);

SET FOREIGN_KEY_CHECKS = 1;
