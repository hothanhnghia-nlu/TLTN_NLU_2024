﻿using System;
using FITExamAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FITExamAPI.Data
{
    public class FitExamContext : DbContext
    {
        public FitExamContext(DbContextOptions options) 
            : base(options) 
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        public DbSet<Log> Logs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Faculty)
                .WithMany(f => f.Users)
                .HasForeignKey(u => u.FacultyId);
            
            modelBuilder.Entity<Exam>()
                .HasOne(e => e.Subject)
                .WithMany(s => s.Exams)
                .HasForeignKey(e => e.SubjectId);
            
            modelBuilder.Entity<Exam>()
                .HasOne(e => e.User)
                .WithMany(s => s.Exams)
                .HasForeignKey(e => e.CreatorId);
           
            modelBuilder.Entity<Image>()
                .HasOne(i => i.Subject)
                .WithOne(s => s.Image)
                .HasForeignKey<Subject>(i => i.ImageId);
            
            modelBuilder.Entity<Image>()
                .HasOne(i => i.User)
                .WithOne(s => s.Image)
                .HasForeignKey<User>(i => i.ImageId);
                               
            modelBuilder.Entity<Result>()
                .HasOne(s => s.Exam)
                .WithMany(e => e.Results)
                .HasForeignKey(s => s.ExamId);
          
            modelBuilder.Entity<Result>()
                .HasOne(s => s.User)
                .WithMany(e => e.Results)
                .HasForeignKey(s => s.UserId);

            modelBuilder.Entity<Question>()
                .HasOne(q => q.Subject)
                .WithMany(s => s.Questions)
                .HasForeignKey(q => q.SubjectId);

            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionId);
             
            modelBuilder.Entity<Log>()
                .HasOne(l => l.User)
                .WithMany(u => u.Logs)
                .HasForeignKey(l => l.UserId);

        }
    }
}
