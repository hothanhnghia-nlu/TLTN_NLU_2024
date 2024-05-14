package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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

import vn.edu.hcmuaf.fit.fitexam.adapter.SubjectAdapter;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.model.Subject;

public class SubjectActivity extends AppCompatActivity {
    RecyclerView recyclerSubject;
    ShimmerFrameLayout shimmerSubject;
    SubjectAdapter adapter;
    ImageView btnBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_subject);

        recyclerSubject = findViewById(R.id.recycler_subjects);
        shimmerSubject = findViewById(R.id.shimmer_subjects);
        btnBack = findViewById(R.id.btnBack);

        recyclerSubject.setHasFixedSize(true);
        recyclerSubject.setLayoutManager(new GridLayoutManager(this, 2));
        shimmerSubject.startShimmer();

        if (checkInternetPermission()) {
            loadSubjectList();
        } else {
            Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        btnBack.setOnClickListener(view -> {
            finish();
        });

    }

    private void loadSubjectList() {
        Call<ArrayList<Subject>> subjectList = ApiService.apiService.getAllSubjects();

        subjectList.enqueue(new Callback<ArrayList<Subject>>() {
            @Override
            public void onResponse(Call<ArrayList<Subject>> call, Response<ArrayList<Subject>> response) {
                if (response.isSuccessful()) {
                    ArrayList<Subject> subjects = response.body();

                    shimmerSubject.stopShimmer();
                    shimmerSubject.setVisibility(View.GONE);
                    recyclerSubject.setVisibility(View.VISIBLE);
                    adapter = new SubjectAdapter(getApplicationContext(), subjects);
                    recyclerSubject.setAdapter(adapter);
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Subject>> call, Throwable t) {
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