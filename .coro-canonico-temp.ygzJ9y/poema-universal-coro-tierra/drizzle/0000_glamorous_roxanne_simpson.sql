CREATE TABLE `voices` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`place` text DEFAULT '' NOT NULL,
	`language` text DEFAULT '' NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`file_name` text NOT NULL,
	`storage_key` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `voices_storage_key_unique` ON `voices` (`storage_key`);