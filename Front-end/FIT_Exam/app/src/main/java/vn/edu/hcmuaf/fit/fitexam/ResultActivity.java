package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.hcmuaf.fit.fitexam.adapter.ResultAdapter;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.model.Answer;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Question;
import vn.edu.hcmuaf.fit.fitexam.model.Result;
import vn.edu.hcmuaf.fit.fitexam.model.ResultDetail;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.util.Log;
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

        Intent intent = getIntent();
        int resultId = intent.getIntExtra("resultId", -1);

        recyclerResult.setHasFixedSize(true);
        recyclerResult.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));

        if (checkInternetPermission()) {
            if (resultId != -1) {
                loadResult(resultId);
            }
        } else {
            Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        btnBack.setOnClickListener(view -> {
            finish();
        });
    }

    private void loadResult(int id) {
        Call<ArrayList<ResultDetail>> resultDetail = ApiService.apiService.getResultDetailByResultId(id);

        resultDetail.enqueue(new Callback<ArrayList<ResultDetail>>() {
            @Override
            public void onResponse(Call<ArrayList<ResultDetail>> call, Response<ArrayList<ResultDetail>> response) {
                if (response.isSuccessful()) {
                    ArrayList<ResultDetail> details = response.body();

                    if (details != null) {
                        Result result = details.get(0).getResult();
                        if (result != null) {
                            int totalQuestions = result.getExam().getNumberOfQuestions();
                            int rightAnswer = result.getTotalCorrectAnswer();
                            int wrongAnswer = totalQuestions - rightAnswer;

                            tvTotalQuestions.setText(String.valueOf(totalQuestions));
                            tvRightAnswer.setText(String.valueOf(rightAnswer));
                            tvWrongAnswer.setText(String.valueOf(wrongAnswer));
                        }

                        adapter = new ResultAdapter(ResultActivity.this, details);
                        recyclerResult.setAdapter(adapter);
                    }
                }
            }

            @Override
            public void onFailure(Call<ArrayList<ResultDetail>> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}