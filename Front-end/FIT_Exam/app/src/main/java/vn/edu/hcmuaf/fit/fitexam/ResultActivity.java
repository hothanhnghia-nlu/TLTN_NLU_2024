package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import vn.edu.hcmuaf.fit.fitexam.R;
import vn.edu.hcmuaf.fit.fitexam.adapter.ResultAdapter;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Result;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

public class ResultActivity extends AppCompatActivity {
    TextView tvRightAnswer, tvWrongAnswer, tvSkippedAnswer;
    ImageView btnBack;
    RecyclerView recyclerResult;
    ResultAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_result);

        tvRightAnswer = findViewById(R.id.rightAnswer);
        tvWrongAnswer = findViewById(R.id.wrongAnswer);
        tvSkippedAnswer = findViewById(R.id.skippedAnswer);
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
        Result result = new Result();
        result.setExam(exam);

        ArrayList<Result> results = new ArrayList<>();
        results.add(result);
        results.add(result);
        results.add(result);
        results.add(result);
        adapter = new ResultAdapter(this, results);
        recyclerResult.setAdapter(adapter);
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}