using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface ImageRepository
    {
        Task<List<Image>> GetAllAsync();
        Task<Image?> GetByIdAsync(int id);

    }
}
