package vn.edu.hcmuaf.fit.fit_exam.model;

import java.io.Serializable;
import java.util.List;

public class Exam implements Serializable {
    private int id;
    private String name;
    private int subjectId;
    private int creatorId;
    private String startTime;
    private String endTime;
    private int numberOfQuestions;
    private int minimumDifficulty;
    private int maximumDifficulty;
    private Subject subject;
    private User user;
    private List<Result> results;
    private List<ExamQuestion> examQuestions;

    public Exam() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(int subjectId) {
        this.subjectId = subjectId;
    }

    public int getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(int creatorId) {
        this.creatorId = creatorId;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public int getNumberOfQuestions() {
        return numberOfQuestions;
    }

    public void setNumberOfQuestions(int numberOfQuestions) {
        this.numberOfQuestions = numberOfQuestions;
    }

    public int getMinimumDifficulty() {
        return minimumDifficulty;
    }

    public void setMinimumDifficulty(int minimumDifficulty) {
        this.minimumDifficulty = minimumDifficulty;
    }

    public int getMaximumDifficulty() {
        return maximumDifficulty;
    }

    public void setMaximumDifficulty(int maximumDifficulty) {
        this.maximumDifficulty = maximumDifficulty;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }

    public List<ExamQuestion> getExamQuestions() {
        return examQuestions;
    }

    public void setExamQuestions(List<ExamQuestion> examQuestions) {
        this.examQuestions = examQuestions;
    }
}
