using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface FacultyRepository
    {
        Task<Faculty> CreateAsync(Faculty faculty);
        Task<List<Faculty>> GetAllAsync();
        Task<Faculty?> GetByIdAsync(int id);
        Task<Faculty?> UpdateAsync(int id, Faculty faculty);
        Task<Faculty?> DeleteAsync(int id);

    }
}
