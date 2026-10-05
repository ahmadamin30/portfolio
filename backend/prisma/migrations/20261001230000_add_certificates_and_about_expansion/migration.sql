-- AlterTable
ALTER TABLE `site_settings` ADD COLUMN `aboutParagraph2Ar` TEXT NULL,
    ADD COLUMN `aboutParagraph2En` TEXT NULL,
    ADD COLUMN `aboutParagraph2Tr` TEXT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS `certificates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `titleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `titleTr` VARCHAR(191) NOT NULL DEFAULT '',
    `issuer` VARCHAR(191) NOT NULL,
    `issueDate` VARCHAR(191) NOT NULL,
    `credentialUrl` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
