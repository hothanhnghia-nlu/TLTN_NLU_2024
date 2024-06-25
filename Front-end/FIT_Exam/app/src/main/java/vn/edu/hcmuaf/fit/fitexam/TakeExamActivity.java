package vn.edu.hcmuaf.fit.fitexam;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import vn.edu.hcmuaf.fit.fitexam.adapter.TakeExamAdapter;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;

public class TakeExamActivity extends AppCompatActivity {
    RecyclerView recyclerTakeExam;
    ShimmerFrameLayout shimmerTakeExam;
    TakeExamAdapter examAdapter;
    ImageView btnBack;
    SearchView searchView;
    TextView tvMessage;
    private ArrayList<Exam> exams;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_take_exam);

        searchView = findViewById(R.id.searchView);
        tvMessage = findViewById(R.id.message);
        recyclerTakeExam = findViewById(R.id.recycler_take_exam);
        shimmerTakeExam = findViewById(R.id.shimmer_take_exam);
        btnBack = findViewById(R.id.btnBack);

        recyclerTakeExam.setHasFixedSize(true);
        recyclerTakeExam.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
        shimmerTakeExam.startShimmer();

        searchView.clearFocus();
        View v = searchView.findViewById(androidx.appcompat.R.id.search_plate);
        v.setBackgroundColor(Color.TRANSPARENT);

        // Tìm kiếm Bài thi
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                filterList(newText);
                return false;
            }
        });

        Intent intent = getIntent();
        String subjectId = intent.getStringExtra("subjectId");

        if (checkInternetPermission()) {
            if (subjectId != null) {
                loadTakeExamList(subjectId);
            }
        } else {
            Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        // Nút Trở lại
        btnBack.setOnClickListener(view -> {
            finish();
        });

    }

    // Lấy Danh sách Bài thi
    private void loadTakeExamList(String subjectId) {
        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Exam>> subjectList = apiService.getAllExamsBySubjectId(subjectId);

        subjectList.enqueue(new Callback<ArrayList<Exam>>() {
            @Override
            public void onResponse(@NonNull Call<ArrayList<Exam>> call, @NonNull Response<ArrayList<Exam>> response) {
                if (response.isSuccessful()) {
                    exams = response.body();

                    if (exams != null && !exams.isEmpty()) {
                        Collections.reverse(exams);

                        shimmerTakeExam.stopShimmer();
                        shimmerTakeExam.setVisibility(View.GONE);
                        recyclerTakeExam.setVisibility(View.VISIBLE);
                        examAdapter = new TakeExamAdapter(TakeExamActivity.this, exams);
                        recyclerTakeExam.setAdapter(examAdapter);
                    } else {
                        tvMessage.setVisibility(View.VISIBLE);
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<ArrayList<Exam>> call, @NonNull Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Lọc Danh sách Bài thi
    private void filterList(String text) {
        List<Exam> filteredList = new ArrayList<>();
        for (Exam exam : exams) {
            if (exam.getName().toLowerCase().contains(text.toLowerCase())) {
                filteredList.add(exam);
            }
        }
        if (!filteredList.isEmpty()) {
            examAdapter.setFilteredList(filteredList);
            tvMessage.setVisibility(View.GONE);
        } else {
            tvMessage.setVisibility(View.VISIBLE);
        }
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}