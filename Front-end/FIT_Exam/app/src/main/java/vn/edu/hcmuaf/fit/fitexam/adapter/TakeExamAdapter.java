package vn.edu.hcmuaf.fit.fitexam.adapter;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

import vn.edu.hcmuaf.fit.fitexam.QuestionActivity;
import vn.edu.hcmuaf.fit.fitexam.R;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;

public class TakeExamAdapter extends RecyclerView.Adapter<TakeExamAdapter.TakeExamViewHolder> {
    private final List<Exam> examList;
    static Context context;
    private Dialog dialog;

    public TakeExamAdapter(Context context, List<Exam> examList) {
        this.context = context;
        this.examList = examList;
    }

    @NonNull
    @Override
    public TakeExamViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.exam_item, parent, false);
        return new TakeExamViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull TakeExamViewHolder holder, int position) {
        Exam exam = examList.get(position);
        if (exam == null) {
            return;
        }
        holder.bindData(exam);

        holder.cvExam.setOnClickListener(view -> {
            int examId = exam.getId();
            String examName = exam.getName();
            int time = exam.getExamTime();
            showStartDialog(examId, examName, time);
        });
    }

    @SuppressLint("SetTextI18n")
    private void showStartDialog(int examId, String examName, int time) {
        dismissDialog();

        dialog = new Dialog(context);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(false);
        dialog.setContentView(R.layout.custom_start_dialog);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);

        TextView tvMessage = dialog.findViewById(R.id.message);
        TextView tvExamName = dialog.findViewById(R.id.examName);
        TextView tvTime = dialog.findViewById(R.id.timer);
        Button btnYes = dialog.findViewById(R.id.btnStart);
        Button btnNo = dialog.findViewById(R.id.btnCancel);

        tvExamName.setText(examName);
        tvMessage.setText("Hãy chọn câu trả lời của bạn bằng cách nhấn chọn " +
                "một trong các đáp án trong mỗi câu hỏi.");
        tvTime.setText(time + " phút");

        btnYes.setOnClickListener(view -> {
            Intent intent = new Intent(context, QuestionActivity.class);
            intent.putExtra("examId", examId);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            dismissDialog();
        });

        btnNo.setOnClickListener(view -> dismissDialog());
        dialog.show();
    }

    private void dismissDialog() {
        if (dialog != null && dialog.isShowing()) {
            dialog.dismiss();
        }
    }

    @Override
    public int getItemCount() {
        return examList != null ? examList.size() : 0;
    }

    public static class TakeExamViewHolder extends RecyclerView.ViewHolder {
        TextView tvExamName, tvTotalQuestion, tvTime;
        ImageView subjectImage;
        CardView cvExam;

        public TakeExamViewHolder(@NonNull View itemView) {
            super(itemView);

            tvExamName = itemView.findViewById(R.id.examName);
            tvTotalQuestion = itemView.findViewById(R.id.totalQuestions);
            tvTime = itemView.findViewById(R.id.timer);
            subjectImage = itemView.findViewById(R.id.subjectImage);
            cvExam = itemView.findViewById(R.id.cvExam);
        }

        @SuppressLint("SetTextI18n")
        public void bindData(Exam exam) {
            tvExamName.setText(exam.getName());
            tvTotalQuestion.setText(String.valueOf(exam.getNumberOfQuestions()));
            tvTime.setText(exam.getExamTime() + " phút");

            if (exam.getSubject().getImage() != null) {
                String imageUrl = exam.getSubject().getImage().getUrl();
                Glide.with(context).load(imageUrl).into(subjectImage);
            }
        }
    }
}
