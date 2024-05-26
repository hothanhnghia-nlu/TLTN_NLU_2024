using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface QuestionRepository
    {
        Task<Question> CreateAsync(Question question);
        Task<List<Question>> GetAllAsync();
        Task<List<Question>> GetAllByExamIdAsync(int examId);
        Task<List<Question>> GetAllByUserIdAsync(int userId);
        Task<Question?> GetByIdAsync(int id);
        Task<Question?> UpdateAsync(int id, Question question);
        Task<Question?> DeleteAsync(int id);
        Task<List<Question>?> ShuffleByExamId(int examId);
        Task<List<Question>?> ShuffleByUserId(int userId);

    }
}
