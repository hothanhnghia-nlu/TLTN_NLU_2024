using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FITExamAPI.Service
{
    public class FacultyService : FacultyRepository
    {
        private readonly FitExamContext _context;

        public FacultyService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<Faculty> CreateAsync(Faculty faculty)
        {
            await _context.Faculties.AddAsync(faculty);
            await _context.SaveChangesAsync();
            return faculty;
        }

        public async Task<List<Faculty>> GetAllAsync()
        {
            return await _context.Faculties.ToListAsync();
        }

        public async Task<Faculty?> GetByIdAsync(int id)
        {
            return await _context.Faculties.FindAsync(id);
        }

        public async Task<Faculty?> UpdateAsync(int id, Faculty faculty)
        {
            var existingFaculty = await _context.Faculties.FirstOrDefaultAsync(x => x.Id == id);
            if (existingFaculty == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(faculty.Name))
            {
                existingFaculty.Name = faculty.Name;
            }

            await _context.SaveChangesAsync();
            return existingFaculty;
        }

        public async Task<Faculty?> DeleteAsync(int id)
        {
            var faculty = await _context.Faculties.FirstOrDefaultAsync(x => x.Id == id);
            if (faculty == null)
            {
                return null;
            }
            _context.Faculties.Remove(faculty);
            await _context.SaveChangesAsync();
            return faculty;
        }

    }
}
