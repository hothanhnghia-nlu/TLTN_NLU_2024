using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;

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
            var logs = await _context.Logs
                .Select(l => new Log
                {
                    Id = l.Id,
                    UserId = l.UserId,
                    Level = l.Level,
                    Source = l.Source,
                    Ip = l.Ip,
                    Content = l.Content,
                    Status = l.Status,
                    CreatedAt = l.CreatedAt,
                    User = new User
                    {
                        Id = l.User.Id,
                        Name = l.User.Name
                    }
                })
                .ToListAsync();

            return logs;
        }

        public async Task<Log?> GetByIdAsync(int id)
        {
            var log = await _context.Logs
                .Where(l => l.Id == id)
                .Select(l => new Log
                {
                    Id = l.Id,
                    UserId = l.UserId,
                    Level = l.Level,
                    Source = l.Source,
                    Ip = l.Ip,
                    Content = l.Content,
                    Status = l.Status,
                    CreatedAt = l.CreatedAt,
                    User = new User
                    {
                        Id = l.User.Id,
                        Name = l.User.Name
                    }
                })
                .FirstOrDefaultAsync();

            return log;
        }

    }
}
