using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FITExamAPI.Data;
using FITExamAPI.Models;
using BCrypt.Net;

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
        public async Task<ActionResult<User>> Login([FromForm] User user)
        {
            if (user.Email == null || user.Password == null)
            {
                return BadRequest("Email and password are required.");
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
            {
                return BadRequest("Email or password is wrong.");
            }

            return existingUser;
        }

    }
}
