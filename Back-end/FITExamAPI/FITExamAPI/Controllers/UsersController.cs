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
using System.Collections;

namespace FITExamAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly UserRepository _userRepository;

        public UsersController(FitExamContext context, UserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            if (_context.Users.Where(n => n.Email == user.Email || n.Phone == user.Phone).Count() != 0)
            {
                return Problem("Account already exists");
            }

            await _userRepository.CreateAsync(user);

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _userRepository.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserById(int id, User user)
        {
            var userModel = await _userRepository.UpdateAsync(id, user);
            if (userModel == null)
            {
                return NotFound();
            }
            return Ok("User " + id + " is updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserById(int id)
        {
            var user = await _userRepository.DeleteAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok("User is deleted successfully");
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
