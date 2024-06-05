package vn.edu.hcmuaf.fit.fitexam;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.common.DBHelper;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.common.SaveExamResultCallback;
import vn.edu.hcmuaf.fit.fitexam.model.Answer;
import vn.edu.hcmuaf.fit.fitexam.model.Image;
import vn.edu.hcmuaf.fit.fitexam.model.Question;
import vn.edu.hcmuaf.fit.fitexam.model.Result;
import vn.edu.hcmuaf.fit.fitexam.model.ResultDetail;
import vn.edu.hcmuaf.fit.fitexam.model.utils.UserAnswer;

public class QuestionActivity extends AppCompatActivity {
    TextView tvExamName, tvNumberOfQuestion, tvCountDown, tvQuestion;
    ImageView ivFigure;
    RadioGroup radioGroup;
    Button btnNext, btnContinuous, btnPrevious, btnSubmit;
    RelativeLayout rlTwoButton;
    CountDownTimer countDownTimer;
    DBHelper dbHelper;
    LoginSession session;
    private long timeLeftInMillis;
    private String examDateTime;
    private int numberOfQuestions, examID, examTime;
    private ArrayList<Question> questions;
    private int currentQuestion = 0;
    private boolean continuousMode = false;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_question);

        tvExamName = findViewById(R.id.examName);
        tvNumberOfQuestion = findViewById(R.id.numberOfQuestion);
        tvCountDown = findViewById(R.id.timer);
        tvQuestion = findViewById(R.id.question);
        ivFigure = findViewById(R.id.figure);
        radioGroup = findViewById(R.id.answerRadioGroup);
        btnPrevious = findViewById(R.id.btnPrevious);
        btnContinuous = findViewById(R.id.btnContinuous);
        btnNext = findViewById(R.id.btnNext);
        btnSubmit = findViewById(R.id.btnSubmit);
        rlTwoButton = findViewById(R.id.twoButton);

        dbHelper = new DBHelper(this);
        session = new LoginSession(getApplicationContext());

        Intent intent = getIntent();
        examID = intent.getIntExtra("examId", -1);
        String examName = intent.getStringExtra("examName");
        numberOfQuestions = intent.getIntExtra("numberOfQuestions", -1);
        examTime = intent.getIntExtra("examTime", -1);
        examDateTime = intent.getStringExtra("examDate");

        if (checkInternetPermission()) {
            if (examID != -1 || examName != null || examTime != 1 || numberOfQuestions != -1) {
                tvExamName.setText(examName);
                timeLeftInMillis = examTime * 60000L;
                startCountDown();
                loadQuestion(examID);
            }
        } else {
            Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                for (int i = 0; i < group.getChildCount(); i++) {
                    RadioButton rb = (RadioButton) group.getChildAt(i);
                    if (rb.getId() == checkedId) {
                        rb.setTextColor(Color.WHITE);
                        rb.setBackground(ContextCompat.getDrawable(QuestionActivity.this, R.drawable.border_radio_button_checked));
                    } else {
                        rb.setTextColor(Color.BLACK);
                        rb.setBackground(ContextCompat.getDrawable(QuestionActivity.this, R.drawable.border_radio_button));
                    }
                }
            }
        });

        btnNext.setOnClickListener(v -> {
            if (!continuousMode) {
                showContinuousMode();
            } else {
                showNextQuestion();
            }
        });

        btnContinuous.setOnClickListener(v -> {
            showNextQuestion();
        });

        btnPrevious.setOnClickListener(v -> {
            showPreviousQuestion();
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

    private void loadQuestion(int examId) {
        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Question>> questionList = apiService.getAllQuestionsByExamId(examId);

        questionList.enqueue(new Callback<ArrayList<Question>>() {
            @Override
            public void onResponse(Call<ArrayList<Question>> call, Response<ArrayList<Question>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    questions = response.body();
                    for (Question question : questions) {
                        dbHelper.saveQuestion(question);
                    }
                    displayQuestion(currentQuestion);
                } else {
                    Log.e("API_ERROR", "Response code: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<ArrayList<Question>> call, Throwable t) {
                Log.e("API_ERROR", "Failure: " + t.getMessage());
            }
        });
    }

    @SuppressLint({"DefaultLocale", "SetTextI18n"})
    private void displayQuestion(int index) {
        Question question = questions.get(index);
        List<Image> images = question.getImages();

        tvNumberOfQuestion.setText(String.format("%d/%s", index + 1, numberOfQuestions));
        tvQuestion.setText(String.format("Câu %d: %s", index + 1, question.getContent()));

        if (images != null && !images.isEmpty()) {
            for (int i = 0; i < images.size(); i++) {
                String imageUrl = images.get(i).getUrl();
                ivFigure.setVisibility(View.VISIBLE);
                Glide.with(getApplicationContext()).load(imageUrl).into(ivFigure);
            }
        } else {
            ivFigure.setVisibility(View.GONE);
        }

        radioGroup.removeAllViews();

        int savedAnswerId = dbHelper.getUserAnswer(question.getId());
        String[] optionPrefixes = {"A. ", "B. ", "C. ", "D. ", "E. "};

        for (int i = 0; i < question.getOptions().size(); i++) {
            Answer option = question.getOptions().get(i);
            RadioButton radioButton = new RadioButton(this);
            radioButton.setText(optionPrefixes[i] + option.getContent());
            radioButton.setTag(option);

            int radioButtonId = View.generateViewId();
            radioButton.setId(radioButtonId);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                radioButton.setBackground(ContextCompat.getDrawable(this, R.drawable.border_radio_button));
            } else {
                radioButton.setBackgroundDrawable(ContextCompat.getDrawable(this, R.drawable.border_radio_button));
            }

            int paddingStartEnd = getResources().getDimensionPixelSize(R.dimen.radio_button_padding_start_end);
            int paddingTopBottom = getResources().getDimensionPixelSize(R.dimen.radio_button_padding_top_bottom);
            radioButton.setPadding(paddingStartEnd, paddingTopBottom, paddingStartEnd, paddingTopBottom);

            int marginTop = getResources().getDimensionPixelSize(R.dimen.radio_button_margin_top);
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
            );
            layoutParams.setMargins(0, marginTop, 0, 0);
            radioButton.setLayoutParams(layoutParams);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                ColorStateList colorStateList = ContextCompat.getColorStateList(this, R.color.radio_button_color);
                radioButton.setButtonTintList(colorStateList);
            }

            if (option.getId() == savedAnswerId) {
                radioButton.setChecked(true);
                radioButton.setTextColor(Color.WHITE);
                radioButton.setBackground(ContextCompat.getDrawable(this, R.drawable.border_radio_button_checked));
            }

            radioGroup.addView(radioButton, i);
        }

        updateButtonVisibility();
    }

    private void showNextQuestion() {
        saveSelectedAnswer();
        if (!continuousMode) {
            showContinuousMode();
        } else {
            if (currentQuestion < questions.size() - 1) {
                currentQuestion++;
                displayQuestion(currentQuestion);

                btnContinuous.setEnabled(currentQuestion < questions.size() - 1);
            } else {
                saveSelectedAnswer();
            }
        }
    }

    private void showPreviousQuestion() {
        saveSelectedAnswer();
        if (currentQuestion > 0) {
            currentQuestion--;
            displayQuestion(currentQuestion);
            btnContinuous.setEnabled(true);
        }
    }

    private void showContinuousMode() {
        saveSelectedAnswer();
        if (currentQuestion < questions.size() - 1) {
            currentQuestion++;
            displayQuestion(currentQuestion);

            continuousMode = true;
            btnNext.setVisibility(View.GONE);
            rlTwoButton.setVisibility(View.VISIBLE);
        }
    }

    private void updateButtonVisibility() {
        if (!continuousMode) {
            btnNext.setVisibility(View.VISIBLE);
            rlTwoButton.setVisibility(View.GONE);
        }
        btnPrevious.setEnabled(currentQuestion > 0);
        btnNext.setEnabled(currentQuestion < questions.size() - 1);
    }

    private void saveSelectedAnswer() {
        int selectedAnswerId = radioGroup.getCheckedRadioButtonId();
        if (selectedAnswerId != -1) {
            RadioButton selectedRadioButton = findViewById(selectedAnswerId);
            if (selectedRadioButton != null) {
                Answer selectedAnswer = (Answer) selectedRadioButton.getTag();

                dbHelper.deleteUserAnswer(questions.get(currentQuestion).getId());
                dbHelper.saveUserAnswer(questions.get(currentQuestion).getId(), selectedAnswer.getId(), selectedAnswer.isCorrect());
            }
        }
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

    private void handleSubmit() {
        saveSelectedAnswer();

        List<Integer> unansweredQuestions = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            int savedAnswerId = dbHelper.getUserAnswer(questions.get(i).getId());
            if (savedAnswerId == -1) {
                unansweredQuestions.add(i + 1);
            }
        }

        if (!unansweredQuestions.isEmpty()) {
            StringBuilder message = new StringBuilder("Bạn chưa trả lời các câu: ");
            for (int questionNumber : unansweredQuestions) {
                message.append(questionNumber).append(", ");
            }
            message.setLength(message.length() - 2);
            message.append(". Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài.");
            Toast.makeText(this, message.toString(), Toast.LENGTH_LONG).show();
            return;
        }

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
                    int correctAnswers = dbHelper.countCorrectAnswers();
                    processExamResult(correctAnswers);
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
                    int correctAnswers = dbHelper.countCorrectAnswers();
                    processExamResult(correctAnswers);
                    dialog.dismiss();
                });

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void showCancelDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle("Bạn có chắc chắn thoát làm bài?")
                .setMessage("Nhấn Đồng ý để thoát. Tất cả dữ liệu sẽ không được lưu lại.")
                .setPositiveButton("ĐỒNG Ý", (dialog, which) -> {
                    dbHelper.deleteAllSelection();
                    finish();
                    dialog.dismiss();
                })
                .setNegativeButton("HỦY", (dialog, which) -> {
                    dialog.dismiss();
                });

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void processExamResult(int correctAnswers) {
        saveExamResult(correctAnswers, new SaveExamResultCallback() {
            @Override
            public void onResult(double score) {
                runOnUiThread(() -> {
                    if (score >= 5.0) {
                        showResultDialog(ContextCompat.getDrawable(
                                QuestionActivity.this, R.drawable.icon_right), "Đạt",
                                "Chúc mừng bạn đã thi đậu với số điểm: " + score);
                    } else {
                        showResultDialog(ContextCompat.getDrawable(
                                        QuestionActivity.this, R.drawable.icon_wrong), "Không đạt",
                                "Rất tiếc, bạn đã thi trượt với số điểm: " + score);
                    }
                    dbHelper.deleteAllSelection();
                });
            }
        });
    }

    private void showResultDialog(Drawable image, String result, String message) {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.custom_result_dialog);
        dialog.setCancelable(false);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);

        TextView tvResult = dialog.findViewById(R.id.result);
        TextView tvMessage = dialog.findViewById(R.id.message);
        ImageView imageView = dialog.findViewById(R.id.resultImage);
        Button btnClose = dialog.findViewById(R.id.btnClose);

        imageView.setImageDrawable(image);
        tvResult.setText(result);
        tvMessage.setText(message);

        btnClose.setOnClickListener(view -> {
            finish();
            dialog.dismiss();
        });

        dialog.show();
    }

    private void saveExamResult(int correctAnswers, SaveExamResultCallback callback) {
        String userID = LoginSession.getIdKey();
        double examScore = (10.0 / numberOfQuestions) * correctAnswers;
        double roundedScore = Math.round(examScore * 100.0) / 100.0;

        String bodyType = "multipart/form-data";
        RequestBody userId = RequestBody.create(MediaType.parse(bodyType), userID);
        RequestBody examId = RequestBody.create(MediaType.parse(bodyType), String.valueOf(examID));
        RequestBody totalCorrectAnswer = RequestBody.create(MediaType.parse(bodyType), String.valueOf(correctAnswers));
        RequestBody score = RequestBody.create(MediaType.parse(bodyType), String.valueOf(roundedScore));
        RequestBody examDate = RequestBody.create(MediaType.parse(bodyType), examDateTime);
        RequestBody overallTime = RequestBody.create(MediaType.parse(bodyType), String.valueOf(calcOverallExamTime()));

        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<Result> create = apiService.createResult(userId, examId, totalCorrectAnswer, score, examDate, overallTime);

        create.enqueue(new Callback<Result>() {
            @Override
            public void onResponse(Call<Result> call, Response<Result> response) {
                if (response.isSuccessful() && response.body() != null) {
                    int resultId = response.body().getId();
                    saveResultDetail(resultId);
                    if (callback != null) {
                        callback.onResult(roundedScore);
                    }
                }
            }

            @Override
            public void onFailure(Call<Result> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private void saveResultDetail(int resultId) {
        List<UserAnswer> latestUserAnswers = dbHelper.getLatestUserAnswers();

        if (!latestUserAnswers.isEmpty()) {
            new Thread(() -> {
                for (UserAnswer userAnswer : latestUserAnswers) {
                    int questionId = userAnswer.getQuestionId();
                    int answerId = userAnswer.getAnswerId();
                    boolean isCorrect = userAnswer.isCorrect();

                    insertResultDetail(resultId, questionId, answerId, isCorrect);
                }
            }).start();
        }
    }

    private void insertResultDetail(int resultID, int questionID, int answerID, boolean checkIsCorrect) {
        String bodyType = "multipart/form-data";
        RequestBody resultId = RequestBody.create(MediaType.parse(bodyType), String.valueOf(resultID));
        RequestBody questionId = RequestBody.create(MediaType.parse(bodyType), String.valueOf(questionID));
        RequestBody answerId = RequestBody.create(MediaType.parse(bodyType), String.valueOf(answerID));
        RequestBody isCorrect = RequestBody.create(MediaType.parse(bodyType), String.valueOf(checkIsCorrect));

        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ResultDetail> create = apiService.createResultDetail(resultId, questionId, answerId, isCorrect);

        create.enqueue(new Callback<ResultDetail>() {
            @Override
            public void onResponse(Call<ResultDetail> call, Response<ResultDetail> response) {
                if (response.isSuccessful()) {
                    android.util.Log.e("API_SUCCESS", "Result Detail: " + response.body());
                }
            }

            @Override
            public void onFailure(Call<ResultDetail> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private double calcOverallExamTime() {
        String time = tvCountDown.getText().toString();

        String[] parts = time.split(":");
        int minutes = Integer.parseInt(parts[0]);
        int seconds = Integer.parseInt(parts[1]);

        double totalMinutes = minutes + (seconds / 60.0);
        double dbExamTime = examTime;
        double overallTime = dbExamTime - totalMinutes;

        return Math.round(overallTime * 100.0) / 100.0;
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