using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using FITExamAPI.Data;
using FITExamAPI.Models;
using FITExamAPI.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace FITExamAPI.Service
{
    public class QuestionService : QuestionRepository
    {
        private readonly FitExamContext _context;
        private readonly Cloudinary _cloudinary;

        public QuestionService(FitExamContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        public async Task<Question> CreateAsync([FromForm] Question question)
        {
            if (question.ImageFile != null && question.ImageFile.Length > 0)
            {
                var uploadResult = new ImageUploadResult();

                using (var stream = question.ImageFile.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(question.ImageFile.FileName, stream),
                        PublicId = $"questions/{question.Id}_{Path.GetFileNameWithoutExtension(question.ImageFile.FileName)}"
                    };

                    uploadResult = await _cloudinary.UploadAsync(uploadParams);
                }

                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                var imageUrl = uploadResult.SecureUrl.ToString();
                question.Images.Add(new Image
                {
                    Name = question.Content,
                    Url = imageUrl,
                    QuestionId = question.Id
                });
            }

            if (question.Options != null && question.Options.Any())
            {
                foreach (var answer in question.Options)
                {
                    answer.QuestionId = question.Id;
                }
            }

            var exam = await _context.Exams.FirstOrDefaultAsync(e => e.Name == question.ExamName);

            if (exam != null)
            {
                question.ExamId = exam.Id;
            }

            await _context.Questions.AddAsync(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<List<Question>> GetAllAsync()
        {
            var questions = await _context.Questions
                .Include(q => q.Images)
                .Include(q => q.Exam)
                .ThenInclude(e => e.Subject)
                .Include(q => q.Options)
                .Select(q => new Question
                {
                    Id = q.Id,
                    Content = q.Content,
                    ExamId = q.ExamId,
                    DifficultyLevel = q.DifficultyLevel,
                    ExamName = q.ExamName,
                    Options = q.Options.Select(a => new Answer
                    {
                        Id = a.Id,
                        Content = a.Content,
                        IsCorrect = a.IsCorrect,
                        QuestionId = a.QuestionId
                    }).ToList(),
                    Exam = new Exam
                    {
                        Id = q.Exam.Id,
                        Name = q.Exam.Name,
                        SubjectId = q.Exam.SubjectId,
                        CreatorId = q.Exam.CreatorId,
                        Subject = new Subject
                        {
                            Id = q.Exam.Subject.Id,
                            Name = q.Exam.Subject.Name,
                        }
                    }
                })
                .ToListAsync();

            foreach (var question in questions)
            {
                if (question.Exam != null)
                {
                    question.ExamName = question.Exam.Name;
                }
            }

            return questions;
        }
        
        public async Task<List<Question>> GetAllByExamIdAsync(int examId)
        {
            var questions = await _context.Questions
                .Include(q => q.Images)
                .Include(q => q.Exam)
                .ThenInclude(e => e.Subject)
                .Include(q => q.Options)
                .Where(q => q.ExamId == examId)
                .OrderBy(q => q.ShuffleOrder)
                .ToListAsync();

            foreach (var question in questions)
            {
                if (question.Exam != null)
                {
                    question.ExamName = question.Exam.Name;
                }
            }

            return questions;
        }

        public async Task<List<Question>> GetAllByUserIdAsync(int userId)
        {
            var questions = await _context.Questions
                .Include(q => q.Images)
                .Include(q => q.Exam)
                .ThenInclude(e => e.Subject)
                .Include(q => q.Options)
                .Where(q => q.Exam.CreatorId == userId)
                .OrderBy(q => q.ShuffleOrder)
                .ToListAsync();

            foreach (var question in questions)
            {
                if (question.Exam != null)
                {
                    question.ExamName = question.Exam.Name;
                }
            }

            return questions;
        }

        public async Task<Question?> GetByIdAsync(int id)
        {
            var question = await _context.Questions
                .Include(q => q.Images)
                .Include(q => q.Exam)
                .ThenInclude(e => e.Subject)
                .Include(q => q.Options)
                .Select(q => new Question
                {
                    Id = q.Id,
                    Content = q.Content,
                    ExamId = q.ExamId,
                    DifficultyLevel = q.DifficultyLevel,
                    ExamName = q.ExamName,
                    Options = q.Options.Select(a => new Answer
                    {
                        Id = a.Id,
                        Content = a.Content,
                        IsCorrect = a.IsCorrect,
                        QuestionId = a.QuestionId
                    }).ToList(),
                    Exam = new Exam
                    {
                        Id = q.Exam.Id,
                        Name = q.Exam.Name,
                        SubjectId = q.Exam.SubjectId,
                        CreatorId = q.Exam.CreatorId,
                        Subject = new Subject
                        {
                            Id = q.Exam.Subject.Id,
                            Name = q.Exam.Subject.Name,
                        }
                    }
                })
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null)
            {
                return null;
            }
            if (question.Exam != null)
            {
                question.ExamName = question.Exam.Name;
            }
            return question;
        }

        public async Task<Question?> UpdateAsync(int id, Question question)
        {
            var existingQuestion = await _context.Questions
                .Include(q => q.Images)
                .Include(q => q.Options)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (existingQuestion == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(question.Content))
            {
                existingQuestion.Content = question.Content;
            }

            if (!string.IsNullOrEmpty(question.DifficultyLevel))
            {
                existingQuestion.DifficultyLevel = question.DifficultyLevel;
            }

            if (question.ImageFile != null && question.ImageFile.Length > 0)
            {
                var existingImage = existingQuestion.Images.FirstOrDefault();
                if (existingImage != null)
                {
                    _context.Images.Remove(existingImage);
                }

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(question.ImageFile.FileName, question.ImageFile.OpenReadStream()),
                    PublicId = $"questions/{id}_{Path.GetFileNameWithoutExtension(question.ImageFile.FileName)}"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == HttpStatusCode.OK)
                {
                    var newImage = new Image
                    {
                        Name = question.Content,
                        Url = uploadResult.SecureUrl.ToString(),
                        QuestionId = question.Id
                    };
                    existingQuestion.Images.Add(newImage);
                }
                else
                {
                    throw new Exception("Image upload failed");
                }
            }

            if (existingQuestion.Options != null && existingQuestion.Options.Any())
            {
                existingQuestion.Options.Clear();
                foreach (var option in question.Options)
                {
                    existingQuestion.Options.Add(new Answer
                    {
                        Content = option.Content,
                        IsCorrect = option.IsCorrect,
                        QuestionId = existingQuestion.Id
                    });
                }
            }

            var exam = await _context.Exams.FirstOrDefaultAsync(e => e.Name == question.ExamName);
            if (exam != null)
            {
                existingQuestion.ExamId = exam.Id;
            }

            await _context.SaveChangesAsync();
            return existingQuestion;
        }

        public async Task<Question?> DeleteAsync(int id)
        {
            var question = await _context.Questions
                                         .Include(q => q.Images)
                                         .Include(q => q.Options)
                                         .FirstOrDefaultAsync(x => x.Id == id);
            if (question == null)
            {
                return null;
            }

            if (question.Images != null)
            {
                foreach (var image in question.Images)
                {
                    _context.Images.Remove(image);
                }
            }

            if (question.Options != null)
            {
                foreach (var option in question.Options)
                {
                    _context.Answers.Remove(option);
                }
            }

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<List<Question>?> ShuffleByExamId(int examId)
        {
            var questions = await _context.Questions
                .Include(q => q.Images)
                .Include(q => q.Exam)
                .ThenInclude(e => e.Subject)
                .Include(q => q.Options)
                .Where(q => q.ExamId == examId)
                .ToListAsync();

            var shuffledQuestions = questions.OrderBy(q => Guid.NewGuid()).ToList();

            for (int i = 0; i < shuffledQuestions.Count; i++)
            {
                shuffledQuestions[i].ShuffleOrder = i;
            }

            await _context.SaveChangesAsync();

            return shuffledQuestions;
        }
        
        public async Task<List<Question>?> ShuffleByUserId(int userId)
        {
            var questions = await _context.Questions
                .Include(q => q.Images)
                .Include(q => q.Exam)
                .ThenInclude(e => e.Subject)
                .Include(q => q.Options)
                .Where(q => q.Exam.CreatorId == userId)
                .ToListAsync();

            var shuffledQuestions = questions.OrderBy(q => Guid.NewGuid()).ToList();

            for (int i = 0; i < shuffledQuestions.Count; i++)
            {
                shuffledQuestions[i].ShuffleOrder = i;
            }

            await _context.SaveChangesAsync();

            return shuffledQuestions;
        }

    }
}
