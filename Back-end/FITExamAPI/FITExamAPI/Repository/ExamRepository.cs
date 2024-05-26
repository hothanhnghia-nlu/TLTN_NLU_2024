using FITExamAPI.Models;

namespace FITExamAPI.Repository
{
    public interface ExamRepository
    {
        Task<Exam> CreateAsync(Exam exam);
        Task<List<Exam>> GetAllAsync();
        Task<List<Exam>> GetAllBySubjectIdAsync(string subjectId);
        Task<List<Exam>> GetAllByCreatorIdAsync(int creatorId);
        Task<Exam?> GetByIdAsync(int id);
        Task<Exam?> UpdateAsync(int id, Exam exam);
        Task<Exam?> DeleteAsync(int id);

    }
}
