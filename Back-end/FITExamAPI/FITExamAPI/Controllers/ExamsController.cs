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
    [Route("api/exams")]
    [ApiController]
    public class ExamsController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly ExamRepository _examRepository;

        public ExamsController(FitExamContext context, ExamRepository examRepository)
        {
            _context = context;
            _examRepository = examRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Exam>> CreateExam(Exam exam)
        {
            await _examRepository.CreateAsync(exam);
            return Ok(exam);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exam>>> GetAllExams()
        {
            if (_context.Exams == null)
            {
                return NotFound();
            }
            return await _examRepository.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Exam>> GetExamById(int id)
        {
            var exam = await _examRepository.GetByIdAsync(id);

            if (exam == null)
            {
                return NotFound();
            }
            return exam;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExam(int id, Exam exam)
        {
            var examModel = await _examRepository.UpdateAsync(id, exam);
            if (examModel == null)
            {
                return NotFound();
            }
            return Ok("Exam " + id + " is updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _examRepository.DeleteAsync(id);
            if (exam == null)
            {
                return NotFound();
            }
            return Ok("Exam " + id + " is deleted successfully");
        }

    }
}
