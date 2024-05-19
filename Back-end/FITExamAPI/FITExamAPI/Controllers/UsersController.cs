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
using FITExamAPI.Helpter;
using FITExamAPI.Service;

namespace FITExamAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly UserRepository _userRepository;
        private readonly EmailRepository _emailRepository;

        public UsersController(FitExamContext context, UserRepository userRepository, EmailRepository emailRepository)
        {
            _context = context;
            _userRepository = userRepository;
            _emailRepository = emailRepository;
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

        [HttpPost("send-mail")]
        public async Task<IActionResult> SendMail([FromForm] User user)
        {
            string body = "<html><body>Xin chào,<br/>Chào mừng bạn quay trở lại FIT Exam. " +
        "Vui lòng nhấn vào <a href='https://fit-exam-admin.vercel.app/new-password'>đây</a> để đặt lại mật khẩu.</body></html>";

            try
            {
                MailRequest mailRequest = new MailRequest();
                mailRequest.ToEmail = user.Email;
                mailRequest.Subject = "Đặt lại mật khẩu";
                mailRequest.Body = body;
                await _emailRepository.SendEmailAsync(mailRequest);
                return Ok("Email is sent to you.");
            }
            catch (Exception e)
            {
                throw;
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserById(int id, [FromForm] User user)
        {
            var userModel = await _userRepository.UpdateAsync(id, user);
            if (userModel == null)
            {
                return NotFound();
            }
            return Ok("User " + id + " is updated successfully");
        }
        
        [HttpPut("change-password/{id}")]
        public async Task<IActionResult> ChangePassword(int id, [FromForm] User user)
        {
            var userModel = await _userRepository.ChangePasswordAsync(id, user);
            if (userModel == null)
            {
                return NotFound();
            }
            return Ok("User " + id + " is changed password successfully");
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
