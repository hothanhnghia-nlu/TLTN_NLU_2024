package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import android.content.Context;
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
import java.util.List;

import retrofit2.Retrofit;
import vn.edu.hcmuaf.fit.fitexam.adapter.SubjectAdapter;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.model.Subject;

public class SubjectActivity extends AppCompatActivity {
    RecyclerView recyclerSubject;
    ShimmerFrameLayout shimmerSubject;
    SubjectAdapter adapter;
    ImageView btnBack;
    SearchView searchView;
    TextView tvMessage;
    private ArrayList<Subject> subjects;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_subject);

        searchView = findViewById(R.id.searchView);
        tvMessage = findViewById(R.id.message);
        recyclerSubject = findViewById(R.id.recycler_subjects);
        shimmerSubject = findViewById(R.id.shimmer_subjects);
        btnBack = findViewById(R.id.btnBack);

        recyclerSubject.setLayoutManager(new GridLayoutManager(this, 2));
        shimmerSubject.startShimmer();

        searchView.clearFocus();
        View v = searchView.findViewById(androidx.appcompat.R.id.search_plate);
        v.setBackgroundColor(Color.TRANSPARENT);

        // Tìm kiếm Môn học
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

        if (checkInternetPermission()) {
            loadSubjectList();
        } else {
            Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        // Nút Trở lại
        btnBack.setOnClickListener(view -> {
            finish();
        });

    }

    // Lấy Danh sách Môn học
    private void loadSubjectList() {
        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Subject>> subjectList = apiService.getAllSubjects();

        subjectList.enqueue(new Callback<ArrayList<Subject>>() {
            @Override
            public void onResponse(Call<ArrayList<Subject>> call, Response<ArrayList<Subject>> response) {
                if (response.isSuccessful()) {
                    subjects = response.body();

                    if (subjects != null && !subjects.isEmpty()) {
                        shimmerSubject.stopShimmer();
                        shimmerSubject.setVisibility(View.GONE);
                        recyclerSubject.setVisibility(View.VISIBLE);
                        adapter = new SubjectAdapter(getApplicationContext(), subjects);
                        recyclerSubject.setAdapter(adapter);
                    } else {
                        tvMessage.setVisibility(View.VISIBLE);
                    }
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Subject>> call, Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Lọc Danh sách Môn học
    private void filterList(String text) {
        List<Subject> filteredList = new ArrayList<>();
        for (Subject subject : subjects) {
            if (subject.getName().toLowerCase().contains(text.toLowerCase())) {
                filteredList.add(subject);
            }
        }
        if (!filteredList.isEmpty()) {
            adapter.setFilteredList(filteredList);
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