using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FITExamAPI.Service
{
    public class AnswerService : AnswerRepository
    {
        private readonly FitExamContext _context;

        public AnswerService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<List<Answer>> GetAllAsync()
        {
            return await _context.Answers.ToListAsync();
        }

        public async Task<List<Answer>> GetAllByQuestionIdAsync(int questionId)
        {
            return await _context.Answers.Where(a => a.QuestionId == questionId).ToListAsync();
        }

    }
}
