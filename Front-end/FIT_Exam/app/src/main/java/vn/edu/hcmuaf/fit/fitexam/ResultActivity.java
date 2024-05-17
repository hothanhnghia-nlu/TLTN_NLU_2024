package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import vn.edu.hcmuaf.fit.fitexam.adapter.ResultAdapter;
import vn.edu.hcmuaf.fit.fitexam.model.Answer;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Question;
import vn.edu.hcmuaf.fit.fitexam.model.Result;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

public class ResultActivity extends AppCompatActivity {
    TextView tvRightAnswer, tvWrongAnswer, tvTotalQuestions;
    ImageView btnBack;
    RecyclerView recyclerResult;
    ResultAdapter adapter;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_result);

        tvRightAnswer = findViewById(R.id.rightAnswer);
        tvWrongAnswer = findViewById(R.id.wrongAnswer);
        tvTotalQuestions = findViewById(R.id.totalQuestion);
        btnBack = findViewById(R.id.btnBack);
        recyclerResult = findViewById(R.id.recycler_result);

        recyclerResult.setHasFixedSize(true);
        recyclerResult.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));

        if (checkInternetPermission()) {
            loadResult();
        } else {
            Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        btnBack.setOnClickListener(view -> {
            finish();
        });
    }

    private void loadResult() {
        Exam exam = new Exam();
        exam.setName("Bài kiểm tra Chương 1");
        exam.setNumberOfQuestions(30);
        Result result = new Result();
        result.setExam(exam);
        result.setTotalCorrectAnswer(24);

        Question question = new Question();
        question.setContent("Câu 1: Lập trình Android là gì?");
        Answer a1 = new Answer();
        a1.setContent("Hướng đối tượng");
        a1.setQuestion(question);

        ArrayList<Answer> answers = new ArrayList<>();
        answers.add(a1);
        answers.add(a1);
        answers.add(a1);
        answers.add(a1);

        int totalQuestions = exam.getNumberOfQuestions();
        int rightAnswer = result.getTotalCorrectAnswer();
        int wrongAnswer = totalQuestions - rightAnswer;

        tvTotalQuestions.setText(String.valueOf(totalQuestions));
        tvRightAnswer.setText(String.valueOf(rightAnswer));
        tvWrongAnswer.setText(String.valueOf(wrongAnswer));

        adapter = new ResultAdapter(this, answers);
        recyclerResult.setAdapter(adapter);
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}