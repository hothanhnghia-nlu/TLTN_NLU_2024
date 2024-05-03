using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface AuthRepository
    {
        Task<User> CreateUserAsync(User user);
    }
}
