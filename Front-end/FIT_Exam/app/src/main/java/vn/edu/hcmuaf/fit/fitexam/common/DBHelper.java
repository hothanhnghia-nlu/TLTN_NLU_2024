package vn.edu.hcmuaf.fit.fitexam.common;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.os.Build;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import vn.edu.hcmuaf.fit.fitexam.model.Answer;
import vn.edu.hcmuaf.fit.fitexam.model.Question;
import vn.edu.hcmuaf.fit.fitexam.model.utils.UserAnswer;

public class DBHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "quiz.db";
    private static final int DATABASE_VERSION = 1;

    // Table for user answers
    private static final String USER_ANSWERS_TABLE = "user_answers";
    private static final String COLUMN_ID = "id";
    private static final String COLUMN_QUESTION_ID = "question_id";
    private static final String COLUMN_ANSWER_ID = "answer_id";
    private static final String COLUMN_IS_CORRECT = "is_correct";

    // Table for questions
    private static final String QUESTIONS_TABLE = "questions";
    private static final String COLUMN_QUESTION_CONTENT = "content";

    // Table for answers
    private static final String ANSWERS_TABLE = "answers";
    private static final String COLUMN_ANSWER_CONTENT = "content";
    private static final String COLUMN_IS_CORRECT_ANSWER = "is_correct";

    public DBHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String CREATE_USER_ANSWERS_TABLE = "CREATE TABLE " + USER_ANSWERS_TABLE + "("
                + COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
                + COLUMN_QUESTION_ID + " INTEGER,"
                + COLUMN_ANSWER_ID + " INTEGER,"
                + COLUMN_IS_CORRECT + " INTEGER)";
        db.execSQL(CREATE_USER_ANSWERS_TABLE);

        String CREATE_QUESTIONS_TABLE = "CREATE TABLE " + QUESTIONS_TABLE + "("
                + COLUMN_ID + " INTEGER PRIMARY KEY,"
                + COLUMN_QUESTION_CONTENT + " TEXT)";
        db.execSQL(CREATE_QUESTIONS_TABLE);

        String CREATE_ANSWERS_TABLE = "CREATE TABLE " + ANSWERS_TABLE + "("
                + COLUMN_ID + " INTEGER PRIMARY KEY,"
                + COLUMN_QUESTION_ID + " INTEGER,"
                + COLUMN_ANSWER_CONTENT + " TEXT,"
                + COLUMN_IS_CORRECT_ANSWER + " INTEGER)";
        db.execSQL(CREATE_ANSWERS_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + USER_ANSWERS_TABLE);
        db.execSQL("DROP TABLE IF EXISTS " + QUESTIONS_TABLE);
        db.execSQL("DROP TABLE IF EXISTS " + ANSWERS_TABLE);
        onCreate(db);
    }

    public void saveUserAnswer(int questionId, int answerId, boolean isCorrect) {
        SQLiteDatabase db = this.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put(COLUMN_QUESTION_ID, questionId);
        values.put(COLUMN_ANSWER_ID, answerId);
        values.put(COLUMN_IS_CORRECT, isCorrect ? 1 : 0);

        db.replace(USER_ANSWERS_TABLE, null, values);
        db.close();
    }

    @SuppressLint("Range")
    public int getUserAnswer(int questionId) {
        SQLiteDatabase db = this.getReadableDatabase();

        String query = "SELECT " + COLUMN_ANSWER_ID + " FROM " + USER_ANSWERS_TABLE +
                " WHERE " + COLUMN_QUESTION_ID + " = " + questionId +
                " ORDER BY " + COLUMN_ID + " DESC LIMIT 1";

        Cursor cursor = db.rawQuery(query, null);

        if (cursor != null && cursor.moveToFirst()) {
            int answerId = cursor.getInt(cursor.getColumnIndex(COLUMN_ANSWER_ID));
            cursor.close();
            return answerId;
        }
        return -1;
    }

    @SuppressLint("Range")
    public int[] getUserAnswers(int questionId) {
        SQLiteDatabase db = this.getReadableDatabase();
        List<Integer> answerIds = new ArrayList<>();

        String query = "SELECT " + COLUMN_ANSWER_ID + " FROM " + USER_ANSWERS_TABLE +
                " WHERE " + COLUMN_QUESTION_ID + " = ?";
        Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(questionId)});

        if (cursor.moveToFirst()) {
            do {
                answerIds.add(cursor.getInt(cursor.getColumnIndex(COLUMN_ANSWER_ID)));
            } while (cursor.moveToNext());
        }

        cursor.close();
        db.close();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            return answerIds.stream().mapToInt(i -> i).toArray();
        }
        return null;
    }

    // Methods to save and retrieve questions and answers
    public void saveQuestion(Question question) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues questionValues = new ContentValues();
        questionValues.put(COLUMN_ID, question.getId());
        questionValues.put(COLUMN_QUESTION_CONTENT, question.getContent());

        db.replace(QUESTIONS_TABLE, null, questionValues);

        for (Answer answer : question.getOptions()) {
            ContentValues answerValues = new ContentValues();
            answerValues.put(COLUMN_ID, answer.getId());
            answerValues.put(COLUMN_QUESTION_ID, question.getId());
            answerValues.put(COLUMN_ANSWER_CONTENT, answer.getContent());
            answerValues.put(COLUMN_IS_CORRECT_ANSWER, answer.isCorrect() ? 1 : 0);

            db.replace(ANSWERS_TABLE, null, answerValues);
        }
        db.close();
    }

    @SuppressLint("Range")
    public List<UserAnswer> getLatestUserAnswers() {
        List<UserAnswer> latestUserAnswers = new ArrayList<>();
        Map<Integer, List<UserAnswer>> latestUserAnswersMap = new HashMap<>();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT ua.*, q.content AS questionContent, a.content AS answerContent " +
                "FROM user_answers ua " +
                "JOIN questions q ON ua.question_id = q.id " +
                "JOIN answers a ON ua.answer_id = a.id " +
                "ORDER BY ua.id DESC", null);

        if (cursor != null && cursor.moveToFirst()) {
            do {
                int id = cursor.getInt(cursor.getColumnIndex(COLUMN_ID));
                int questionId = cursor.getInt(cursor.getColumnIndex(COLUMN_QUESTION_ID));
                int answerId = cursor.getInt(cursor.getColumnIndex(COLUMN_ANSWER_ID));
                boolean isCorrect = cursor.getInt(cursor.getColumnIndex(COLUMN_IS_CORRECT)) == 1;

                UserAnswer userAnswer = new UserAnswer(id, questionId, answerId, isCorrect);
                if (!latestUserAnswersMap.containsKey(questionId)) {
                    latestUserAnswersMap.put(questionId, new ArrayList<>());
                }
                latestUserAnswersMap.get(questionId).add(userAnswer);
            } while (cursor.moveToNext());
            cursor.close();
        }
        db.close();

        for (List<UserAnswer> answers : latestUserAnswersMap.values()) {
            latestUserAnswers.addAll(answers);
        }

        return latestUserAnswers;
    }

    @SuppressLint("Range")
    public int countCorrectAnswers() {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT q.id, COUNT(a.id) as correctCount, " +
                "(SELECT COUNT(*) FROM answers WHERE question_id = q.id AND is_correct = 1) as totalCorrect " +
                "FROM questions q " +
                "LEFT JOIN user_answers ua ON q.id = ua.question_id AND ua.is_correct = 1 " +
                "LEFT JOIN answers a ON ua.answer_id = a.id AND a.is_correct = 1 " +
                "GROUP BY q.id", null);

        int correctQuestions = 0;
        if (cursor != null && cursor.moveToFirst()) {
            do {
                int correctCount = cursor.getInt(cursor.getColumnIndex("correctCount"));
                int totalCorrect = cursor.getInt(cursor.getColumnIndex("totalCorrect"));

                if (correctCount == totalCorrect && totalCorrect != 0) {
                    correctQuestions++;
                }
            } while (cursor.moveToNext());
            cursor.close();
        }
        db.close();
        return correctQuestions;
    }

    public void deleteUserAnswer(int questionId) {
        SQLiteDatabase db = this.getWritableDatabase();
        db.delete(USER_ANSWERS_TABLE, COLUMN_QUESTION_ID + " = ?", new String[]{String.valueOf(questionId)});
        db.close();
    }

    public void deleteAllSelection() {
        SQLiteDatabase db = this.getWritableDatabase();
        db.delete(USER_ANSWERS_TABLE, null, null);
        db.close();
    }
}