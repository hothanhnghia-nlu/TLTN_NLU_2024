package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import vn.edu.hcmuaf.fit.fitexam.R;
import android.annotation.SuppressLint;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;

import vn.edu.hcmuaf.fit.fitexam.adapter.TakeExamAdapter;
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
        Image image = new Image();
        image.setUrl("https://logoart.vn/blog/wp-content/uploads/2013/08/logo-android.png");
        Subject subject = new Subject();
        subject.setName("Lập trình trên thiết bị di động");
        subject.setImage(image);
        Exam exam = new Exam();
        exam.setName("Bài kiểm tra chương 1");
        exam.setTime(1);
        exam.setNumberOfQuestions(30);
        exam.setSubject(subject);
        exam.getSubject().setImage(image);

        ArrayList<Exam> exams = new ArrayList<>();
        exams.add(exam);
        exams.add(exam);
        exams.add(exam);
        exams.add(exam);
        exams.add(exam);

        shimmerTakeExam.stopShimmer();
        shimmerTakeExam.setVisibility(View.GONE);
        recyclerTakeExam.setVisibility(View.VISIBLE);
        examAdapter = new TakeExamAdapter(this, exams);
        recyclerTakeExam.setAdapter(examAdapter);
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}