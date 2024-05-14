package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.hcmuaf.fit.fitexam.adapter.TakeExamAdapter;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Image;
import vn.edu.hcmuaf.fit.fitexam.model.Subject;

public class TakeExamActivity extends AppCompatActivity {
    RecyclerView recyclerTakeExam;
    ShimmerFrameLayout shimmerTakeExam;
    TakeExamAdapter examAdapter;
    ImageView btnBack;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_take_exam);

        recyclerTakeExam = findViewById(R.id.recycler_take_exam);
        shimmerTakeExam = findViewById(R.id.shimmer_take_exam);
        btnBack = findViewById(R.id.btnBack);

        recyclerTakeExam.setHasFixedSize(true);
        recyclerTakeExam.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
        shimmerTakeExam.startShimmer();

        if (checkInternetPermission()) {
            loadTakeExamList();
        } else {
            Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        btnBack.setOnClickListener(view -> {
            finish();
        });

    }

    private void loadTakeExamList() {
        Call<ArrayList<Exam>> subjectList = ApiService.apiService.getAllExams();

        subjectList.enqueue(new Callback<ArrayList<Exam>>() {
            @Override
            public void onResponse(Call<ArrayList<Exam>> call, Response<ArrayList<Exam>> response) {
                if (response.isSuccessful()) {
                    ArrayList<Exam> exams = response.body();

                    shimmerTakeExam.stopShimmer();
                    shimmerTakeExam.setVisibility(View.GONE);
                    recyclerTakeExam.setVisibility(View.VISIBLE);
                    examAdapter = new TakeExamAdapter(getApplicationContext(), exams);
                    recyclerTakeExam.setAdapter(examAdapter);
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Exam>> call, Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
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