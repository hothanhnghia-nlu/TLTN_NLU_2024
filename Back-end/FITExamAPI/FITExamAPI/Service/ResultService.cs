using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FITExamAPI.Service
{
    public class ResultService : ResultRepository
    {
        private readonly FitExamContext _context;

        public ResultService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<Result> CreateAsync([FromForm] Result result)
        {
            await _context.Results.AddAsync(result);
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<List<Result>> GetAllAsync()
        {
            var results = await _context.Results
                .Include(r => r.Exam)
                .ThenInclude(e => e.Subject)
                .ThenInclude(s => s.Image)
                .Select(r => new Result
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    ExamId = r.ExamId,
                    TotalCorrectAnswer = r.TotalCorrectAnswer,
                    Score = r.Score,
                    ExamDate = r.ExamDate,
                    OverallTime = r.OverallTime,
                    Exam = r.Exam,
                    User = new User
                    {
                        Id = r.User.Id,
                        Name = r.User.Name
                    }
                })
                .ToListAsync();

            return results;
        }

        public async Task<List<Result>> GetAllByUserIdAsync(int userId)
        {
            var results = await _context.Results
                .Include(r => r.Exam)
                .ThenInclude(e => e.Subject)
                .ThenInclude(s => s.Image)
                .Select(r => new Result
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    ExamId = r.ExamId,
                    TotalCorrectAnswer = r.TotalCorrectAnswer,
                    Score = r.Score,
                    ExamDate = r.ExamDate,
                    OverallTime = r.OverallTime,
                    Exam = r.Exam,
                    User = new User
                    {
                        Id = r.User.Id,
                        Name = r.User.Name
                    }
                })
                .Where(r => r.UserId == userId)
                .ToListAsync();

            return results;
        }

        public async Task<Result?> GetByIdAsync(int id)
        {
            var result = await _context.Results
                .Include(r => r.Exam)
                .ThenInclude(e => e.Subject)
                .ThenInclude(s => s.Image)
                .Select(r => new Result
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    ExamId = r.ExamId,
                    TotalCorrectAnswer = r.TotalCorrectAnswer,
                    Score = r.Score,
                    ExamDate = r.ExamDate,
                    OverallTime = r.OverallTime,
                    Exam = r.Exam,
                    User = new User
                    {
                        Id = r.User.Id,
                        Name = r.User.Name
                    }
                })
                .FirstOrDefaultAsync(r => r.Id == id);

            return result;
        }
        
        public async Task<Result?> GetByUserIdAsync(int userId)
        {
            var result = await _context.Results
                .Include(r => r.Exam)
                .ThenInclude(e => e.Subject)
                .ThenInclude(s => s.Image)
                .Select(r => new Result
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    ExamId = r.ExamId,
                    TotalCorrectAnswer = r.TotalCorrectAnswer,
                    Score = r.Score,
                    ExamDate = r.ExamDate,
                    OverallTime = r.OverallTime,
                    Exam = r.Exam,
                    User = new User
                    {
                        Id = r.User.Id,
                        Name = r.User.Name
                    }
                })
                .FirstOrDefaultAsync(r => r.UserId == userId);

            return result;
        }

    }
}
