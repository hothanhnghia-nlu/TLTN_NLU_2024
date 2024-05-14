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
    [Route("api/faculties")]
    [ApiController]
    public class FacultiesController : ControllerBase
    {
        private readonly FitExamContext _context;
        private readonly FacultyRepository _facultyRepository;

        public FacultiesController(FitExamContext context, FacultyRepository facultyRepository)
        {
            _context = context;
            _facultyRepository = facultyRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Faculty>> CreateFaculty(Faculty faculty)
        {
            if (_context.Faculties == null)
            {
                return NotFound();
            }
            await _facultyRepository.CreateAsync(faculty);
            return Ok(faculty);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Faculty>>> GetAllFaculties()
        {
            if (_context.Faculties == null)
            {
                return NotFound();
            }
            return await _facultyRepository.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Faculty>> GetFacultyById(int id)
        {
            var faculty = await _facultyRepository.GetByIdAsync(id);

            if (faculty == null)
            {
                return NotFound();
            }
            return faculty;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFaculty(int id, Faculty faculty)
        {
            var facultyModel = await _facultyRepository.UpdateAsync(id, faculty);
            if (facultyModel == null)
            {
                return NotFound();
            }
            return Ok("Faculty " + id + " is updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFaculty(int id)
        {
            var faculty = await _facultyRepository.DeleteAsync(id);
            if (faculty == null)
            {
                return NotFound();
            }
            return Ok("Faculty " + id + " is deleted successfully");
        }

    }
}
