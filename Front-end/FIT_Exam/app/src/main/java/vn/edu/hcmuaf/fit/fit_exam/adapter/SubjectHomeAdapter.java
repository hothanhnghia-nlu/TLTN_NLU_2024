package vn.edu.hcmuaf.fit.fit_exam.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
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
import vn.edu.hcmuaf.fit.fit_exam.SubjectActivity;
import vn.edu.hcmuaf.fit.fit_exam.model.Subject;

public class SubjectHomeAdapter extends RecyclerView.Adapter<SubjectHomeAdapter.SubjectViewHolder> {
    private final List<Subject> subjectList;
    static Context context;

    public SubjectHomeAdapter(Context context, List<Subject> subjectList) {
        this.context = context;
        this.subjectList = subjectList;
    }

    @NonNull
    @Override
    public SubjectViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.subject_home_item, parent, false);
        return new SubjectViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull SubjectViewHolder holder, int position) {
        Subject subject = subjectList.get(position);
        if (subject == null) {
            return;
        }
        holder.bindData(subject);

        holder.cvSubject.setOnClickListener(view -> {
            int subjectId = subject.getId();
//            Intent intent = new Intent(context, SubjectActivity.class);
//            intent.putExtra("SubjectId", SubjectId);
//            context.startActivity(intent);

            Toast.makeText(context, subject.getName(), Toast.LENGTH_SHORT).show();
        });
    }

    @Override
    public int getItemCount() {
        return subjectList != null ? subjectList.size() : 0;
    }

    public static class SubjectViewHolder extends RecyclerView.ViewHolder {
        TextView tvSubjectName;
        ImageView subjectImage;
        CardView cvSubject;

        public SubjectViewHolder(@NonNull View itemView) {
            super(itemView);

            tvSubjectName = itemView.findViewById(R.id.subjectName);
            subjectImage = itemView.findViewById(R.id.subjectImage);
            cvSubject = itemView.findViewById(R.id.cvSubject);
        }

        @SuppressLint("SetTextI18n")
        public void bindData(Subject subject) {
            tvSubjectName.setText(subject.getName());

            if (subject.getImage() != null) {
                String imageUrl = subject.getImage().getUrl();
                Glide.with(context).load(imageUrl).into(subjectImage);
            }
        }
    }
}
