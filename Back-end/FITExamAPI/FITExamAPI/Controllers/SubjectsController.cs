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
    [Route("api/subjects")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly SubjectRepository _subjectRepository;

        public SubjectsController(FitExamContext context, SubjectRepository subjectRepository)
        {
            _context = context;
            _subjectRepository = subjectRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Subject>> CreateSubject(Subject subject)
        {
            await _subjectRepository.CreateAsync(subject);
            return Ok(subject);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subject>>> GetAllSubjects()
        {
            if (_context.Subjects == null)
            {
                return NotFound();
            }
            return await _subjectRepository.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Subject>> GetSubjectById(string id)
        {
            var subject = await _subjectRepository.GetByIdAsync(id);

            if (subject == null)
            {
                return NotFound();
            }
            return subject;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubject(string id, Subject subject)
        {
            var subjectModel = await _subjectRepository.UpdateAsync(id, subject);
            if (subjectModel == null)
            {
                return NotFound();
            }
            return Ok("Subject " + id + " is updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(string id)
        {
            var subject = await _subjectRepository.DeleteAsync(id);
            if (subject == null)
            {
                return NotFound();
            }
            return Ok("Subject " + id + " is deleted successfully");
        }

    }
}
