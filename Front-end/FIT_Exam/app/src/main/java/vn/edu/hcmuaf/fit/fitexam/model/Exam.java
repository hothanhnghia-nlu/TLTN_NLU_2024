package vn.edu.hcmuaf.fit.fitexam.model;

import java.io.Serializable;
import java.util.List;

public class Exam implements Serializable {
    private int id;
    private String name;
    private int subjectId;
    private int creatorId;
    private int examTime;
    private int numberOfQuestions;
    private int minimumDifficulty;
    private int maximumDifficulty;
    private Subject subject;
    private User user;
    private List<Result> results;

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

    public int getExamTime() {
        return examTime;
    }

    public void setExamTime(int examTime) {
        this.examTime = examTime;
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

}
