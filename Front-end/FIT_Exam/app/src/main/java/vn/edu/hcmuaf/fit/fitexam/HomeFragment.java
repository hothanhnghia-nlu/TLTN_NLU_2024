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
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;
import java.util.Collections;

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
import vn.edu.hcmuaf.fit.fitexam.model.Image;
import vn.edu.hcmuaf.fit.fitexam.model.Result;
import vn.edu.hcmuaf.fit.fitexam.model.Subject;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class HomeFragment extends Fragment implements SwipeRefreshLayout.OnRefreshListener {
    TextView tvName, btnSee1, btnSee2, btnSee3;
    RecyclerView recyclerSubject, recyclerTakeExam, recyclerExamHistory;
    ShimmerFrameLayout shimmerSubject, shimmerTakeExam, shimmerExamHistory;
    SubjectHomeAdapter subjectAdapter;
    TakeExamAdapter examAdapter;
    HistoryAdapter historyAdapter;
    SwipeRefreshLayout swipeRefreshLayout;
    LoginSession session;
    private ArrayList<Result> results;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout);
        swipeRefreshLayout.setOnRefreshListener(this);
        swipeRefreshLayout.setColorSchemeColors(getResources().getColor(R.color.green_nlu));

        return view;
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
                swipeRefreshLayout.setOnRefreshListener(() -> loadHistoryList(Integer.parseInt(id)));

                loadStudentName(Integer.parseInt(id));
                loadHistoryList(Integer.parseInt(id));
            }
            loadSubjectList();
            loadTakeExamList();
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
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<User> userInfo = apiService.getUser(id);

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
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Subject>> subjectList = apiService.getAllSubjects();

        subjectList.enqueue(new Callback<ArrayList<Subject>>() {
            @Override
            public void onResponse(Call<ArrayList<Subject>> call, Response<ArrayList<Subject>> response) {
                if (response.isSuccessful()) {
                    ArrayList<Subject> subjects = response.body();

                    if (subjects != null && !subjects.isEmpty()) {
                        shimmerSubject.stopShimmer();
                        shimmerSubject.setVisibility(View.GONE);
                        recyclerSubject.setVisibility(View.VISIBLE);
                        subjectAdapter = new SubjectHomeAdapter(getContext(), subjects);
                        recyclerSubject.setAdapter(subjectAdapter);
                    }
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Subject>> call, Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private void loadTakeExamList() {
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Exam>> subjectList = apiService.getAllExams();

        subjectList.enqueue(new Callback<ArrayList<Exam>>() {
            @Override
            public void onResponse(Call<ArrayList<Exam>> call, Response<ArrayList<Exam>> response) {
                if (response.isSuccessful()) {
                    ArrayList<Exam> exams = response.body();

                    if (exams != null && !exams.isEmpty()) {
                        shimmerTakeExam.stopShimmer();
                        shimmerTakeExam.setVisibility(View.GONE);
                        recyclerTakeExam.setVisibility(View.VISIBLE);
                        examAdapter = new TakeExamAdapter(getContext(), exams);
                        recyclerTakeExam.setAdapter(examAdapter);
                    }
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Exam>> call, Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private void loadHistoryList(int id) {
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Result>> resultList = apiService.getAllResultsByUserId(id);

        resultList.enqueue(new Callback<ArrayList<Result>>() {
            @Override
            public void onResponse(Call<ArrayList<Result>> call, Response<ArrayList<Result>> response) {
                if (response.isSuccessful()) {
                    results = response.body();

                    if (results != null && !results.isEmpty()) {
                        Collections.reverse(results);

                        shimmerExamHistory.stopShimmer();
                        shimmerExamHistory.setVisibility(View.GONE);
                        recyclerExamHistory.setVisibility(View.VISIBLE);
                        historyAdapter = new HistoryAdapter(getContext(), results);
                        recyclerExamHistory.setAdapter(historyAdapter);
                    }

                    onRefresh();
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Result>> call, Throwable t) {
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

    @Override
    public void onRefresh() {
        if (results != null && historyAdapter != null) {
            historyAdapter.setData(results);
            Handler handler = new Handler();
            handler.postDelayed(() -> swipeRefreshLayout.setRefreshing(false), 1000);
        } else {
            swipeRefreshLayout.setRefreshing(false);
        }
    }
}