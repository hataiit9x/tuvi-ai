CREATE TABLE `tuvi_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`birthDate` varchar(32) NOT NULL,
	`birthHour` varchar(32) NOT NULL,
	`gender` enum('male','female') NOT NULL,
	`calendarType` enum('lunar','solar') NOT NULL,
	`year` int NOT NULL,
	`chartData` json NOT NULL,
	`aiAnalysis` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tuvi_cache_id` PRIMARY KEY(`id`)
);
