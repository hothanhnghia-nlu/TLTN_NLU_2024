using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FITExamAPI.Service
{
    public class LogService : LogRepository
    {
        private readonly FitExamContext _context;

        public LogService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<Log> CreateAsync(Log log)
        {
            log.CreatedAt = DateTime.Now;
            await _context.Logs.AddAsync(log);
            await _context.SaveChangesAsync();
            return log;
        }

        public async Task<List<Log>> GetAllAsync()
        {
            return await _context.Logs.ToListAsync();
        }

        public async Task<Log?> GetByIdAsync(int id)
        {
            return await _context.Logs.FindAsync(id);
        }

    }
}
