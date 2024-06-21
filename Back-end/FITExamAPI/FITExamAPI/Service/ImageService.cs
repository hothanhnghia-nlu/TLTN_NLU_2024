using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FITExamAPI.Service
{
    public class ImageService : ImageRepository
    {
        private readonly FitExamContext _context;

        public ImageService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<List<Image>> GetAllAsync()
        {
            return await _context.Images.ToListAsync();
        }

        public async Task<Image?> GetByIdAsync(int id)
        {
            return await _context.Images.FindAsync(id);
        }

    }
}
