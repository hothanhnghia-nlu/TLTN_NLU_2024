using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface AnswerRepository
    {
        Task<List<Answer>> GetAllAsync();
        Task<List<Answer>> GetAllByQuestionIdAsync(int questionId);

    }
}
