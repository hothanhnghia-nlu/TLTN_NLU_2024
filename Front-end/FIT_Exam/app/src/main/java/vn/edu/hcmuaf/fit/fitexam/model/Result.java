package vn.edu.hcmuaf.fit.fitexam.model;

import java.io.Serializable;

public class Result implements Serializable {
    private int id;
    private int userId;
    private int examId;
    private int totalCorrectAnswer;
    private double score;
    private String examDate;
    private int overallTime;
    private User user;
    private Exam exam;

    public Result() {
    }

    public Result(int userId, int examId, int totalCorrectAnswer, double score, String examDate, int overallTime) {
        this.userId = userId;
        this.examId = examId;
        this.totalCorrectAnswer = totalCorrectAnswer;
        this.score = score;
        this.examDate = examDate;
        this.overallTime = overallTime;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getExamId() {
        return examId;
    }

    public void setExamId(int examId) {
        this.examId = examId;
    }

    public int getTotalCorrectAnswer() {
        return totalCorrectAnswer;
    }

    public void setTotalCorrectAnswer(int totalCorrectAnswer) {
        this.totalCorrectAnswer = totalCorrectAnswer;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getExamDate() {
        return examDate;
    }

    public void setExamDate(String examDate) {
        this.examDate = examDate;
    }

    public int getOverallTime() {
        return overallTime;
    }

    public void setOverallTime(int overallTime) {
        this.overallTime = overallTime;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }
}
