using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace FITExamAPI.Service
{
    public class SubjectService : SubjectRepository
    {
        private readonly FitExamContext _context;
        private readonly Cloudinary _cloudinary;

        public SubjectService(FitExamContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        public async Task<Subject> CreateAsync([FromForm] Subject subject)
        {
            if (subject.ImageFile != null && subject.ImageFile.Length > 0)
            {
                var uploadResult = new ImageUploadResult();

                using (var stream = subject.ImageFile.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(subject.ImageFile.FileName, stream),
                        PublicId = subject.Id.ToLower() + "_" + Path.GetFileNameWithoutExtension(subject.ImageFile.FileName)
                    };

                    uploadResult = await _cloudinary.UploadAsync(uploadParams);
                }

                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                var imageUrl = uploadResult.SecureUrl.ToString();
                subject.Image = new Image
                {
                    Name = subject.Name,
                    Url = imageUrl,
                    SubjectId = subject.Id
                };
            }

            await _context.Subjects.AddAsync(subject);
            await _context.SaveChangesAsync();

            return subject;
        }

        public async Task<List<Subject>> GetAllAsync()
        {
            return await _context.Subjects.Include(s => s.Image).ToListAsync();
        }

        public async Task<Subject?> GetByIdAsync(string id)
        {
            var subject = await _context.Subjects.Include(s => s.Image)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (subject == null)
            {
                return null;
            }
            return subject;
        }

        public async Task<Subject?> UpdateAsync(string id, [FromForm] Subject subject)
        {
            var existingSubject = await _context.Subjects.Include(s => s.Image).FirstOrDefaultAsync(s => s.Id == id);
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

            if (subject.ImageFile != null && subject.ImageFile.Length > 0)
            {
                var existingImage = await _context.Images.FirstOrDefaultAsync(i => i.SubjectId == id);
                if (existingImage != null)
                {
                    _context.Images.Remove(existingImage);
                }

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(subject.ImageFile.FileName, subject.ImageFile.OpenReadStream()),
                    PublicId = $"subjects/{id}_{Path.GetFileNameWithoutExtension(subject.ImageFile.FileName)}"
                };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == HttpStatusCode.OK)
                {
                    existingSubject.Image = new Image
                    {
                        SubjectId = id,
                        Name = existingSubject.Name,
                        Url = uploadResult.SecureUrl.ToString()
                    };
                }
                else
                {
                    throw new Exception("Image upload failed");
                }
            }

            await _context.SaveChangesAsync();
            return existingSubject;
        }

        public async Task<Subject?> DeleteAsync(string id)
        {
            var subject = await _context.Subjects.Include(s => s.Image).FirstOrDefaultAsync(s => s.Id == id);
            if (subject == null)
            {
                return null;
            }

            if (subject.Image != null)
            {
                _context.Images.Remove(subject.Image);
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();

            return subject;
        }

    }
}
