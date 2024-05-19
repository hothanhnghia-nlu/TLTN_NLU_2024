package vn.edu.hcmuaf.fit.fitexam.adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

import vn.edu.hcmuaf.fit.fitexam.LoginActivity;
import vn.edu.hcmuaf.fit.fitexam.QuestionActivity;
import vn.edu.hcmuaf.fit.fitexam.R;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;

public class TakeExamAdapter extends RecyclerView.Adapter<TakeExamAdapter.TakeExamViewHolder> {
    private List<Exam> examList;
    private static Context context;
    private Dialog dialog;

    public TakeExamAdapter(Context context, List<Exam> examList) {
        if (!(context instanceof Activity)) {
            throw new IllegalArgumentException("Context must be an Activity context");
        }
        this.context = context;
        this.examList = examList;
    }

    public void setFilteredList(List<Exam> filteredList) {
        this.examList = filteredList;
        notifyDataSetChanged();
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
    private void showStartDialog(int examId, String examName, int examTime) {
        String email = LoginSession.getEmailKey();

        dismissDialog();

        Activity activity = (Activity) context;

        if (activity.isFinishing()) {
            return;
        }
        if (email == null) {
            handleAlertDialog();
            return;
        }
        dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
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
        tvTime.setText(examTime + " phút");

        btnYes.setOnClickListener(view -> {
            Intent intent = new Intent(activity, QuestionActivity.class);
            intent.putExtra("examId", examId);
            intent.putExtra("examName", examName);
            intent.putExtra("examTime", examTime);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(intent);
            dismissDialog();
        });

        btnNo.setOnClickListener(view -> dismissDialog());
        dialog.show();
    }

    @SuppressLint("SetTextI18n")
    private void handleAlertDialog() {
        dismissDialog();

        Activity activity = (Activity) context;

        if (activity.isFinishing()) {
            return;
        }

        dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.custom_alert_dialog);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);

        TextView tvMessage = dialog.findViewById(R.id.message);
        Button btnYes = dialog.findViewById(R.id.btnContinuous);

        tvMessage.setText("Vui lòng đăng nhập để luyện thi tuyệt vời hơn");
        btnYes.setText("Đăng nhập ngay");

        btnYes.setOnClickListener(view -> {
            Intent intent = new Intent(activity, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(intent);
            dismissDialog();
        });

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
