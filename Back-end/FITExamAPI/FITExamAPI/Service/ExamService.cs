using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
            return await _context.Exams.ToListAsync();
        }

        public async Task<Exam?> GetByIdAsync(int id)
        {
            return await _context.Exams.FindAsync(id);
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

            if (exam.ExamTime.HasValue)
            {
                existingExam.ExamTime = exam.ExamTime;
            }
            
            if (exam.NumberOfQuestions.HasValue)
            {
                existingExam.NumberOfQuestions = exam.NumberOfQuestions;
            }
            
            if (exam.StartTime.HasValue)
            {
                existingExam.StartTime = exam.StartTime;
            }
            
            if (exam.EndTime.HasValue)
            {
                existingExam.EndTime = exam.EndTime;
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
