using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface ResultRepository
    {
        Task<Result> CreateAsync(Result result);
        Task<List<Result>> GetAllAsync();
        Task<List<Result>> GetAllByUserIdAsync(int userId);
        Task<Result?> GetByIdAsync(int id);
        Task<Result?> GetByUserIdAsync(int userId);

    }
}
