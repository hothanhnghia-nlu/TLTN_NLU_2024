using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FITExamAPI.Data;
using FITExamAPI.Models;
using BCryptNet = BCrypt.Net.BCrypt;

namespace FITExamAPI.Controllers.Auths
{
    [Route("api/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly FitExamContext _context;
        public LoginController(FitExamContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<User>> Login(User user)
        {
            User? existingUser = null;

            if (user.Password != null && user.Email != null)
            {
                existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
                if (existingUser == null || !BCryptNet.Verify(user.Password, existingUser.Password))
                {
                    existingUser = null;
                    return BadRequest("Email or Password is wrong.");
                }
            }

            if (existingUser == null)
            {
                return NotFound();
            }
            return existingUser;
        }

    }
}
