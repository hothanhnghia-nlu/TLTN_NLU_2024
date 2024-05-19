using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
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

        public async Task<Result> CreateAsync(Result result)
        {
            await _context.Results.AddAsync(result);
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<List<Result>> GetAllAsync()
        {
            return await _context.Results.ToListAsync();
        }

        public async Task<List<Result>> GetAllByUserIdAsync(int userId)
        {
            return await _context.Results.Where(r => r.UserId == userId)
                .ToListAsync();
        }

        public async Task<Result?> GetByIdAsync(int id)
        {
            return await _context.Results.FindAsync(id);
        }
        
        public async Task<Result?> GetByUserIdAsync(int userId)
        {
            return await _context.Results.FirstOrDefaultAsync(r => r.UserId == userId);
        }

    }
}
