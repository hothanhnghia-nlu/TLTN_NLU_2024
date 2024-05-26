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
    [Route("api/answers")]
    [ApiController]
    public class AnswersController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly AnswerRepository _answerRepository;

        public AnswersController(FitExamContext context, AnswerRepository answerRepository)
        {
            _context = context;
            _answerRepository = answerRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Answer>>> GetAllAnswers()
        {
            if (_context.Answers == null)
            {
                return NotFound();
            }
            return await _answerRepository.GetAllAsync();
        }

        [HttpGet("question")]
        public async Task<ActionResult<IEnumerable<Answer>>> GetAllAnswersByQuestionId([FromQuery] int id)
        {
            if (_context.Answers == null)
            {
                return NotFound();
            }
            return await _answerRepository.GetAllByQuestionIdAsync(id);
        }

    }
}
