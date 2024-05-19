using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface QuestionRepository
    {
        Task<Question> CreateAsync(Question question);
        Task<List<Question>> GetAllAsync();
        Task<Question?> GetByIdAsync(string id);
        Task<Question?> UpdateAsync(string id, Question question);
        Task<Question?> DeleteAsync(string id);

    }
}
