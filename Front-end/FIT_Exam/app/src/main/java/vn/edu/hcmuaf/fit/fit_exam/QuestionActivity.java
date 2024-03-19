package vn.edu.hcmuaf.fit.fit_exam;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Locale;

public class QuestionActivity extends AppCompatActivity {
    TextView tvSubjectName, tvNumberOfQuestion, tvCountDown, tvQuestion;
    RadioGroup radioGroup;
    RadioButton rbOption1, rbOption2, rbOption3, rbOption4;
    Button btnPrevious, btnContinuous, btnNext, btnSubmit;
    RelativeLayout rlTwoButton;
    CountDownTimer countDownTimer;
    private long timeLeftInMillis;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_question);

        tvSubjectName = findViewById(R.id.subjectName);
        tvNumberOfQuestion = findViewById(R.id.numberOfQuestion);
        tvCountDown = findViewById(R.id.timer);
        tvQuestion = findViewById(R.id.question);
        radioGroup = findViewById(R.id.answerRadioGroup);
        rbOption1 = findViewById(R.id.option1);
        rbOption2 = findViewById(R.id.option2);
        rbOption3 = findViewById(R.id.option3);
        rbOption4 = findViewById(R.id.option4);
        btnPrevious = findViewById(R.id.btnPrevious);
        btnContinuous = findViewById(R.id.btnContinuous);
        btnNext = findViewById(R.id.btnNext);
        btnSubmit = findViewById(R.id.btnSubmit);
        rlTwoButton = findViewById(R.id.twoButton);

        timeLeftInMillis = 30000;
        startCountDown();

        btnPrevious.setOnClickListener(v -> {

        });

        btnContinuous.setOnClickListener(v -> {

        });

        btnNext.setOnClickListener(v -> {
            handleNextQuestion();
        });

        btnSubmit.setOnClickListener(v -> {
            handleSubmit();
        });

        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                showCancelDialog();
            }
        };
        QuestionActivity.this.getOnBackPressedDispatcher().addCallback(this, callback);

    }

    private void startCountDown() {
        countDownTimer = new CountDownTimer(timeLeftInMillis, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                timeLeftInMillis = millisUntilFinished;
                updateCountDownText();
            }

            @Override
            public void onFinish() {
                timeLeftInMillis = 0;
                updateCountDownText();
            }
        }.start();
    }

    private void updateCountDownText() {
        int minutes = (int) ((timeLeftInMillis / 1000) / 60);
        int seconds = (int) ((timeLeftInMillis / 1000) % 60);
        String timeFormatted = String.format(Locale.getDefault(), "%02d:%02d", minutes, seconds);
        tvCountDown.setText(timeFormatted);
        if (timeLeftInMillis < 10000) {
            tvCountDown.setTextColor(Color.RED);
        } else {
            tvCountDown.setTextColor(Color.WHITE);
        }
    }

    private void handleNextQuestion() {
        if (btnNext.isPressed()) {
            rlTwoButton.setVisibility(View.VISIBLE);
            btnNext.setVisibility(View.GONE);
        }
    }

    private void handleSubmit() {
        showSubmitDialog();
    }

    private void showSubmitDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle("Bạn có chắc chắn đã hoàn thành các câu trả lời?")
                .setMessage("Nhấn Đồng ý để xem kết quả.")
                .setPositiveButton("ĐỒNG Ý", (dialog, which) -> {
                    Toast.makeText(QuestionActivity.this, "Bạn đã đồng ý!", Toast.LENGTH_SHORT).show();
                    dialog.dismiss();
                })
                .setNegativeButton("HỦY", (dialog, which) -> {
                    dialog.dismiss();
                });

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void showCancelDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle("Bạn có chắc chắn muốn nộp bài?")
                .setMessage("Nhấn Đồng ý để nộp bài.")
                .setPositiveButton("ĐỒNG Ý", (dialog, which) -> {
                    Toast.makeText(QuestionActivity.this, "Bạn đã đồng ý!", Toast.LENGTH_SHORT).show();
                    dialog.dismiss();
                })
                .setNegativeButton("HỦY", (dialog, which) -> {
                    dialog.dismiss();
                });

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (countDownTimer != null) {
            countDownTimer.cancel();
        }
    }
}