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
import java.util.Collections;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import vn.edu.hcmuaf.fit.fitexam.adapter.HistoryAdapter;
import vn.edu.hcmuaf.fit.fitexam.adapter.SubjectHomeAdapter;
import vn.edu.hcmuaf.fit.fitexam.adapter.TakeExamAdapter;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
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
    private ArrayList<Result> results;

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
                loadHistoryList(Integer.parseInt(id));
            }
            loadSubjectList();
            loadTakeExamList();
        } else {
            Toast.makeText(getActivity(), "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        // Nút Xem tất cả Môn học
        btnSee1.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), SubjectActivity.class);
            startActivity(intent);
        });

        // Nút Xem tất cả Bài thi
        btnSee2.setOnClickListener(v -> {
            replaceFragment(new TakeExamFragment());
        });

        // Nút Xem tất cả Lịch sử thi
        btnSee3.setOnClickListener(v -> {
            replaceFragment(new HistoryFragment());
        });
    }

    // Lấy tên người dùng
    private void loadStudentName(int id) {
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<User> userInfo = apiService.getUser(id);

        userInfo.enqueue(new Callback<User>() {
            @Override
            public void onResponse(@NonNull Call<User> call, @NonNull Response<User> response) {
                if (response.isSuccessful()) {
                    User user = response.body();

                    if (user != null) {
                        tvName.setText(user.getName());
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<User> call, @NonNull Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Lấy Danh sách Môn học
    private void loadSubjectList() {
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Subject>> subjectList = apiService.getAllSubjects();

        subjectList.enqueue(new Callback<ArrayList<Subject>>() {
            @Override
            public void onResponse(@NonNull Call<ArrayList<Subject>> call, @NonNull Response<ArrayList<Subject>> response) {
                if (response.isSuccessful()) {
                    ArrayList<Subject> subjects = response.body();

                    if (subjects != null && !subjects.isEmpty()) {
                        int endIndex = Math.min(subjects.size(), 3);
                        List<Subject> sublist = subjects.subList(0, endIndex);

                        shimmerSubject.stopShimmer();
                        shimmerSubject.setVisibility(View.GONE);
                        recyclerSubject.setVisibility(View.VISIBLE);
                        subjectAdapter = new SubjectHomeAdapter(getContext(), sublist);
                        recyclerSubject.setAdapter(subjectAdapter);
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<ArrayList<Subject>> call, @NonNull Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Lấy Danh sách Bài thi
    private void loadTakeExamList() {
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Exam>> subjectList = apiService.getAllExams();

        subjectList.enqueue(new Callback<ArrayList<Exam>>() {
            @Override
            public void onResponse(@NonNull Call<ArrayList<Exam>> call, @NonNull Response<ArrayList<Exam>> response) {
                if (response.isSuccessful()) {
                    ArrayList<Exam> exams = response.body();

                    if (exams != null && !exams.isEmpty()) {
                        Collections.reverse(exams);
                        int endIndex = Math.min(exams.size(), 2);
                        List<Exam> sublist = exams.subList(0, endIndex);

                        shimmerTakeExam.stopShimmer();
                        shimmerTakeExam.setVisibility(View.GONE);
                        recyclerTakeExam.setVisibility(View.VISIBLE);
                        examAdapter = new TakeExamAdapter(getContext(), sublist);
                        recyclerTakeExam.setAdapter(examAdapter);
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<ArrayList<Exam>> call, @NonNull Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Lấy Danh sách Lịch sử thi
    private void loadHistoryList(int id) {
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Result>> resultList = apiService.getAllResultsByUserId(id);

        resultList.enqueue(new Callback<ArrayList<Result>>() {
            @Override
            public void onResponse(@NonNull Call<ArrayList<Result>> call, @NonNull Response<ArrayList<Result>> response) {
                if (response.isSuccessful()) {
                    results = response.body();

                    if (results != null && !results.isEmpty()) {
                        Collections.reverse(results);
                        int endIndex = Math.min(results.size(), 3);
                        List<Result> sublist = results.subList(0, endIndex);

                        shimmerExamHistory.stopShimmer();
                        shimmerExamHistory.setVisibility(View.GONE);
                        recyclerExamHistory.setVisibility(View.VISIBLE);
                        historyAdapter = new HistoryAdapter(getContext(), sublist);
                        recyclerExamHistory.setAdapter(historyAdapter);
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<ArrayList<Result>> call, @NonNull Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
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