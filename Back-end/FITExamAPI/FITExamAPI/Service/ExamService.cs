using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FITExamAPI.Service
{
    public class ExamService : ExamRepository
    {
        private readonly FitExamContext _context;

        public ExamService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<Exam> CreateAsync(Exam exam)
        {
            await _context.Exams.AddAsync(exam);
            await _context.SaveChangesAsync();
            return exam;
        }

        public async Task<List<Exam>> GetAllAsync()
        {
            var exams = await _context.Exams
                .Include(e => e.Subject)
                .ThenInclude(s => s.Image)
                .Select(e => new Exam
                {
                    Id = e.Id,
                    Name = e.Name,
                    SubjectId = e.SubjectId,
                    CreatorId = e.CreatorId,
                    ExamTime = e.ExamTime,
                    NumberOfQuestions = e.NumberOfQuestions,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Subject = e.Subject,
                    User = new User
                    {
                        Id = e.User.Id,
                        Name = e.User.Name
                    }
                })
                .ToListAsync();

            return exams;
        }

        public async Task<List<Exam>> GetAllBySubjectIdAsync(string subjectId)
        {
            var exams = await _context.Exams
                .Include(e => e.Subject)
                .ThenInclude(s => s.Image)
                .Where(e => e.SubjectId == subjectId)
                .Select(e => new Exam
                {
                    Id = e.Id,
                    Name = e.Name,
                    SubjectId = e.SubjectId,
                    CreatorId = e.CreatorId,
                    ExamTime = e.ExamTime,
                    NumberOfQuestions = e.NumberOfQuestions,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Subject = e.Subject,
                    User = new User
                    {
                        Id = e.User.Id,
                        Name = e.User.Name
                    }
                })
                .ToListAsync();

            return exams;
        }

        public async Task<Exam?> GetByIdAsync(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Subject)
                .ThenInclude(s => s.Image)
                .Where(e => e.Id == id)
                .Select(e => new Exam
                {
                    Id = e.Id,
                    Name = e.Name,
                    SubjectId = e.SubjectId,
                    CreatorId = e.CreatorId,
                    ExamTime = e.ExamTime,
                    NumberOfQuestions = e.NumberOfQuestions,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Subject = e.Subject,
                    User = new User
                    {
                        Id = e.User.Id,
                        Name = e.User.Name
                    }
                })
                .FirstOrDefaultAsync();

            return exam;
        }

        public async Task<Exam?> UpdateAsync(int id, Exam exam)
        {
            var existingExam = await _context.Exams.FirstOrDefaultAsync(x => x.Id == id);
            if (existingExam == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(exam.Name))
            {
                existingExam.Name = exam.Name;
            }

            if (!string.IsNullOrEmpty(exam.SubjectId))
            {
                existingExam.SubjectId = exam.SubjectId;
            }

            if (exam.ExamTime.HasValue)
            {
                existingExam.ExamTime = exam.ExamTime;
            }
            
            if (exam.NumberOfQuestions.HasValue)
            {
                existingExam.NumberOfQuestions = exam.NumberOfQuestions;
            }
            
            if (exam.StartDate.HasValue)
            {
                existingExam.StartDate = exam.StartDate;
            }
            
            if (exam.EndDate.HasValue)
            {
                existingExam.EndDate = exam.EndDate;
            }

            await _context.SaveChangesAsync();
            return existingExam;
        }

        public async Task<Exam?> DeleteAsync(int id)
        {
            var exam = await _context.Exams.FirstOrDefaultAsync(x => x.Id == id);
            if (exam == null)
            {
                return null;
            }
            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();
            return exam;
        }

    }
}
