using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using System.Net;

namespace FITExamAPI.Service
{
    public class UserService : UserRepository
    {
        private readonly FitExamContext _context;
        private readonly Cloudinary _cloudinary;

        public UserService(FitExamContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.Include(u => u.Faculty)
                .Include(u => u.Image).ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            var user = await _context.Users.Include(u => u.Faculty).Include(u => u.Image)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return null;
            }
            return user;
        }

        public async Task<List<User>?> GetByRoleAsync(sbyte role)
        {
            var user = await _context.Users.Include(u => u.Faculty).Include(u => u.Image)
                .Where(u => u.Role == role).ToListAsync();

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
        
        public async Task<sbyte?> GetStatusAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return null;
            }
            return user.Status;
        }

        public async Task<User?> UpdateAsync(int id, [FromForm] User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
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

            if (user.FacultyId.HasValue)
            {
                existingUser.FacultyId = user.FacultyId;
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

            if (user.Avatar != null && user.Avatar.Length > 0)
            {
                var existingImage = await _context.Images.FirstOrDefaultAsync(i => i.UserId == id);
                if (existingImage != null)
                {
                    _context.Images.Remove(existingImage);
                }

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(user.Avatar.FileName, user.Avatar.OpenReadStream()),
                    PublicId = $"users/{id}_{Path.GetFileNameWithoutExtension(user.Avatar.FileName)}"
                };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == HttpStatusCode.OK)
                {
                    existingUser.Image = new Image
                    {
                        UserId = id,
                        Name = existingUser.Name,
                        Url = uploadResult.SecureUrl.ToString()
                    };
                }
                else
                {
                    throw new Exception("Image upload failed");
                }
            }

            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task<User?> ChangePasswordAsync(int id, [FromForm] User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (existingUser == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(user.Password) && user.Password.Length < 25)
            {
                existingUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }

            existingUser.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task<User?> DeleteAsync(int id)
        {
            var user = await _context.Users
                                     .Include(u => u.Image)
                                     .Include(u => u.Logs)
                                     .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return null;
            }

            if (user.Image != null)
            {
                _context.Images.Remove(user.Image);
            }

            if (user.Logs != null)
            {
                foreach (var log in user.Logs)
                {
                    _context.Logs.Remove(log);
                }
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return user;
        }

    }
}
