using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FITExamAPI.Service
{
    public class ImageService : ImageRepository
    {
        private readonly FitExamContext _context;

        public ImageService(FitExamContext context)
        {
            _context = context;
        }

        public async Task<Image> CreateAsync(Image image)
        {
            await _context.Images.AddAsync(image);
            await _context.SaveChangesAsync();
            return image;
        }

        public async Task<List<Image>> GetAllAsync()
        {
            return await _context.Images.ToListAsync();
        }

        public async Task<Image?> GetByIdAsync(int id)
        {
            return await _context.Images.FindAsync(id);
        }

        public async Task<Image?> UpdateAsync(int id, Image image)
        {
            var existingImage = await _context.Images.FirstOrDefaultAsync(x => x.Id == id);
            if (existingImage == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(image.Name))
            {
                existingImage.Name = image.Name;
            }
            
            if (!string.IsNullOrEmpty(image.Url))
            {
                existingImage.Url = image.Url;
            }

            await _context.SaveChangesAsync();
            return existingImage;
        }

        public async Task<Image?> DeleteAsync(int id)
        {
            var image = await _context.Images.FirstOrDefaultAsync(x => x.Id == id);
            if (image == null)
            {
                return null;
            }
            _context.Images.Remove(image);
            await _context.SaveChangesAsync();
            return image;
        }

    }
}
