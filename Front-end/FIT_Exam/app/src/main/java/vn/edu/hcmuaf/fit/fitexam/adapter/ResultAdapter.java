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

import java.util.List;

import vn.edu.hcmuaf.fit.fitexam.R;
import vn.edu.hcmuaf.fit.fitexam.ResultActivity;
import vn.edu.hcmuaf.fit.fitexam.model.Result;

public class ResultAdapter extends RecyclerView.Adapter<ResultAdapter.ResultViewHolder> {
    private final List<Result> resultList;
    static Context context;

    public ResultAdapter(Context context, List<Result> resultList) {
        this.context = context;
        this.resultList = resultList;
    }

    @NonNull
    @Override
    public ResultViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.result_item, parent, false);
        return new ResultViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull ResultViewHolder holder, int position) {
        Result result = resultList.get(position);
        if (result == null) {
            return;
        }
        holder.bindData(result);

    }

    @Override
    public int getItemCount() {
        return resultList != null ? resultList.size() : 0;
    }

    public static class ResultViewHolder extends RecyclerView.ViewHolder {
        TextView tvQuestion, tvAnswer1, tvAnswer2, tvAnswer3, tvAnswer4;

        public ResultViewHolder(@NonNull View itemView) {
            super(itemView);

            tvQuestion = itemView.findViewById(R.id.question);
            tvAnswer1 = itemView.findViewById(R.id.answer1);
            tvAnswer2 = itemView.findViewById(R.id.answer2);
            tvAnswer3 = itemView.findViewById(R.id.answer3);
            tvAnswer4 = itemView.findViewById(R.id.answer4);
        }

        @SuppressLint("SetTextI18n")
        public void bindData(Result result) {
            tvQuestion.setText(result.getExam().getName());
            tvAnswer1.setText(result.getExam().getName());
            tvAnswer2.setText(result.getExam().getName());
            tvAnswer3.setText(result.getExam().getName());
            tvAnswer4.setText(result.getExam().getName());
        }
    }
}
