using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface UserRepository
    {
        Task<User> CreateAsync(User user);
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> UpdateAsync(int id, User user);
        Task<User?> DeleteAsync(int id);

    }
}
