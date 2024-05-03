using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface LogRepository
    {
        Task<Log> CreateAsync(Log log);
        Task<List<Log>> GetAllAsync();
        Task<Log?> GetByIdAsync(int id);

    }
}
