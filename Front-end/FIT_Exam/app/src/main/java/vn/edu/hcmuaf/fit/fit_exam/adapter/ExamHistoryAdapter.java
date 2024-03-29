package vn.edu.hcmuaf.fit.fit_exam.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

import vn.edu.hcmuaf.fit.fit_exam.R;
import vn.edu.hcmuaf.fit.fit_exam.model.Result;

public class ExamHistoryAdapter extends RecyclerView.Adapter<ExamHistoryAdapter.HistoryViewHolder> {
    private final List<Result> historyList;
    static Context context;

    public ExamHistoryAdapter(Context context, List<Result> historyList) {
        this.context = context;
        this.historyList = historyList;
    }

    @NonNull
    @Override
    public HistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.history_item, parent, false);
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
            int subjectId = result.getId();
//            Intent intent = new Intent(context, SubjectActivity.class);
//            intent.putExtra("SubjectId", SubjectId);
//            context.startActivity(intent);
            Toast.makeText(context, result.getExam().getName(), Toast.LENGTH_SHORT).show();
        });
    }

    @Override
    public int getItemCount() {
        return historyList != null ? historyList.size() : 0;
    }

    public static class HistoryViewHolder extends RecyclerView.ViewHolder {
        TextView tvExamName, tvTotalCorrectAnswers, tvScore, tvResult;
        ImageView subjectImage;
        CardView cvHistory;

        public HistoryViewHolder(@NonNull View itemView) {
            super(itemView);

            tvExamName = itemView.findViewById(R.id.examName);
            tvTotalCorrectAnswers = itemView.findViewById(R.id.totalCorrectAnswers);
            tvScore = itemView.findViewById(R.id.score);
            tvResult = itemView.findViewById(R.id.result);
            subjectImage = itemView.findViewById(R.id.subjectImage);
            cvHistory = itemView.findViewById(R.id.cvHistory);
        }

        @SuppressLint("SetTextI18n")
        public void bindData(Result result) {
            tvExamName.setText(result.getExam().getName());
            tvTotalCorrectAnswers.setText(result.getTotalCorrectAnswer()
                    + "/" + result.getExam().getNumberOfQuestions());
            tvScore.setText(String.valueOf(result.getScore()));
            classifyByScore(result);

            if (result.getExam().getSubject().getImage() != null) {
                String imageUrl = result.getExam().getSubject().getImage().getUrl();
                Glide.with(context).load(imageUrl).into(subjectImage);
            }
        }

        @SuppressLint("SetTextI18n")
        private void classifyByScore(Result result) {
            double score = result.getScore();
            if (score < 5.0) {
                tvResult.setText("Không đạt");
            } else {
                tvResult.setText("Đạt");
            }
        }
    }
}
