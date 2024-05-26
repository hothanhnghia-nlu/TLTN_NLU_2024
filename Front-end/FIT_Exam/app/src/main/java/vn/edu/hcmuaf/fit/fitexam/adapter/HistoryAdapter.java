package vn.edu.hcmuaf.fit.fitexam.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import vn.edu.hcmuaf.fit.fitexam.R;
import vn.edu.hcmuaf.fit.fitexam.ResultActivity;
import vn.edu.hcmuaf.fit.fitexam.model.Result;

public class HistoryAdapter extends RecyclerView.Adapter<HistoryAdapter.HistoryViewHolder> {
    private final List<Result> historyList;
    static Context context;

    public HistoryAdapter(Context context, List<Result> historyList) {
        this.context = context;
        this.historyList = historyList;
    }

    @NonNull
    @Override
    public HistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.history_home_item, parent, false);
        return new HistoryViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull HistoryViewHolder holder, int position) {
        Result result = historyList.get(position);
        if (result == null) {
            return;
        }
        holder.bindData(result);

        holder.cvHistory.setOnClickListener(view -> {
            int resultId = result.getId();
            Intent intent = new Intent(context, ResultActivity.class);
            intent.putExtra("resultId", resultId);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return historyList != null ? historyList.size() : 0;
    }

    public static class HistoryViewHolder extends RecyclerView.ViewHolder {
        TextView tvExamName, tvTotalCorrectAnswers, tvExamDate;
        ImageView subjectImage;
        CardView cvHistory;

        public HistoryViewHolder(@NonNull View itemView) {
            super(itemView);

            tvExamName = itemView.findViewById(R.id.examName);
            tvTotalCorrectAnswers = itemView.findViewById(R.id.totalCorrectAnswers);
            tvExamDate = itemView.findViewById(R.id.examDate);
            subjectImage = itemView.findViewById(R.id.subjectImage);
            cvHistory = itemView.findViewById(R.id.cvHistory);
        }

        @SuppressLint("SetTextI18n")
        public void bindData(Result result) {
            tvExamName.setText(result.getExam().getName());
            tvTotalCorrectAnswers.setText(result.getTotalCorrectAnswer()
                    + "/" + result.getExam().getNumberOfQuestions());
            tvExamDate.setText(convertDateType(result.getExamDate()));

            if (result.getExam().getSubject().getImage() != null) {
                String imageUrl = result.getExam().getSubject().getImage().getUrl();
                Glide.with(context).load(imageUrl).into(subjectImage);
            }
        }

        @SuppressLint("SimpleDateFormat")
        private String convertDateType(String inputDate) {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            SimpleDateFormat outputFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            try {
                Date date = inputFormat.parse(inputDate);
                assert date != null;
                return outputFormat.format(date);
            } catch (ParseException e) {
                e.printStackTrace();
                return null;
            }
        }
    }
}
