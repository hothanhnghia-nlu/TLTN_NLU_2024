package vn.edu.hcmuaf.fit.fitexam.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

import vn.edu.hcmuaf.fit.fitexam.R;
import vn.edu.hcmuaf.fit.fitexam.model.Answer;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Image;
import vn.edu.hcmuaf.fit.fitexam.model.Question;
import vn.edu.hcmuaf.fit.fitexam.model.ResultDetail;

public class ResultAdapter extends RecyclerView.Adapter<ResultAdapter.ResultViewHolder> {
    private final List<ResultDetail> detailList;
    static Context context;

    public ResultAdapter(Context context, List<ResultDetail> detailList) {
        this.context = context;
        this.detailList = detailList;
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
        ResultDetail resultDetail = detailList.get(position);
        if (resultDetail == null) {
            return;
        }
        holder.bindData(resultDetail, position);
    }

    @Override
    public int getItemCount() {
        return detailList != null ? detailList.size() : 0;
    }

    public static class ResultViewHolder extends RecyclerView.ViewHolder {
        TextView tvQuestion;
        LinearLayout answerContainer;
        ImageView ivFigure;

        public ResultViewHolder(@NonNull View itemView) {
            super(itemView);

            tvQuestion = itemView.findViewById(R.id.question);
            answerContainer = itemView.findViewById(R.id.answerContainer);
            ivFigure = itemView.findViewById(R.id.figure);
        }

        @SuppressLint({"SetTextI18n", "DefaultLocale"})
        public void bindData(ResultDetail resultDetail, int position) {
            Exam exam = resultDetail.getResult().getExam();
            Question question = resultDetail.getQuestion();
            Answer answer = resultDetail.getAnswer();

            if (exam != null && question != null && answer != null) {
                String questionText = String.format("Câu %d: %s", position + 1, question.getContent());
                tvQuestion.setText(questionText);

                answerContainer.removeAllViews();

                // Add TextView for each answer
                List<Answer> answers = question.getOptions();
                String[] optionPrefixes = {"A. ", "B. ", "C. ", "D. ", "E. ", "F. ", "G. ", "H. ", "I. ", "J. "};
                for (int i = 0; i < answers.size(); i++) {
                    Answer a = answers.get(i);
                    TextView tvAnswer = new TextView(answerContainer.getContext());
                    LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                            LinearLayout.LayoutParams.MATCH_PARENT,
                            LinearLayout.LayoutParams.WRAP_CONTENT
                    );
                    params.setMargins(0, 30, 0, 0);
                    tvAnswer.setLayoutParams(params);
                    tvAnswer.setBackgroundResource(R.drawable.border_radio_button);
                    tvAnswer.setGravity(Gravity.CENTER_VERTICAL);
                    tvAnswer.setPadding(
                            (int) itemView.getContext().getResources().getDimension(R.dimen.answer_padding_start),
                            (int) itemView.getContext().getResources().getDimension(R.dimen.answer_padding_top),
                            (int) itemView.getContext().getResources().getDimension(R.dimen.answer_padding_end),
                            (int) itemView.getContext().getResources().getDimension(R.dimen.answer_padding_bottom)
                    );
                    tvAnswer.setText(optionPrefixes[i] + a.getContent());
                    tvAnswer.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.black));
                    tvAnswer.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
                    answerContainer.addView(tvAnswer);

                    if (answer.getContent().equals(a.getContent())) {
                        if (answer.isCorrect()) {
                            tvAnswer.setTextColor(Color.WHITE);
                            tvAnswer.setBackground(ContextCompat.getDrawable(context, R.drawable.border_answer_right));
                        } else {
                            tvAnswer.setTextColor(Color.WHITE);
                            tvAnswer.setBackground(ContextCompat.getDrawable(context, R.drawable.border_answer_wrong));
                        }
                    }

                    if (a.isCorrect()) {
                        tvAnswer.setTextColor(Color.WHITE);
                        tvAnswer.setBackground(ContextCompat.getDrawable(context, R.drawable.border_answer_right));
                    }
                }

                List<Image> images = question.getImages();
                if (images != null && !images.isEmpty()) {
                    for (int i = 0; i < images.size(); i++) {
                        String imageUrl = images.get(i).getUrl();
                        ivFigure.setVisibility(View.VISIBLE);
                        Glide.with(context).load(imageUrl).into(ivFigure);
                    }
                } else {
                    ivFigure.setVisibility(View.GONE);
                }
            }
        }
    }
}
