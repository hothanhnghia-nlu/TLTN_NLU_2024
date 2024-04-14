package vn.edu.hcmuaf.fit.fitexam;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;

import vn.edu.hcmuaf.fit.fitexam.R;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;

import vn.edu.hcmuaf.fit.fitexam.adapter.HistoryAdapter;
import vn.edu.hcmuaf.fit.fitexam.adapter.SubjectHomeAdapter;
import vn.edu.hcmuaf.fit.fitexam.adapter.TakeExamAdapter;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Image;
import vn.edu.hcmuaf.fit.fitexam.model.Result;
import vn.edu.hcmuaf.fit.fitexam.model.Subject;

public class HomeFragment extends Fragment {
    TextView btnSee1, btnSee2, btnSee3;
    RecyclerView recyclerSubject, recyclerTakeExam, recyclerExamHistory;
    ShimmerFrameLayout shimmerSubject, shimmerTakeExam, shimmerExamHistory;
    SubjectHomeAdapter subjectAdapter;
    TakeExamAdapter examAdapter;
    HistoryAdapter historyAdapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        btnSee1 = view.findViewById(R.id.btnSee1);
        btnSee2 = view.findViewById(R.id.btnSee2);
        btnSee3 = view.findViewById(R.id.btnSee3);
        
        recyclerSubject = view.findViewById(R.id.recycler_subjects);
        recyclerTakeExam = view.findViewById(R.id.recycler_take_exam);
        recyclerExamHistory = view.findViewById(R.id.recycler_exam_history);

        shimmerSubject = view.findViewById(R.id.shimmer_subjects);
        shimmerTakeExam = view.findViewById(R.id.shimmer_take_exam);
        shimmerExamHistory = view.findViewById(R.id.shimmer_exam_history);

        recyclerSubject.setHasFixedSize(true);
        recyclerSubject.setLayoutManager(new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false));
        shimmerSubject.startShimmer();

        recyclerTakeExam.setHasFixedSize(true);
        recyclerTakeExam.setLayoutManager(new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false));
        shimmerTakeExam.startShimmer();

        recyclerExamHistory.setHasFixedSize(true);
        recyclerExamHistory.setLayoutManager(new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false));
        shimmerExamHistory.startShimmer();

        if (checkInternetPermission()) {
            loadSubjectList();
            loadTakeExamList();
            loadHistoryList();
        } else {
            Toast.makeText(getActivity(), "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        btnSee1.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), SubjectActivity.class);
            startActivity(intent);
        });

        btnSee2.setOnClickListener(v -> {
            replaceFragment(new TakeExamFragment());
        });

        btnSee3.setOnClickListener(v -> {
            replaceFragment(new HistoryFragment());
        });
    }

    private void loadSubjectList() {
        Image image = new Image();
        image.setUrl("https://logoart.vn/blog/wp-content/uploads/2013/08/logo-android.png");
        Subject subject = new Subject();
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
        subjectAdapter = new SubjectHomeAdapter(getContext(), subjects);
        recyclerSubject.setAdapter(subjectAdapter);
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

    private void loadHistoryList() {
        Image image = new Image();
        image.setUrl("https://logoart.vn/blog/wp-content/uploads/2013/08/logo-android.png");
        Subject subject = new Subject();
        subject.setName("Lập trình trên thiết bị di động");
        subject.setImage(image);
        Exam exam = new Exam();
        exam.setName("Bài kiểm tra chương 1");
        exam.setNumberOfQuestions(30);
        exam.setSubject(subject);
        exam.getSubject().setImage(image);
        Result result = new Result();
        result.setExam(exam);
        result.setTotalCorrectAnswer(28);

        ArrayList<Result> results = new ArrayList<>();
        results.add(result);
        results.add(result);
        results.add(result);
        results.add(result);

        shimmerExamHistory.stopShimmer();
        shimmerExamHistory.setVisibility(View.GONE);
        recyclerExamHistory.setVisibility(View.VISIBLE);
        historyAdapter = new HistoryAdapter(getContext(), results);
        recyclerExamHistory.setAdapter(historyAdapter);
    }

    // Replace a fragment
    private void replaceFragment(Fragment fragment) {
        FragmentManager manager = getParentFragmentManager();
        FragmentTransaction transaction = manager.beginTransaction();
        transaction.replace(R.id.frame_layout, fragment);
        transaction.commit();
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) getActivity()
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}