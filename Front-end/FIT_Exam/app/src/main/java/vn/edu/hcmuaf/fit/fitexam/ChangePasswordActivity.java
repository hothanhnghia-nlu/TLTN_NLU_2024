package vn.edu.hcmuaf.fit.fitexam;

import androidx.activity.OnBackPressedCallback;
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

import vn.edu.hcmuaf.fit.fitexam.R;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.hcmuaf.fit.fitexam.api.APIService;
import vn.edu.hcmuaf.fit.fitexam.common.UserIdCallback;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class ChangePasswordActivity extends AppCompatActivity {
    TextInputEditText edOldPassword, edPassword, edConfPassword;
    TextView tvMessage;
    ImageView btnBack;
    Button btnSave;

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

        btnSave.setOnClickListener(view -> {
            handleChangePassword();
        });

        btnBack.setOnClickListener(view -> {
            showCancelDialog();
        });

        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                showCancelDialog();
            }
        };
        ChangePasswordActivity.this.getOnBackPressedDispatcher().addCallback(this, callback);
    }

    @SuppressLint("SetTextI18n")
    private void handleChangePassword() {
        String oldPassword = edOldPassword.getText().toString();
        String password = edPassword.getText().toString();
        String confPassword = edConfPassword.getText().toString();

        if (oldPassword.isEmpty() || password.isEmpty() || confPassword.isEmpty()) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Vui lòng điền đầy đủ thông tin.");
        } else if (!password.equals(confPassword)) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Mật khẩu xác nhận không đúng.");
        } else {
            Intent intent = new Intent(ChangePasswordActivity.this, LoginActivity.class);
            startActivity(intent);
            finish();
        }
    }

    private void updatePassword(int id, String email, String password) {
        User user = new User(id, password);
        Call<Void> update = APIService.apiService.putUser(id, user);

        update.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Log log = new Log(id, Log.ALERT, getPhoneIpAddress(), "Change password",
                            "Email: " + email + " changes password successful", Log.SUCCESS);
                    addLog(log);

                    Intent intent = new Intent(ChangePasswordActivity.this, LoginActivity.class);
                    startActivity(intent);
                    finish();

                    Toast.makeText(ChangePasswordActivity.this,
                            "Đổi mật khẩu thành công!", Toast.LENGTH_SHORT).show();
                } else {
                    Log log = new Log(id, Log.WARNING, getPhoneIpAddress(), "Change password",
                            "Email: " + email + " changes password failed", Log.FAILED);
                    addLog(log);

                    Toast.makeText(ChangePasswordActivity.this,
                            "Đổi mật khẩu thất bại!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                Toast.makeText(ChangePasswordActivity.this,
                        "Get API Failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void getUserPassword(int userId, final UserIdCallback callback) {
        Call<User> information = APIService.apiService.getUser(userId);

        information.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    User user = response.body();

                    if (user != null) {
                        String userPassword = user.getPassword();
                        callback.onUserIdReceived(userPassword);
                    } else {
                        callback.onUserIdReceived(null);
                    }
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                Toast.makeText(ChangePasswordActivity.this,
                        "Get API Failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void addLog(Log log) {
        Call<Log> passwordLog = APIService.apiService.postLog(log);

        passwordLog.enqueue(new Callback<Log>() {
            @Override
            public void onResponse(Call<Log> call, Response<Log> response) {
                if (response.isSuccessful()) {
                    android.util.Log.e("API_SUCCESS", "Logs: " + response.body());
                }
            }

            @Override
            public void onFailure(Call<Log> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private String getPhoneIpAddress() {
        WifiManager wifiManager = (WifiManager) getApplicationContext().getSystemService(WIFI_SERVICE);
        return Formatter.formatIpAddress(wifiManager.getConnectionInfo().getIpAddress());
    }

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