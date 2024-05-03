using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FITExamAPI.Service
{
    public class SubjectService : SubjectRepository
    {
        private readonly FitExamContext _context;

        public SubjectService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<Subject> CreateAsync(Subject subject)
        {
            await _context.Subjects.AddAsync(subject);
            await _context.SaveChangesAsync();
            return subject;
        }

        public async Task<List<Subject>> GetAllAsync()
        {
            return await _context.Subjects.ToListAsync();
        }

        public async Task<Subject?> GetByIdAsync(string id)
        {
            return await _context.Subjects.FindAsync(id);
        }

        public async Task<Subject?> UpdateAsync(string id, Subject subject)
        {
            var existingSubject = await _context.Subjects.FirstOrDefaultAsync(x => x.Id == id);
            if (existingSubject == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(subject.Name))
            {
                existingSubject.Name = subject.Name;
            }

            if (subject.Credit.HasValue)
            {
                existingSubject.Credit = subject.Credit;
            }

            await _context.SaveChangesAsync();
            return existingSubject;
        }

        public async Task<Subject?> DeleteAsync(string id)
        {
            var subject = await _context.Subjects.FirstOrDefaultAsync(x => x.Id == id);
            if (subject == null)
            {
                return null;
            }
            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();
            return subject;
        }

    }
}
