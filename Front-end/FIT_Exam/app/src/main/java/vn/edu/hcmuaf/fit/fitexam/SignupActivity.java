package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AppCompatActivity;

import vn.edu.hcmuaf.fit.fitexam.R;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.text.format.Formatter;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.textfield.TextInputEditText;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.hcmuaf.fit.fitexam.api.APIService;
import vn.edu.hcmuaf.fit.fitexam.common.UserIdCallback;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class SignupActivity extends AppCompatActivity {
    TextInputEditText edName, edPhone, edEmail, edPassword, edConfPassword;
    Button btnSignup;
    TextView tvMessage, btnLogin;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        edName = findViewById(R.id.fullName);
        edPhone = findViewById(R.id.phoneNumber);
        edEmail = findViewById(R.id.email);
        edPassword = findViewById(R.id.password);
        edConfPassword = findViewById(R.id.confPassword);
        tvMessage = findViewById(R.id.showError);
        btnSignup = findViewById(R.id.btnSignup);
        btnLogin = findViewById(R.id.btnLogin);

        btnSignup.setOnClickListener(view -> {
            if (checkInternetPermission()) {
                handleSignup();
            } else {
                Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
            }
        });

        btnLogin.setOnClickListener(view -> {
            Intent intent = new Intent(SignupActivity.this, LoginActivity.class);
            startActivity(intent);
            finish();
        });

    }

    @SuppressLint("SetTextI18n")
    private void handleSignup() {
        String name = edName.getText().toString();
        String phone = edPhone.getText().toString();
        String email = edEmail.getText().toString();
        String password = edPassword.getText().toString();
        String confPassword = edConfPassword.getText().toString();

//        User user = new User(name, phone, email, password);

        if (name.isEmpty() || phone.isEmpty() || email.isEmpty()
                || password.isEmpty() || confPassword.isEmpty()) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Vui lòng điền đầy đủ thông tin.");
        } else if (!password.equals(confPassword)) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Mật khẩu xác nhận không đúng.");
        } else {
            Intent intent = new Intent(SignupActivity.this, LoginActivity.class);
            startActivity(intent);
            finish();
        }
    }

    private void addUser(User user, String email) {
        Call<User> register = APIService.apiService.register(user);

        register.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                getUserId(email, userId -> {
                    assert userId != null;
                    if (response.isSuccessful()) {
                        Log log = new Log(Integer.parseInt(userId), Log.INFO, getPhoneIpAddress(),
                                "Signup", "Email: " + email + " is signup successful", Log.SUCCESS);
                        addLog(log);

                        Toast.makeText(SignupActivity.this,
                                "Tạo tài khoản thành công!", Toast.LENGTH_SHORT).show();

                        Intent intent = new Intent(SignupActivity.this, LoginActivity.class);
                        startActivity(intent);
                        finish();
                    } else {
                        Log log = new Log(Integer.parseInt(userId), Log.ALERT, getPhoneIpAddress(),
                                "Signup", "Email: " + email + " is signup failed", Log.FAILED);
                        addLog(log);

                        Toast.makeText(SignupActivity.this,
                                "Tạo tài khoản thất bại!", Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                Toast.makeText(SignupActivity.this,
                        "Get API Failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void getUserId(String email, final UserIdCallback callback) {
        Call<String> call = APIService.apiService.getUserId(email);

        call.enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                if (response.isSuccessful()) {
                    String userId = response.body();
                    callback.onUserIdReceived(userId);
                } else {
                    callback.onUserIdReceived(null);
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                callback.onUserIdReceived(null);
            }
        });
    }

    private void addLog(Log log) {
        Call<Log> loginLog = APIService.apiService.postLog(log);

        loginLog.enqueue(new Callback<Log>() {
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

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}