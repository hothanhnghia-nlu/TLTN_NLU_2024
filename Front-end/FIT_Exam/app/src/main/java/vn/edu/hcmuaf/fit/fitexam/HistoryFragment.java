package vn.edu.hcmuaf.fit.fitexam;

import android.content.Context;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.SearchView;
import androidx.fragment.app.Fragment;
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
import java.util.List;

import vn.edu.hcmuaf.fit.fitexam.adapter.ExamHistoryAdapter;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.model.Result;

public class HistoryFragment extends Fragment implements SwipeRefreshLayout.OnRefreshListener {
    RecyclerView recyclerExamHistory;
    ShimmerFrameLayout shimmerExamHistory;
    ExamHistoryAdapter historyAdapter;
    TextView tvMessage;
    SwipeRefreshLayout swipeRefreshLayout;
    SearchView searchView;
    private ArrayList<Result> results;
    LoginSession session;

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

        searchView = view.findViewById(R.id.searchView);
        tvMessage = view.findViewById(R.id.message);
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout);
        recyclerExamHistory = view.findViewById(R.id.recycler_exam_history);
        shimmerExamHistory = view.findViewById(R.id.shimmer_exam_history);

        session = new LoginSession(getContext());
        String id = LoginSession.getIdKey();

        recyclerExamHistory.setHasFixedSize(true);
        recyclerExamHistory.setLayoutManager(new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false));
        shimmerExamHistory.startShimmer();

        searchView.clearFocus();
        View v = searchView.findViewById(androidx.appcompat.R.id.search_plate);
        v.setBackgroundColor(Color.TRANSPARENT);

        // Tìm kiếm Lịch sử thi
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                filterList(newText);
                return false;
            }
        });

        if (checkInternetPermission()) {
            if (id != null) {
                swipeRefreshLayout.setOnRefreshListener(() -> loadHistoryList(Integer.parseInt(id)));

                loadHistoryList(Integer.parseInt(id));
            }
        } else {
            Toast.makeText(getActivity(), "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }
    }

    // Lấy danh sách Lịch sử thi
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
            }

            @Override
            public void onFailure(@NonNull Call<ArrayList<Result>> call, @NonNull Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Lọc danh sách cho tìm kiếm
    private void filterList(String text) {
        List<Result> filteredList = new ArrayList<>();
        for (Result result : results) {
            if (result.getExam() != null) {
                if (result.getExam().getName().toLowerCase().contains(text.toLowerCase())) {
                    filteredList.add(result);
                }
            }
        }
        if (!filteredList.isEmpty()) {
            historyAdapter.setFilteredList(filteredList);
            tvMessage.setVisibility(View.GONE);
        } else {
            tvMessage.setVisibility(View.VISIBLE);
        }
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