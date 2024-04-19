using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;
using BCryptNet = BCrypt.Net.BCrypt;

namespace FITExamAPI.Service
{
    public class UserService : UserRepository
    {
        private readonly FitExamContext _context;

        public UserService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<User> CreateAsync(User user)
        {
            user.Password = BCryptNet.HashPassword(user.Password);
            user.Role = 0;
            user.CreatedAt = DateTime.Now;
            user.UpdatedAt = DateTime.Now;
            user.Status = 0;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> UpdateAsync(int id, User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (existingUser == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(user.Password) && user.Password.Count() < 25)
            {
                user.Password = BCryptNet.HashPassword(user.Password);
            }

            existingUser.Name = user.Name ?? existingUser.Name;
            existingUser.Phone = user.Phone ?? existingUser.Phone;
            existingUser.Email = user.Email ?? existingUser.Email;
            existingUser.Dob = user.Dob ?? existingUser.Dob;
            existingUser.Gender = user.Gender ?? existingUser.Gender;
            existingUser.Password = user.Password ?? existingUser.Password;
            existingUser.Role = user.Role ?? existingUser.Role;
            existingUser.UpdatedAt = DateTime.Now;
            existingUser.Status = user.Status ?? existingUser.Status;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task<User?> DeleteAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
            {
                return null;
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
