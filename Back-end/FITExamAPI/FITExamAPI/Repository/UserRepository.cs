using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface UserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<List<User>?> GetByRoleAsync(sbyte role);
        Task<string?> GetIdAsync(string email);
        Task<User?> UpdateAsync(int id, User user);
        Task<User?> DeleteAsync(int id);

    }
}
