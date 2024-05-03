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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
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
        
        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<User>>> GetUserByRole([FromQuery] sbyte role)
        {
            var users = await _userRepository.GetByRoleAsync(role);

            if (users == null)
            {
                return NotFound();
            }
            return users;
        }

        [HttpGet("id")]
        public async Task<ActionResult<string?>> GetUserId([FromQuery] string email)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            return await _userRepository.GetIdAsync(email);
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
            return Ok("User " + id + " is deleted successfully");
        }

    }
}
