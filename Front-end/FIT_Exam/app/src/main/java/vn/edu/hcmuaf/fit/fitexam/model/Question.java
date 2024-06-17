package vn.edu.hcmuaf.fit.fitexam.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Question implements Serializable {
    private int id;
    private String content;
    private int examId;
    private String difficultyLevel;
    private boolean isMultipleChoice;
    private Exam exam;
    private List<Image> images;
    private List<Answer> options;

    public Question() {
    }

    public Question(int id, String content) {
        this.id = id;
        this.content = content;
        this.options = new ArrayList<>();
    }

    public void addOption(Answer option) {
        options.add(option);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getExamId() {
        return examId;
    }

    public void setExamId(int examId) {
        this.examId = examId;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public boolean isMultipleChoice() {
        return isMultipleChoice;
    }

    public void setMultipleChoice(boolean multipleChoice) {
        isMultipleChoice = multipleChoice;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<Answer> getOptions() {
        return options;
    }

    public void setOptions(List<Answer> options) {
        this.options = options;
    }

}
