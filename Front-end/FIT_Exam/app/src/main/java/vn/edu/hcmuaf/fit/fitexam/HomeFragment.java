package vn.edu.hcmuaf.fit.fitexam;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.hcmuaf.fit.fitexam.adapter.HistoryAdapter;
import vn.edu.hcmuaf.fit.fitexam.adapter.SubjectHomeAdapter;
import vn.edu.hcmuaf.fit.fitexam.adapter.TakeExamAdapter;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Image;
import vn.edu.hcmuaf.fit.fitexam.model.Result;
import vn.edu.hcmuaf.fit.fitexam.model.Subject;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class HomeFragment extends Fragment {
    TextView tvName, btnSee1, btnSee2, btnSee3;
    RecyclerView recyclerSubject, recyclerTakeExam, recyclerExamHistory;
    ShimmerFrameLayout shimmerSubject, shimmerTakeExam, shimmerExamHistory;
    SubjectHomeAdapter subjectAdapter;
    TakeExamAdapter examAdapter;
    HistoryAdapter historyAdapter;
    LoginSession session;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        tvName = view.findViewById(R.id.fullName);
        btnSee1 = view.findViewById(R.id.btnSee1);
        btnSee2 = view.findViewById(R.id.btnSee2);
        btnSee3 = view.findViewById(R.id.btnSee3);

        session = new LoginSession(getContext());
        String id = LoginSession.getIdKey();
        
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
            if (id != null) {
                loadStudentName(Integer.parseInt(id));
            }
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

    private void loadStudentName(int id) {
        Call<User> userInfo = ApiService.apiService.getUser(id);

        userInfo.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    User user = response.body();

                    if (user != null) {
                        tvName.setText(user.getName());
                    }
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
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
                    subjectAdapter = new SubjectHomeAdapter(getContext(), subjects);
                    recyclerSubject.setAdapter(subjectAdapter);
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Subject>> call, Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
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
                    examAdapter = new TakeExamAdapter(getContext(), exams);
                    recyclerTakeExam.setAdapter(examAdapter);
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Exam>> call, Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
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