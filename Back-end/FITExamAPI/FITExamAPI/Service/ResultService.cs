using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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

        public async Task<Result?> GetByIdAsync(int id)
        {
            return await _context.Results.FindAsync(id);
        }

    }
}
