package vn.edu.hcmuaf.fit.fitexam;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;

import vn.edu.hcmuaf.fit.fitexam.R;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;

import vn.edu.hcmuaf.fit.fitexam.adapter.TakeExamAdapter;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Image;
import vn.edu.hcmuaf.fit.fitexam.model.Subject;

public class TakeExamFragment extends Fragment {
    RecyclerView recyclerTakeExam;
    ShimmerFrameLayout shimmerTakeExam;
    TakeExamAdapter examAdapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_take_exam, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        recyclerTakeExam = view.findViewById(R.id.recycler_take_exam);
        shimmerTakeExam = view.findViewById(R.id.shimmer_take_exam);

        recyclerTakeExam.setHasFixedSize(true);
        recyclerTakeExam.setLayoutManager(new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false));
        shimmerTakeExam.startShimmer();

        if (checkInternetPermission()) {
            loadTakeExamList();
        } else {
            Toast.makeText(getActivity(), "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }
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
        examAdapter = new TakeExamAdapter(getContext(), exams);
        recyclerTakeExam.setAdapter(examAdapter);
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) getActivity()
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}