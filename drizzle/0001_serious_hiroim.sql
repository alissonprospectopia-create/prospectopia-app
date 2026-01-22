CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`photo` text,
	`specialties` text,
	`qualities` text,
	`pomodoroWorkTime` int NOT NULL DEFAULT 25,
	`pomodoroRestTime` int NOT NULL DEFAULT 5,
	`currentProjectId` int,
	`status` enum('inactive','project','rest','meeting') NOT NULL DEFAULT 'inactive',
	`stateStartTime` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inviteLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(255) NOT NULL,
	`createdBy` int NOT NULL,
	`usedBy` int,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inviteLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `inviteLinks_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`type` enum('project','rest','meeting') NOT NULL,
	`projectId` int,
	`deadline` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(64) NOT NULL,
	`ownerId` int NOT NULL,
	`scope` text,
	`objectives` text,
	`deliverables` text,
	`contract` text,
	`status` enum('active','inactive','completed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`description` text NOT NULL,
	`createdBy` int NOT NULL,
	`deadline` timestamp,
	`status` enum('pending','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','employee') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `photo` text;