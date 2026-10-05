-- AlterTable
ALTER TABLE `site_settings` ADD COLUMN `availabilityStatusAr` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `availabilityStatusEn` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `availabilityStatusTr` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `contactEmail` VARCHAR(191) NULL,
    ADD COLUMN `defaultTitle` VARCHAR(191) NOT NULL DEFAULT 'Portfolio',
    ADD COLUMN `displayNameAr` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `displayNameEn` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `displayNameTr` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `heroHeadlineAr` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `heroHeadlineEn` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `heroHeadlineTr` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `keywords` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `locationAr` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `locationEn` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `locationTr` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `metaDescription` TEXT NULL,
    ADD COLUMN `profilePhotoUrl` VARCHAR(191) NULL,
    ADD COLUMN `robotsDirectives` VARCHAR(191) NOT NULL DEFAULT 'index, follow',
    ADD COLUMN `sectionCopywriting` JSON NULL,
    ADD COLUMN `siteName` VARCHAR(191) NOT NULL DEFAULT 'Portfolio',
    ADD COLUMN `titleTemplate` VARCHAR(191) NOT NULL DEFAULT '%s | Portfolio';

-- CreateTable
CREATE TABLE IF NOT EXISTS `workflow_steps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stepNumber` INTEGER NOT NULL,
    `titleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `titleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `titleTr` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionAr` TEXT NOT NULL,
    `descriptionEn` TEXT NOT NULL,
    `descriptionTr` TEXT NOT NULL,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `experiences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `degreeOrRoleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `degreeOrRoleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `degreeOrRoleTr` VARCHAR(191) NOT NULL DEFAULT '',
    `institutionOrCompanyAr` VARCHAR(191) NOT NULL DEFAULT '',
    `institutionOrCompanyEn` VARCHAR(191) NOT NULL DEFAULT '',
    `institutionOrCompanyTr` VARCHAR(191) NOT NULL DEFAULT '',
    `startDate` VARCHAR(191) NOT NULL DEFAULT '',
    `endDate` VARCHAR(191) NULL,
    `locationAr` VARCHAR(191) NOT NULL DEFAULT '',
    `locationEn` VARCHAR(191) NOT NULL DEFAULT '',
    `locationTr` VARCHAR(191) NOT NULL DEFAULT '',
    `icon` VARCHAR(191) NULL,
    `nodeColor` VARCHAR(191) NOT NULL DEFAULT '#3B82F6',
    `descriptionAr` TEXT NOT NULL,
    `descriptionEn` TEXT NOT NULL,
    `descriptionTr` TEXT NOT NULL,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `titleAr` VARCHAR(191) NOT NULL DEFAULT '',
    `titleEn` VARCHAR(191) NOT NULL DEFAULT '',
    `titleTr` VARCHAR(191) NOT NULL DEFAULT '',
    `descriptionAr` TEXT NOT NULL,
    `descriptionEn` TEXT NOT NULL,
    `descriptionTr` TEXT NOT NULL,
    `icon` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `faqs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL DEFAULT 'Services & Scope',
    `questionAr` VARCHAR(191) NOT NULL DEFAULT '',
    `questionEn` VARCHAR(191) NOT NULL DEFAULT '',
    `questionTr` VARCHAR(191) NOT NULL DEFAULT '',
    `answerAr` TEXT NOT NULL,
    `answerEn` TEXT NOT NULL,
    `answerTr` TEXT NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `social_links` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `platform` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `translation_keys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `valueAr` TEXT NOT NULL,
    `valueEn` TEXT NOT NULL,
    `valueTr` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'general',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `translation_keys_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
