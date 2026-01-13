CREATE TABLE `llm_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`baseUrl` varchar(512) NOT NULL DEFAULT 'https://api.openai.com/v1',
	`model` varchar(128) NOT NULL DEFAULT 'gpt-4',
	`apiKey` varchar(256) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `llm_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `numerology_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`fullName` varchar(256) NOT NULL,
	`birthDate` varchar(32) NOT NULL,
	`lifePathNumber` int NOT NULL,
	`soulNumber` int NOT NULL,
	`personalityNumber` int NOT NULL,
	`destinyNumber` int NOT NULL,
	`birthDayNumber` int NOT NULL,
	`birthChart` json,
	`aiAnalysis` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `numerology_readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tuvi_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`fullName` varchar(256) NOT NULL,
	`birthDate` varchar(32) NOT NULL,
	`birthHour` varchar(32) NOT NULL,
	`gender` enum('male','female') NOT NULL,
	`calendarType` enum('lunar','solar') NOT NULL,
	`chartData` json,
	`aiAnalysis` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tuvi_readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `numerology_readings` ADD CONSTRAINT `numerology_readings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tuvi_readings` ADD CONSTRAINT `tuvi_readings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;