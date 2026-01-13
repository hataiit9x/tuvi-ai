CREATE TABLE `tet_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`functionName` varchar(32) NOT NULL,
	`birthYear` int NOT NULL,
	`year` int NOT NULL,
	`data` json NOT NULL,
	`aiAdvice` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tet_cache_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `zodiac_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`animal` varchar(32) NOT NULL,
	`year` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `zodiac_cache_id` PRIMARY KEY(`id`)
);
