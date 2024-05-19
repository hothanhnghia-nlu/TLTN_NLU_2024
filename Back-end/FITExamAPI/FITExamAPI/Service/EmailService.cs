using FITExamAPI.Helpter;
using FITExamAPI.Repository;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace FITExamAPI.Service
{
    public class EmailService : EmailRepository
    {
        private readonly EmailSettings emailSettings;

        public EmailService(IOptions<EmailSettings> options)
        {
            this.emailSettings = options.Value;
        }
        public async Task SendEmailAsync(MailRequest mailRequest)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(emailSettings.DisplayName, emailSettings.Email));
            email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
            email.Subject = mailRequest.Subject;
            var builder = new BodyBuilder();
            builder.HtmlBody = mailRequest.Body;
            email.Body = builder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                client.Connect(emailSettings.Host, emailSettings.Port, SecureSocketOptions.StartTls);

                client.Authenticate(emailSettings.Email, emailSettings.Password);

                await client.SendAsync(email);
                client.Disconnect(true);
            }
        }
    }
}
