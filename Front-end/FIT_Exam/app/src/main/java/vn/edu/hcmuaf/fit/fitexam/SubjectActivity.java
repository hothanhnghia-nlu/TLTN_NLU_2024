package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import vn.edu.hcmuaf.fit.fitexam.R;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;

import vn.edu.hcmuaf.fit.fitexam.adapter.SubjectAdapter;
import vn.edu.hcmuaf.fit.fitexam.model.Image;
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
        Image image = new Image();
        image.setUrl("https://logoart.vn/blog/wp-content/uploads/2013/08/logo-android.png");
        Subject subject = new Subject();
        subject.setId(1);
        subject.setName("Lập trình trên thiết bị di động");
        subject.setImage(image);

        ArrayList<Subject> subjects = new ArrayList<>();
        subjects.add(subject);
        subjects.add(subject);
        subjects.add(subject);
        subjects.add(subject);
        subjects.add(subject);

        shimmerSubject.stopShimmer();
        shimmerSubject.setVisibility(View.GONE);
        recyclerSubject.setVisibility(View.VISIBLE);
        adapter = new SubjectAdapter(this, subjects);
        recyclerSubject.setAdapter(adapter);
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}