using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace FITExamAPI.Controllers.Auths
{
    [Route("api/register")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly AuthRepository _authRepository;
        private readonly Cloudinary _cloudinary;

        public RegisterController(FitExamContext context, AuthRepository authRepository, Cloudinary cloudinary)
        {
            _context = context;
            _authRepository = authRepository;
            _cloudinary = cloudinary;
        }

        [HttpPost]
        public async Task<ActionResult<User>> Register([FromForm] User user)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return BadRequest("Email is existed.");
            }

            if (user.Avatar != null && user.Avatar.Length > 0)
            {
                using (var stream = user.Avatar.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(user.Avatar.FileName, stream)
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        user.Image = new Image { Url = uploadResult.SecureUrl.ToString() };
                    }
                    else
                    {
                        return BadRequest("Image upload failed.");
                    }
                }
            }

            await _authRepository.CreateUserAsync(user);

            return Ok(user);
        }
    }
}
