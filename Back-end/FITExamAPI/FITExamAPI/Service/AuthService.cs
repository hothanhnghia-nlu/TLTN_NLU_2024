using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using BCryptNet = BCrypt.Net.BCrypt;

namespace FITExamAPI.Service
{
    public class AuthService : AuthRepository
    {
        private readonly FitExamContext _context;

        public AuthService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            user.Password = BCryptNet.HashPassword(user.Password);
            user.CreatedAt = DateTime.Now;
            user.Status = 1;

            if (!user.Role.HasValue)
            {
                user.Role = 0;
            }

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
