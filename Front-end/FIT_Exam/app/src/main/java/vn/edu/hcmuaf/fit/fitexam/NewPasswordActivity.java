package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.text.format.Formatter;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import vn.edu.hcmuaf.fit.fitexam.R;
import com.google.android.material.textfield.TextInputEditText;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.hcmuaf.fit.fitexam.api.APIService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class NewPasswordActivity extends AppCompatActivity {
    TextInputEditText edPassword, edConfPassword;
    TextView tvMessage;
    Button btnSave;
    String email;
    LoginSession session;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_password);

        edPassword = findViewById(R.id.password);
        edConfPassword = findViewById(R.id.confPassword);
        tvMessage = findViewById(R.id.showError);
        btnSave = findViewById(R.id.btnSave);

        btnSave.setOnClickListener(view -> {
            handleChangePassword();
        });

    }

    @SuppressLint("SetTextI18n")
    private void handleChangePassword() {
        String password = edPassword.getText().toString();
        String confPassword = edConfPassword.getText().toString();

        if (password.isEmpty() || confPassword.isEmpty()) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Vui lòng điền đầy đủ thông tin.");
        } else if (!password.equals(confPassword)) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Mật khẩu xác nhận không đúng.");
        } else {
            Intent intent = new Intent(NewPasswordActivity.this, LoginActivity.class);
            startActivity(intent);
            finish();
        }
    }

    private void updatePassword(int id, String password) {
        User user = new User(id, password);
        Call<Void> update = APIService.apiService.putUser(id, user);

        update.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Log log = new Log(id, Log.ALERT, getPhoneIpAddress(), "Reset password",
                            "Email: " + email + " resets password successful", Log.SUCCESS);
                    addLog(log);

                    LoginSession.clearSession();
                    Intent intent = new Intent(NewPasswordActivity.this, LoginActivity.class);
                    startActivity(intent);
                    finish();

                    Toast.makeText(NewPasswordActivity.this,
                            "Đặt lại mật khẩu thành công!", Toast.LENGTH_SHORT).show();

                } else {
                    Log log = new Log(id, Log.WARNING, getPhoneIpAddress(), "Reset password",
                            "Email: " + email + " resets password failed", Log.FAILED);
                    addLog(log);

                    Toast.makeText(NewPasswordActivity.this,
                            "Đặt lại mật khẩu thất bại!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                Toast.makeText(NewPasswordActivity.this,
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
}