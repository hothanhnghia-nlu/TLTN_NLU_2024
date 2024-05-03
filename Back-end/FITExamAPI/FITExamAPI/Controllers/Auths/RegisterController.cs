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

namespace FITExamAPI.Controllers.Auths
{
    [Route("api/register")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly AuthRepository _authRepository;

        public RegisterController(FitExamContext context, AuthRepository authRepository)
        {
            _context = context;
            _authRepository = authRepository;
        }

        [HttpPost]
        public async Task<ActionResult<User>> Register(User user)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return BadRequest("Email is existed.");
            }
            await _authRepository.CreateUserAsync(user);
            return Ok(user);
        }
    }
}
