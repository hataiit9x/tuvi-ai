CREATE TABLE `numerology_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(256) NOT NULL,
	`birthDate` varchar(32) NOT NULL,
	`year` int NOT NULL,
	`lifePathNumber` int NOT NULL,
	`soulNumber` int NOT NULL,
	`personalityNumber` int NOT NULL,
	`destinyNumber` int NOT NULL,
	`birthDayNumber` int NOT NULL,
	`birthChart` json NOT NULL,
	`aiAnalysis` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `numerology_cache_id` PRIMARY KEY(`id`)
);
