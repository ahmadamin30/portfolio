-- AlterTable
ALTER TABLE `projects`
    ADD COLUMN `descriptionAr` TEXT NOT NULL DEFAULT (''),
    ADD COLUMN `descriptionEn` TEXT NOT NULL DEFAULT (''),
    ADD COLUMN `descriptionTr` TEXT NOT NULL DEFAULT (''),
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `orderIndex` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `titleAr` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `titleEn` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `titleTr` VARCHAR(191) NOT NULL DEFAULT '';

UPDATE `projects` SET 
    `titleEn` = `title`, 
    `titleAr` = `title`, 
    `titleTr` = `title`, 
    `descriptionEn` = `description`, 
    `descriptionAr` = `description`, 
    `descriptionTr` = `description`, 
    `isFeatured` = `featured`, 
    `orderIndex` = `displayOrder`;

ALTER TABLE `projects` 
    DROP COLUMN `description`,
    DROP COLUMN `displayOrder`,
    DROP COLUMN `featured`,
    DROP COLUMN `title`;

-- CreateTable
CREATE TABLE IF NOT EXISTS `site_settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `primaryColor` VARCHAR(191) NOT NULL DEFAULT '#3B82F6',
    `fontFamily` VARCHAR(191) NOT NULL DEFAULT 'Inter',
    `headingFontFamily` VARCHAR(191) NOT NULL DEFAULT 'Inter',
    `logoUrl` VARCHAR(191) NULL,
    `faviconUrl` VARCHAR(191) NULL,
    `resumeUrl` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `githubUrl` VARCHAR(191) NULL,
    `linkedinUrl` VARCHAR(191) NULL,
    `twitterUrl` VARCHAR(191) NULL,
    `emailContact` VARCHAR(191) NULL,
    `fullNameAr` VARCHAR(191) NOT NULL DEFAULT '',
    `fullNameEn` VARCHAR(191) NOT NULL DEFAULT '',
    `fullNameTr` VARCHAR(191) NOT NULL DEFAULT '',
    `jobTitleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `jobTitleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `jobTitleTr` VARCHAR(191) NOT NULL DEFAULT '',
    `bioAr` TEXT NOT NULL DEFAULT (''),
    `bioEn` TEXT NOT NULL DEFAULT (''),
    `bioTr` TEXT NOT NULL DEFAULT (''),
    `aboutTextAr` TEXT NOT NULL DEFAULT (''),
    `aboutTextEn` TEXT NOT NULL DEFAULT (''),
    `aboutTextTr` TEXT NOT NULL DEFAULT (''),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;