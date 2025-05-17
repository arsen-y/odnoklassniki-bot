-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 17, 2025 at 08:43 AM
-- Server version: 8.0.42-0ubuntu0.24.04.1
-- PHP Version: 8.3.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `okBot`
--

-- --------------------------------------------------------

--
-- Table structure for table `actions_history`
--

CREATE TABLE `actions_history` (
  `id` int UNSIGNED NOT NULL,
  `botId` int UNSIGNED NOT NULL,
  `route` char(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `startPage` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `param1` char(30) COLLATE utf8mb4_general_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `success` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `msg` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `actions_pre_queue`
--

CREATE TABLE `actions_pre_queue` (
  `id` int UNSIGNED NOT NULL,
  `botId` int UNSIGNED NOT NULL,
  `route` char(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `startPage` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `param1` char(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `actions_queue`
--

CREATE TABLE `actions_queue` (
  `id` int UNSIGNED NOT NULL,
  `botId` int UNSIGNED NOT NULL,
  `route` char(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `startPage` varchar(4096) COLLATE utf8mb4_general_ci NOT NULL,
  `param1` char(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bots_data`
--

CREATE TABLE `bots_data` (
  `id` int UNSIGNED NOT NULL,
  `proxy` char(155) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cookies` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `localStorage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `vars` mediumtext COLLATE utf8mb4_general_ci NOT NULL,
  `login` char(30) COLLATE utf8mb4_general_ci NOT NULL,
  `password` char(55) COLLATE utf8mb4_general_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dialogs`
--

CREATE TABLE `dialogs` (
  `id` bigint UNSIGNED NOT NULL,
  `botId` int UNSIGNED NOT NULL,
  `name` char(55) COLLATE utf8mb4_general_ci NOT NULL,
  `age` tinyint NOT NULL,
  `countMsgSended` int UNSIGNED NOT NULL DEFAULT '0',
  `context` text COLLATE utf8mb4_general_ci NOT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `time2` timestamp NULL DEFAULT NULL,
  `timeWatched` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_vars`
--

CREATE TABLE `global_vars` (
  `id` int UNSIGNED NOT NULL,
  `vars` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `people_pre_send`
--

CREATE TABLE `people_pre_send` (
  `id` bigint UNSIGNED NOT NULL,
  `botId` int UNSIGNED NOT NULL,
  `name` char(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `age` int UNSIGNED NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `people_worked`
--

CREATE TABLE `people_worked` (
  `id` bigint UNSIGNED NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stickers_sended`
--

CREATE TABLE `stickers_sended` (
  `id` int UNSIGNED NOT NULL,
  `profileId` bigint UNSIGNED NOT NULL,
  `userId` bigint NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `video_sended`
--

CREATE TABLE `video_sended` (
  `id` int UNSIGNED NOT NULL,
  `profileId` bigint UNSIGNED NOT NULL,
  `userId` bigint NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `youtube_data`
--

CREATE TABLE `youtube_data` (
  `id` int UNSIGNED NOT NULL,
  `video_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actions_history`
--
ALTER TABLE `actions_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `botId` (`botId`);

--
-- Indexes for table `actions_pre_queue`
--
ALTER TABLE `actions_pre_queue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `botId` (`botId`);

--
-- Indexes for table `actions_queue`
--
ALTER TABLE `actions_queue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `botId` (`botId`);

--
-- Indexes for table `bots_data`
--
ALTER TABLE `bots_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dialogs`
--
ALTER TABLE `dialogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `global_vars`
--
ALTER TABLE `global_vars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `people_pre_send`
--
ALTER TABLE `people_pre_send`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `people_worked`
--
ALTER TABLE `people_worked`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stickers_sended`
--
ALTER TABLE `stickers_sended`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `video_sended`
--
ALTER TABLE `video_sended`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `youtube_data`
--
ALTER TABLE `youtube_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `video_id` (`video_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actions_history`
--
ALTER TABLE `actions_history`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `actions_pre_queue`
--
ALTER TABLE `actions_pre_queue`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `actions_queue`
--
ALTER TABLE `actions_queue`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bots_data`
--
ALTER TABLE `bots_data`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dialogs`
--
ALTER TABLE `dialogs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_vars`
--
ALTER TABLE `global_vars`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stickers_sended`
--
ALTER TABLE `stickers_sended`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `video_sended`
--
ALTER TABLE `video_sended`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `youtube_data`
--
ALTER TABLE `youtube_data`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
