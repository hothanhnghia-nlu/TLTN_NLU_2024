using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FITExamAPI.Service
{
    public class ResultDetailService : ResultDetailRepository
    {
        private readonly FitExamContext _context;

        public ResultDetailService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<ResultDetail> CreateAsync([FromForm] ResultDetail resultDetail)
        {
            var result = await _context.Results.FindAsync(resultDetail.ResultId);
            if (result == null)
            {
                return null;
            }

            resultDetail.ResultId = result.Id;

            await _context.ResultDetails.AddAsync(resultDetail);
            await _context.SaveChangesAsync();
            return resultDetail;
        }

        public async Task<List<ResultDetail>> GetAllAsync()
        {
            var details = await _context.ResultDetails
                .Include(d => d.Result)
                .ThenInclude(r => r.Exam)
                .ThenInclude(e => e.Questions)
                .Select(d => new ResultDetail
                {
                    Id = d.Id,
                    ResultId = d.ResultId,
                    QuestionId = d.QuestionId,
                    AnswerId = d.AnswerId,
                    IsCorrect = d.IsCorrect,
                    Result = d.Result,
                    Question = new Question
                    {
                        Id = d.Question.Id,
                        Content = d.Question.Content,
                        Images = d.Question.Images,
                        Options = d.Question.Options
                    },
                    Answer = new Answer
                    {
                        Id = d.Answer.Id,
                        QuestionId = d.Answer.QuestionId,
                        Content = d.Answer.Content,
                        IsCorrect = d.Answer.IsCorrect
                    }
                })
                .ToListAsync();

            return details;
        }

        public async Task<List<ResultDetail>> GetAllByResultIdAsync(int resultId)
        {
            var details = await _context.ResultDetails
                .Include(d => d.Result)
                .ThenInclude(r => r.Exam)
                .ThenInclude(e => e.Questions)
                .Select(d => new ResultDetail
                {
                    Id = d.Id,
                    ResultId = d.ResultId,
                    QuestionId = d.QuestionId,
                    AnswerId = d.AnswerId,
                    IsCorrect = d.IsCorrect,
                    Result = d.Result,
                    Question = new Question
                    {
                        Id = d.Question.Id,
                        Content = d.Question.Content,
                        Images = d.Question.Images,
                        Options = d.Question.Options
                    },
                    Answer = new Answer
                    {
                        Id = d.Answer.Id,
                        QuestionId = d.Answer.QuestionId,
                        Content = d.Answer.Content,
                        IsCorrect = d.Answer.IsCorrect
                    }
                })
                .Where(r => r.ResultId == resultId)
                .ToListAsync();

            return details;
        }

        public async Task<ResultDetail?> GetByIdAsync(int id)
        {
            var detail = await _context.ResultDetails
                .Include(d => d.Result)
                .ThenInclude(r => r.Exam)
                .ThenInclude(e => e.Questions)
                .Select(d => new ResultDetail
                {
                    Id = d.Id,
                    ResultId = d.ResultId,
                    QuestionId = d.QuestionId,
                    AnswerId = d.AnswerId,
                    IsCorrect = d.IsCorrect,
                    Result = d.Result,
                    Question = new Question
                    {
                        Id = d.Question.Id,
                        Content = d.Question.Content,
                        Images = d.Question.Images,
                        Options = d.Question.Options
                    },
                    Answer = new Answer
                    {
                        Id = d.Answer.Id,
                        QuestionId = d.Answer.QuestionId,
                        Content = d.Answer.Content,
                        IsCorrect = d.Answer.IsCorrect
                    }
                })
                .FirstOrDefaultAsync(r => r.Id == id);

            return detail;
        }
        
    }
}
