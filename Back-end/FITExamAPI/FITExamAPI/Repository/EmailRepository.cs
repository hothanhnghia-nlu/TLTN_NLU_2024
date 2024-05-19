using FITExamAPI.Helpter;

namespace FITExamAPI.Repository
{
    public interface EmailRepository
    {
        Task SendEmailAsync(MailRequest request);
    }
}
