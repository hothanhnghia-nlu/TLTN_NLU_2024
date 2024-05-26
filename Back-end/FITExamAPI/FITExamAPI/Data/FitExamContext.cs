using System;
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
        public DbSet<ResultDetail> ResultDetails { get; set; }
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
                .HasOne(i => i.User)
                .WithOne(u => u.Image)
                .HasForeignKey<Image>(i => i.UserId);
            
            modelBuilder.Entity<Image>()
                .HasOne(i => i.Subject)
                .WithOne(s => s.Image)
                .HasForeignKey<Image>(i => i.SubjectId);

            modelBuilder.Entity<Image>()
                .HasOne(i => i.Question)
                .WithMany(q => q.Images)
                .HasForeignKey(i => i.QuestionId);

            modelBuilder.Entity<Result>()
                .HasOne(r => r.Exam)
                .WithMany(e => e.Results)
                .HasForeignKey(s => s.ExamId);
          
            modelBuilder.Entity<Result>()
                .HasOne(r => r.User)
                .WithMany(e => e.Results)
                .HasForeignKey(s => s.UserId);      
            
            modelBuilder.Entity<ResultDetail>()
                .HasOne(rd => rd.Result)
                .WithMany(r => r.ResultDetails)
                .HasForeignKey(rd => rd.ResultId);

            modelBuilder.Entity<Question>()
                .HasOne(q => q.Exam)
                .WithMany(s => s.Questions)
                .HasForeignKey(q => q.ExamId);
            
            modelBuilder.Entity<Question>()
                .HasMany(rd => rd.ResultDetails)
                .WithOne(q => q.Question)
                .HasForeignKey(q => q.QuestionId);

            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Options)
                .HasForeignKey(a => a.QuestionId);
             
            modelBuilder.Entity<Answer>()
                .HasMany(rd => rd.ResultDetails)
                .WithOne(a => a.Answer)
                .HasForeignKey(a => a.AnswerId);

            modelBuilder.Entity<Log>()
                .HasOne(l => l.User)
                .WithMany(u => u.Logs)
                .HasForeignKey(l => l.UserId);

        }
    }
}
