IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE TABLE [Faculties] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(255) NULL,
        CONSTRAINT [PK_Faculties] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE TABLE [Images] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(255) NULL,
        [Url] nvarchar(max) NULL,
        CONSTRAINT [PK_Images] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE TABLE [Subjects] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(255) NULL,
        [Credit] int NULL,
        [ImageId] int NULL,
        CONSTRAINT [PK_Subjects] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Subjects_Images_ImageId] FOREIGN KEY ([ImageId]) REFERENCES [Images] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE TABLE [Users] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(255) NULL,
        [Email] nvarchar(320) NULL,
        [Phone] nvarchar(10) NULL,
        [Dob] datetime2 NULL,
        [Gender] nvarchar(5) NULL,
        [ImageId] int NULL,
        [FacultyId] int NULL,
        [Password] nvarchar(255) NULL,
        [Role] smallint NULL,
        [CreatedAt] datetime2 NULL,
        [UpdatedAt] datetime2 NULL,
        [Status] smallint NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Users_Faculties_FacultyId] FOREIGN KEY ([FacultyId]) REFERENCES [Faculties] ([Id]),
        CONSTRAINT [FK_Users_Images_ImageId] FOREIGN KEY ([ImageId]) REFERENCES [Images] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE TABLE [Questions] (
        [Id] int NOT NULL IDENTITY,
        [Content] nvarchar(max) NULL,
        [QuestionType] nvarchar(255) NULL,
        [ImageId] int NULL,
        [SubjectId] nvarchar(450) NULL,
        [DifficultyLevel] nvarchar(255) NULL,
        CONSTRAINT [PK_Questions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Questions_Images_ImageId] FOREIGN KEY ([ImageId]) REFERENCES [Images] ([Id]),
        CONSTRAINT [FK_Questions_Subjects_SubjectId] FOREIGN KEY ([SubjectId]) REFERENCES [Subjects] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE TABLE [Exams] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(255) NULL,
        [SubjectId] nvarchar(450) NULL,
        [CreatorId] int NULL,
        [ExamTime] int NULL,
        [NumberOfQuestions] int NULL,
        [StartTime] datetime2 NULL,
        [EndTime] datetime2 NULL,
        CONSTRAINT [PK_Exams] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Exams_Subjects_SubjectId] FOREIGN KEY ([SubjectId]) REFERENCES [Subjects] ([Id]),
        CONSTRAINT [FK_Exams_Users_CreatorId] FOREIGN KEY ([CreatorId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE TABLE [Logs] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NULL,
        [Level] nvarchar(255) NULL,
        [Source] nvarchar(max) NULL,
        [Ip] nvarchar(255) NULL,
        [Content] nvarchar(max) NULL,
        [Status] smallint NULL,
        [CreatedAt] datetime2 NULL,
        CONSTRAINT [PK_Logs] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Logs_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE TABLE [Answers] (
        [Id] int NOT NULL IDENTITY,
        [QuestionId] int NULL,
        [Content] nvarchar(max) NULL,
        [IsCorrect] bit NULL,
        CONSTRAINT [PK_Answers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Answers_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE TABLE [Results] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NULL,
        [ExamId] int NULL,
        [TotalCorrectAnswer] int NULL,
        [Score] float NULL,
        [ExamDate] datetime2 NULL,
        [OverallTime] int NULL,
        CONSTRAINT [PK_Results] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Results_Exams_ExamId] FOREIGN KEY ([ExamId]) REFERENCES [Exams] ([Id]),
        CONSTRAINT [FK_Results_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE INDEX [IX_Answers_QuestionId] ON [Answers] ([QuestionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE INDEX [IX_Exams_CreatorId] ON [Exams] ([CreatorId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE INDEX [IX_Exams_SubjectId] ON [Exams] ([SubjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE INDEX [IX_Logs_UserId] ON [Logs] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE INDEX [IX_Questions_ImageId] ON [Questions] ([ImageId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE INDEX [IX_Questions_SubjectId] ON [Questions] ([SubjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE INDEX [IX_Results_ExamId] ON [Results] ([ExamId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE INDEX [IX_Results_UserId] ON [Results] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Subjects_ImageId] ON [Subjects] ([ImageId]) WHERE [ImageId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    CREATE INDEX [IX_Users_FacultyId] ON [Users] ([FacultyId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Users_ImageId] ON [Users] ([ImageId]) WHERE [ImageId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240503140607_InitDatabase'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20240503140607_InitDatabase', N'8.0.4');
END;
GO

COMMIT;
GO

