using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface ImageRepository
    {
        Task<Image> CreateAsync(Image image);
        Task<List<Image>> GetAllAsync();
        Task<Image?> GetByIdAsync(int id);
        Task<Image?> UpdateAsync(int id, Image image);
        Task<Image?> DeleteAsync(int id);

    }
}
