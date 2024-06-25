package vn.edu.hcmuaf.fit.fitexam;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.text.format.Formatter;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.textfield.TextInputEditText;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.common.UserIdCallback;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class ChangePasswordActivity extends AppCompatActivity {
    TextInputEditText edOldPassword, edPassword, edConfPassword;
    TextView tvMessage;
    ImageView btnBack;
    Button btnSave;
    LoginSession session;
    final String PASSWORD_PATTERN = "((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%*^]).{8,64})";

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_password);

        edOldPassword = findViewById(R.id.oldPassword);
        edPassword = findViewById(R.id.password);
        edConfPassword = findViewById(R.id.confPassword);
        tvMessage = findViewById(R.id.showError);
        btnSave = findViewById(R.id.btnSave);
        btnBack = findViewById(R.id.btnBack);

        session = new LoginSession(getApplicationContext());
        String id = LoginSession.getIdKey();
        String email = LoginSession.getEmailKey();

        // Nút Lưu thay đổi
        btnSave.setOnClickListener(view -> {
            handleChangePassword(Integer.parseInt(id), email);
        });

        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                showCancelDialog();
            }
        };
        ChangePasswordActivity.this.getOnBackPressedDispatcher().addCallback(this, callback);
    }

    // Hiện thực chức năng Thay đổi mật khẩu
    @SuppressLint("SetTextI18n")
    private void handleChangePassword(int id, String email) {
        String oldPassword = edOldPassword.getText().toString().trim();
        String password = edPassword.getText().toString().trim();
        String confPassword = edConfPassword.getText().toString().trim();

        if (oldPassword.isEmpty() || password.isEmpty() || confPassword.isEmpty()) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Vui lòng điền đầy đủ thông tin.");
        } else if (!isPasswordValid(password)) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Mật khẩu phải chứa ít nhất một chữ cái viết thường, " +
                    "một chữ cái viết hoa, một ký tự đặc biệt và có ít nhất 8 ký tự.");
        } else if (password.equals(oldPassword)) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Mật khẩu mới không được trùng mật khẩu cũ.");
        } else if (!confPassword.equals(password)) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Mật khẩu xác nhận không đúng.");
        } else {
            updatePassword(id, email, password);
        }
    }

    // Cập nhật mật khẩu
    private void updatePassword(int id, String email, String txtPassword) {
        String bodyType = "multipart/form-data";
        RequestBody password = RequestBody.create(MediaType.parse(bodyType), txtPassword);

        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<Void> changePassword = apiService.changePassword(id, password);

        changePassword.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    Log log = new Log(id, Log.ALERT, getPhoneIpAddress(), "Change password",
                            "Email: " + email + " is changed password successful", Log.SUCCESS);
                    addLog(log);

                    Toast.makeText(ChangePasswordActivity.this,
                            "Đổi mật khẩu thành công!", Toast.LENGTH_SHORT).show();

                    Intent intent = new Intent(ChangePasswordActivity.this, LoginActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    Log log = new Log(id, Log.WARNING, getPhoneIpAddress(), "Change password",
                            "Email: " + email + " is changed password failed", Log.FAILED);
                    addLog(log);

                    Toast.makeText(ChangePasswordActivity.this,
                            "Đổi mật khẩu thất bại!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Thêm vào nhật ký hệ thống
    private void addLog(Log log) {
        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<Log> passwordLog = apiService.createLog(log);

        passwordLog.enqueue(new Callback<Log>() {
            @Override
            public void onResponse(@NonNull Call<Log> call, @NonNull Response<Log> response) {
                if (response.isSuccessful()) {
                    android.util.Log.e("API_SUCCESS", "Logs: " + response.body());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Log> call, @NonNull Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Lấy địa chỉ IP của điện thoại
    private String getPhoneIpAddress() {
        WifiManager wifiManager = (WifiManager) getApplicationContext().getSystemService(WIFI_SERVICE);
        return Formatter.formatIpAddress(wifiManager.getConnectionInfo().getIpAddress());
    }

    // Kiểm tra mật khẩu hợp lệ
    public boolean isPasswordValid(final String password) {
        Pattern pattern;
        Matcher matcher;
        pattern = Pattern.compile(PASSWORD_PATTERN);
        matcher = pattern.matcher(password);
        return matcher.matches();
    }

    // Hiển thị hộp thoại Hủy tác vụ
    private void showCancelDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle("Bạn có chắc chắn rời khỏi trang này?")
                .setMessage("Thông tin bạn vừa nhập sẽ không được lưu lại.")
                .setPositiveButton("RỜI KHỎI", (dialog, which) -> {
                    finish();
                    dialog.dismiss();
                })
                .setNegativeButton("Ở LẠI", (dialog, which) -> {
                    dialog.dismiss();
                });

        AlertDialog dialog = builder.create();
        dialog.show();
    }
}