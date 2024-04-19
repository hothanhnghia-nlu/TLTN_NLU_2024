package vn.edu.hcmuaf.fit.fitexam.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import vn.edu.hcmuaf.fit.fitexam.R;
import vn.edu.hcmuaf.fit.fitexam.model.Answer;
import vn.edu.hcmuaf.fit.fitexam.model.Result;

public class ResultAdapter extends RecyclerView.Adapter<ResultAdapter.ResultViewHolder> {
    private final List<Answer> answerList;
    static Context context;

    public ResultAdapter(Context context, List<Answer> answerList) {
        this.context = context;
        this.answerList = answerList;
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
        Answer answer = answerList.get(position);
        if (answer == null) {
            return;
        }
        holder.bindData(answer);

    }

    @Override
    public int getItemCount() {
        return answerList != null ? answerList.size() : 0;
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
        public void bindData(Answer answer) {
            tvQuestion.setText(answer.getQuestion().getContent());
            tvAnswer1.setText(answer.getContent());
            tvAnswer2.setText(answer.getContent());
            tvAnswer3.setText(answer.getContent());
            tvAnswer4.setText(answer.getContent());
        }
    }
}
