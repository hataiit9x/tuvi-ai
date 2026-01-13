CREATE TABLE `tuvi_stars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vietnameseName` varchar(128) NOT NULL,
	`chineseName` varchar(64) NOT NULL,
	`pinyin` varchar(64),
	`nature` enum('cat','hung','neutral') NOT NULL,
	`type` enum('main','secondary','auxiliary') NOT NULL DEFAULT 'main',
	`meaning` text,
	`description` text,
	`influence` text,
	`palaceInfluence` json,
	`remedy` text,
	`compatibility` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tuvi_stars_id` PRIMARY KEY(`id`),
	CONSTRAINT `tuvi_stars_vietnameseName_unique` UNIQUE(`vietnameseName`)
);
