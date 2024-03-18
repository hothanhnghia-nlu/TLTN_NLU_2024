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
import vn.edu.hcmuaf.fit.fit_exam.model.Exam;
import vn.edu.hcmuaf.fit.fit_exam.model.Subject;

public class TakeExamAdapter extends RecyclerView.Adapter<TakeExamAdapter.TakeExamViewHolder> {
    private final List<Exam> examList;
    static Context context;

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
            int subjectId = exam.getId();
//            Intent intent = new Intent(context, SubjectActivity.class);
//            intent.putExtra("SubjectId", SubjectId);
//            context.startActivity(intent);
            Toast.makeText(context, "Subject id: " + subjectId, Toast.LENGTH_SHORT).show();
        });
    }

    @Override
    public int getItemCount() {
        return examList != null ? examList.size() : 0;
    }

    public static class TakeExamViewHolder extends RecyclerView.ViewHolder {
        TextView tvSubjectName, tvTotalQuestion, tvTime;
        ImageView subjectImage;
        CardView cvExam;

        public TakeExamViewHolder(@NonNull View itemView) {
            super(itemView);

            tvSubjectName = itemView.findViewById(R.id.subjectName);
            tvTotalQuestion = itemView.findViewById(R.id.totalQuestions);
            tvTime = itemView.findViewById(R.id.timer);
            subjectImage = itemView.findViewById(R.id.subjectImage);
            cvExam = itemView.findViewById(R.id.cvExam);
        }

        @SuppressLint("SetTextI18n")
        public void bindData(Exam exam) {
            tvSubjectName.setText(exam.getName());
            tvTotalQuestion.setText(exam.getNumberOfQuestions());
//            tvTime.setText(exam.getName());

            if (exam.getSubject().getImage() != null) {
                String imageUrl = exam.getSubject().getImage().getUrl();
                Glide.with(context).load(imageUrl).into(subjectImage);
            }
        }
    }
}
