using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<List<User>?> GetByRoleAsync(sbyte role)
        {
            var user = await _context.Users.Where(u => u.Role == role).ToListAsync();

            if (user == null)
            {
                return null;
            }
            return user;
        }
        
        public async Task<string?> GetIdAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return null;
            }
            return user.Id.ToString();
        }

        public async Task<User?> UpdateAsync(int id, User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (existingUser == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(user.Name))
            {
                existingUser.Name = user.Name;
            }

            if (!string.IsNullOrEmpty(user.Phone))
            {
                existingUser.Phone = user.Phone;
            }

            if (!string.IsNullOrEmpty(user.Email))
            {
                existingUser.Email = user.Email;
            }

            if (user.Dob.HasValue)
            {
                existingUser.Dob = user.Dob;
            }

            if (!string.IsNullOrEmpty(user.Gender))
            {
                existingUser.Gender = user.Gender;
            }

            if (!string.IsNullOrEmpty(user.Password) && user.Password.Length < 25)
            {
                existingUser.Password = BCryptNet.HashPassword(user.Password);
            }

            if (user.Role.HasValue)
            {
                existingUser.Role = user.Role.Value;
            }

            existingUser.UpdatedAt = DateTime.Now;

            if (user.Status.HasValue)
            {
                existingUser.Status = user.Status.Value;
            }

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
