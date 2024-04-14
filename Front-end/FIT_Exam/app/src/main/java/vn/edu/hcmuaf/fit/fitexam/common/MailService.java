package vn.edu.hcmuaf.fit.fitexam.common;

import java.io.UnsupportedEncodingException;
import java.util.Properties;
import java.util.Random;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class MailService {
    public static int sendOtp(String toEmail) {
        int otp = generateOTP();

        String fromName = "FIT Exam NLU";
        String fromEmail = "fitexamnlu@gmail.com";
        String password = "eyeypjafwcjpmmvg";
        String subject = "Đặt lại mật khẩu";
        String body = "<html><body>Xin chào,<br/>Chào mừng bạn quay trở lại FIT Exam. " +
                "Vui lòng nhập mã OTP này để đặt lại mật khẩu. OTP có hiệu lực trong vòng 1 phút: " +
                "<span style='font-size: 18px;'><b>" + otp + "</b></span></body></html>";

        // Mail server properties
        Properties properties = new Properties();
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.from", fromEmail);
        properties.put("mail.smtp.fromname", fromName);

        // Get the Session object
        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail, fromName));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            message.setSubject(subject, "UTF-8");
            message.setContent(body, "text/html; charset=utf-8");

            Thread thread = new Thread(() -> {
                try {
                    Transport.send(message);
                } catch (MessagingException e) {
                    throw new RuntimeException(e);
                }
            });
            thread.start();

            return otp;
        } catch (MessagingException | UnsupportedEncodingException mex) {
            mex.printStackTrace();
            return 0;
        }
    }

    private static int generateOTP() {
        Random random = new Random();
        return random.nextInt(8999) + 1000;
    }
}
