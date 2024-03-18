package vn.edu.hcmuaf.fit.fit_exam;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ImageView;

import com.facebook.shimmer.ShimmerFrameLayout;

public class SubjectActivity extends AppCompatActivity {
    RecyclerView recyclerSubject;
    ShimmerFrameLayout shimmerSubject;
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

        btnBack.setOnClickListener(view -> {
            Intent intent = new Intent(this, MainActivity.class);
            startActivity(intent);
            finish();
        });

    }
}