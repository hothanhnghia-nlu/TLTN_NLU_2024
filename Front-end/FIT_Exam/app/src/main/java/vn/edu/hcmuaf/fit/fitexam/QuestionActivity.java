package vn.edu.hcmuaf.fit.fitexam;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
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

import vn.edu.hcmuaf.fit.fitexam.R;
import vn.edu.hcmuaf.fit.fitexam.model.Answer;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Question;

public class QuestionActivity extends AppCompatActivity {
    TextView tvExamName, tvNumberOfQuestion, tvCountDown, tvQuestion;
    RadioGroup radioGroup;
    RadioButton rbOption1, rbOption2, rbOption3, rbOption4;
    Button btnPrevious, btnContinuous, btnNext, btnSubmit;
    RelativeLayout rlTwoButton;
    CountDownTimer countDownTimer;
    private long timeLeftInMillis;
    private boolean answered;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_question);

        tvExamName = findViewById(R.id.examName);
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

        Intent intent = getIntent();
        int examId = intent.getIntExtra("examId", -1);
        String examName = intent.getStringExtra("examName");
        int examTime = intent.getIntExtra("examTime", -1);

        if (examTime != -1) {
            timeLeftInMillis = examTime * 60000L;
            startCountDown();
        }

        if (checkInternetPermission()) {
            loadQuestion();
        } else {
            Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        btnPrevious.setOnClickListener(v -> {

        });

        btnContinuous.setOnClickListener(v -> {
            handleNextQuestion();
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

    private void loadQuestion() {
        Exam exam = new Exam();
        exam.setName("Bài kiểm tra Chương 1");
        exam.setNumberOfQuestions(30);
        Answer a1 = new Answer();
        a1.setContent("Hướng đối tượng");
        a1.setCorrect(false);
        Answer a2 = new Answer();
        a2.setContent("Web");
        a2.setCorrect(false);
        Answer a3 = new Answer();
        a3.setContent("Hướng thủ tục");
        a3.setCorrect(false);
        Answer a4 = new Answer();
        a4.setContent("Di động");
        a4.setCorrect(true);
        Question question = new Question();
        question.setContent("Lập trình Android là gì?");

        tvExamName.setText(exam.getName());
        tvNumberOfQuestion.setText("1/" + exam.getNumberOfQuestions());
        tvQuestion.setText("Câu 1: " + question.getContent());
        rbOption1.setText(a1.getContent());
        rbOption2.setText(a2.getContent());
        rbOption3.setText(a3.getContent());
        rbOption4.setText(a4.getContent());
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
                handleSubmitTimesUp();
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

    private void handleSubmitTimesUp() {
        showSubmitTimesUpDialog();
    }

    private void showSubmitDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle("Bạn có chắc chắn đã hoàn thành các câu trả lời?")
                .setMessage("Nhấn Đồng ý để xem kết quả.")
                .setPositiveButton("ĐỒNG Ý", (dialog, which) -> {
                    Intent intent = new Intent(this, ResultActivity.class);
                    startActivity(intent);
                    finish();
                    dialog.dismiss();
                })
                .setNegativeButton("HỦY", (dialog, which) -> {
                    dialog.dismiss();
                });

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void showSubmitTimesUpDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle("Hết giờ")
                .setMessage("Đã hết thời gian làm bài. Vui lòng nhấn Nộp bài.")
                .setCancelable(false)
                .setPositiveButton("NỘP BÀI", (dialog, which) -> {
                    Intent intent = new Intent(this, ResultActivity.class);
                    startActivity(intent);
                    finish();
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
                    Intent intent = new Intent(this, ResultActivity.class);
                    startActivity(intent);
                    finish();
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

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}