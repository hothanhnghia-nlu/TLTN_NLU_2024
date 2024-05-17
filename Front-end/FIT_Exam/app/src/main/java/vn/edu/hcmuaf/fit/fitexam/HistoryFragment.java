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
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.shimmer.ShimmerFrameLayout;

import java.util.ArrayList;
import java.util.Collections;

import vn.edu.hcmuaf.fit.fitexam.adapter.ExamHistoryAdapter;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Image;
import vn.edu.hcmuaf.fit.fitexam.model.Result;
import vn.edu.hcmuaf.fit.fitexam.model.Subject;

public class HistoryFragment extends Fragment implements SwipeRefreshLayout.OnRefreshListener {
    RecyclerView recyclerExamHistory;
    ShimmerFrameLayout shimmerExamHistory;
    ExamHistoryAdapter historyAdapter;
    TextView tvMessage;
    SwipeRefreshLayout swipeRefreshLayout;
    private ArrayList<Result> results;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_history, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout);
        swipeRefreshLayout.setOnRefreshListener(this);
        swipeRefreshLayout.setColorSchemeColors(getResources().getColor(R.color.green_nlu));

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        tvMessage = view.findViewById(R.id.message);
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout);
        recyclerExamHistory = view.findViewById(R.id.recycler_exam_history);
        shimmerExamHistory = view.findViewById(R.id.shimmer_exam_history);

        recyclerExamHistory.setHasFixedSize(true);
        recyclerExamHistory.setLayoutManager(new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false));
        shimmerExamHistory.startShimmer();

        if (checkInternetPermission()) {
            swipeRefreshLayout.setOnRefreshListener(() -> loadHistoryList());

            loadHistoryList();
        } else {
            Toast.makeText(getActivity(), "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

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
        Result r1 = new Result();
        r1.setExam(exam);
        r1.setTotalCorrectAnswer(28);
        r1.setScore(9.3);
        Result r2 = new Result();
        r2.setExam(exam);
        r2.setTotalCorrectAnswer(14);
        r2.setScore(4.7);

        results = new ArrayList<>();
        results.add(r1);
        results.add(r2);

        Collections.reverse(results);

        if (results != null && !results.isEmpty()) {
            shimmerExamHistory.stopShimmer();
            shimmerExamHistory.setVisibility(View.GONE);
            recyclerExamHistory.setVisibility(View.VISIBLE);
            historyAdapter = new ExamHistoryAdapter(getContext(), results);
            recyclerExamHistory.setAdapter(historyAdapter);
        } else {
            tvMessage.setVisibility(View.VISIBLE);
        }

        onRefresh();
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
        historyAdapter.setData(results);
        Handler handler = new Handler();
        handler.postDelayed(() -> swipeRefreshLayout.setRefreshing(false), 1000);
    }
}