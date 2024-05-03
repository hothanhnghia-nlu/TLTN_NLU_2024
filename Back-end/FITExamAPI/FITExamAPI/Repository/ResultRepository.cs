using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface ResultRepository
    {
        Task<Result> CreateAsync(Result result);
        Task<List<Result>> GetAllAsync();
        Task<Result?> GetByIdAsync(int id);

    }
}
