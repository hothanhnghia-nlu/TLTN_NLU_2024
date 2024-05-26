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

namespace FITExamAPI.Controllers
{
    [Route("api/questions")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly QuestionRepository _questionRepository;

        public QuestionsController(FitExamContext context, QuestionRepository questionRepository)
        {
            _context = context;
            _questionRepository = questionRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Question>> CreateQuestion([FromForm] Question question)
        {
            var existingQuestion = await _context.Questions.FindAsync(question.Id);
            if (existingQuestion != null)
            {
                return Ok("Question is existed!");
            }
            return await _questionRepository.CreateAsync(question);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestions()
        {
            if (_context.Questions == null)
            {
                return NotFound();
            }
            return await _questionRepository.GetAllAsync();
        }
        
        [HttpGet("exam")]
        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestionsByExamId([FromQuery] int id)
        {
            if (_context.Questions == null)
            {
                return NotFound();
            }
            return await _questionRepository.GetAllByExamIdAsync(id);
        }
  
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestionsByUserId([FromQuery] int id)
        {
            if (_context.Questions == null)
            {
                return NotFound();
            }
            return await _questionRepository.GetAllByUserIdAsync(id);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestionById(int id)
        {
            var question = await _questionRepository.GetByIdAsync(id);

            if (question == null)
            {
                return NotFound();
            }
            return question;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromForm] Question question)
        {
            var questionModel = await _questionRepository.UpdateAsync(id, question);
            if (questionModel == null)
            {
                return NotFound();
            }
            return Ok("Question " + id + " is updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _questionRepository.DeleteAsync(id);
            if (question == null)
            {
                return NotFound();
            }
            return Ok("Question " + id + " is deleted successfully");
        }

        [HttpGet("shuffle/exam")]
        public async Task<IActionResult> ShuffleQuestionsByExamId([FromQuery] int id)
        {
            var questions = await _questionRepository.ShuffleByExamId(id);

            return Ok(questions);
        }

        [HttpGet("shuffle/user")]
        public async Task<IActionResult> ShuffleQuestionsByUserId([FromQuery] int id)
        {
            var questions = await _questionRepository.ShuffleByUserId(id);

            return Ok(questions);
        }

    }
}
