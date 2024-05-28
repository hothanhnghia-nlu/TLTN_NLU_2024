CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    ALTER DATABASE CHARACTER SET utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `Faculties` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Name` varchar(255) CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_Faculties` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `Subjects` (
        `Id` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        `Name` varchar(255) CHARACTER SET utf8mb4 NULL,
        `Credit` int NULL,
        CONSTRAINT `PK_Subjects` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `Users` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Name` varchar(255) CHARACTER SET utf8mb4 NULL,
        `Email` varchar(320) CHARACTER SET utf8mb4 NULL,
        `Phone` varchar(10) CHARACTER SET utf8mb4 NULL,
        `Dob` datetime(6) NULL,
        `Gender` varchar(5) CHARACTER SET utf8mb4 NULL,
        `FacultyId` int NULL,
        `Password` varchar(255) CHARACTER SET utf8mb4 NULL,
        `Role` tinyint NULL,
        `CreatedAt` datetime(6) NULL,
        `UpdatedAt` datetime(6) NULL,
        `Status` tinyint NULL,
        CONSTRAINT `PK_Users` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Users_Faculties_FacultyId` FOREIGN KEY (`FacultyId`) REFERENCES `Faculties` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `Exams` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Name` varchar(255) CHARACTER SET utf8mb4 NULL,
        `SubjectId` varchar(255) CHARACTER SET utf8mb4 NULL,
        `CreatorId` int NULL,
        `ExamTime` int NULL,
        `NumberOfQuestions` int NULL,
        `StartDate` datetime(6) NULL,
        `EndDate` datetime(6) NULL,
        CONSTRAINT `PK_Exams` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Exams_Subjects_SubjectId` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`Id`),
        CONSTRAINT `FK_Exams_Users_CreatorId` FOREIGN KEY (`CreatorId`) REFERENCES `Users` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `Logs` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `UserId` int NULL,
        `Level` varchar(255) CHARACTER SET utf8mb4 NULL,
        `Source` longtext CHARACTER SET utf8mb4 NULL,
        `Ip` varchar(255) CHARACTER SET utf8mb4 NULL,
        `Content` longtext CHARACTER SET utf8mb4 NULL,
        `Status` tinyint NULL,
        `CreatedAt` datetime(6) NULL,
        CONSTRAINT `PK_Logs` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Logs_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `Questions` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Content` longtext CHARACTER SET utf8mb4 NULL,
        `ExamId` int NULL,
        `DifficultyLevel` varchar(255) CHARACTER SET utf8mb4 NULL,
        `ShuffleOrder` int NULL,
        CONSTRAINT `PK_Questions` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Questions_Exams_ExamId` FOREIGN KEY (`ExamId`) REFERENCES `Exams` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `Results` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `UserId` int NULL,
        `ExamId` int NULL,
        `TotalCorrectAnswer` int NULL,
        `Score` double NULL,
        `ExamDate` datetime(6) NULL,
        `OverallTime` int NULL,
        CONSTRAINT `PK_Results` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Results_Exams_ExamId` FOREIGN KEY (`ExamId`) REFERENCES `Exams` (`Id`),
        CONSTRAINT `FK_Results_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `Answers` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `QuestionId` int NULL,
        `Content` longtext CHARACTER SET utf8mb4 NULL,
        `IsCorrect` tinyint(1) NULL,
        CONSTRAINT `PK_Answers` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Answers_Questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `Questions` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `Images` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Name` varchar(255) CHARACTER SET utf8mb4 NULL,
        `Url` longtext CHARACTER SET utf8mb4 NULL,
        `UserId` int NULL,
        `SubjectId` varchar(255) CHARACTER SET utf8mb4 NULL,
        `QuestionId` int NULL,
        CONSTRAINT `PK_Images` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Images_Questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `Questions` (`Id`),
        CONSTRAINT `FK_Images_Subjects_SubjectId` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`Id`),
        CONSTRAINT `FK_Images_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE TABLE `ResultDetails` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `ResultId` int NULL,
        `QuestionId` int NULL,
        `AnswerId` int NULL,
        `IsCorrect` tinyint(1) NULL,
        CONSTRAINT `PK_ResultDetails` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_ResultDetails_Answers_AnswerId` FOREIGN KEY (`AnswerId`) REFERENCES `Answers` (`Id`),
        CONSTRAINT `FK_ResultDetails_Questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `Questions` (`Id`),
        CONSTRAINT `FK_ResultDetails_Results_ResultId` FOREIGN KEY (`ResultId`) REFERENCES `Results` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_Answers_QuestionId` ON `Answers` (`QuestionId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_Exams_CreatorId` ON `Exams` (`CreatorId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_Exams_SubjectId` ON `Exams` (`SubjectId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_Images_QuestionId` ON `Images` (`QuestionId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE UNIQUE INDEX `IX_Images_SubjectId` ON `Images` (`SubjectId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE UNIQUE INDEX `IX_Images_UserId` ON `Images` (`UserId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_Logs_UserId` ON `Logs` (`UserId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_Questions_ExamId` ON `Questions` (`ExamId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_ResultDetails_AnswerId` ON `ResultDetails` (`AnswerId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_ResultDetails_QuestionId` ON `ResultDetails` (`QuestionId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_ResultDetails_ResultId` ON `ResultDetails` (`ResultId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_Results_ExamId` ON `Results` (`ExamId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_Results_UserId` ON `Results` (`UserId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    CREATE INDEX `IX_Users_FacultyId` ON `Users` (`FacultyId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134359_OfficialMigration') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20240524134359_OfficialMigration', '8.0.4');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20240524134519_FakeMigration') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20240524134519_FakeMigration', '8.0.4');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

