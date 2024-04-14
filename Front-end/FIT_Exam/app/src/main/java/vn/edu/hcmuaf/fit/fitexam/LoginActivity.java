package vn.edu.hcmuaf.fit.fitexam;

import static androidx.constraintlayout.helper.widget.MotionEffect.TAG;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.text.format.Formatter;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.identity.BeginSignInRequest;
import com.google.android.gms.auth.api.identity.Identity;
import com.google.android.gms.auth.api.identity.SignInClient;
import com.google.android.gms.auth.api.identity.SignInCredential;
import com.google.android.gms.common.api.ApiException;
import com.google.android.material.textfield.TextInputEditText;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.hcmuaf.fit.fitexam.R;
import vn.edu.hcmuaf.fit.fitexam.api.APIService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.common.UserIdCallback;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class LoginActivity extends AppCompatActivity {
    TextInputEditText edEmail, edPassword;
    Button btnLogin;
    TextView tvMessage, btnSignup, btnForgotPassword;
    RelativeLayout btnLoginGoogle;
    SignInClient oneTapClient;
    BeginSignInRequest signInRequest;
    private static final int REQ_ONE_TAP = 100;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        edEmail = findViewById(R.id.email);
        edPassword = findViewById(R.id.password);
        tvMessage = findViewById(R.id.showError);
        btnLogin = findViewById(R.id.btnLogin);
        btnSignup = findViewById(R.id.btnSignup);
        btnForgotPassword = findViewById(R.id.btnForgotPassword);
        btnLoginGoogle = findViewById(R.id.btnLoginGoogle);

        // Google Sign in
        oneTapClient = Identity.getSignInClient(this);
        signInRequest = BeginSignInRequest.builder()
                .setPasswordRequestOptions(BeginSignInRequest.PasswordRequestOptions.builder()
                        .setSupported(true)
                        .build())
                .setGoogleIdTokenRequestOptions(BeginSignInRequest.GoogleIdTokenRequestOptions.builder()
                        .setSupported(true)
                        .setServerClientId(getString(R.string.web_client_id))
                        .setFilterByAuthorizedAccounts(false)
                        .build())
                .setAutoSelectEnabled(true)
                .build();

        btnLogin.setOnClickListener(view -> {
            if (checkInternetPermission()) {
                handleLogin();
            } else {
                Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
            }
        });

        btnSignup.setOnClickListener(view -> {
            Intent intent = new Intent(LoginActivity.this, SignupActivity.class);
            startActivity(intent);
        });

        btnForgotPassword.setOnClickListener(view -> {
            Intent intent = new Intent(LoginActivity.this, ResetPasswordActivity.class);
            startActivity(intent);
        });

        btnLoginGoogle.setOnClickListener(view -> {
            handleLoginGoogle();
        });
    }

    @SuppressLint("SetTextI18n")
    private void handleLogin() {
        String email = edEmail.getText().toString();
        String password = edPassword.getText().toString();

//        if (email.isEmpty() || password.isEmpty()) {
//            tvMessage.setVisibility(View.VISIBLE);
//            tvMessage.setText("Vui lòng điền đầy đủ thông tin.");
//        } else {
//            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
//            startActivity(intent);
//            finish();
//        }

        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
        startActivity(intent);
        finish();
    }

    private void addUser(String email, String password) {
        User user = new User(email, password);
        Call<User> login = APIService.apiService.loginUser(user);

        login.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                getUserId(email, userId -> {
                    assert userId != null;
                    if (response.isSuccessful()) {
                        LoginSession.saveLoginSession(userId, email, password);

                        Log log = new Log(Integer.parseInt(userId), Log.INFO, getPhoneIpAddress(), "Login",
                                "Email: " + email + " is login successful", Log.SUCCESS);
//                        addLog(log);

                        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(LoginActivity.this,
                                "Đăng nhập không thành công. Vui lòng kiểm tra email và mật khẩu.",
                                Toast.LENGTH_SHORT).show();

                        Log log = new Log(Integer.parseInt(userId), Log.ALERT, getPhoneIpAddress(),
                                "Login", "Email: " + email + " is login failed", Log.FAILED);
                        addLog(log);
                    }
                });
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                Toast.makeText(LoginActivity.this,
                        "Get API Failed", Toast.LENGTH_SHORT).show();
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

    // Login with Google
    private void handleLoginGoogle() {
        oneTapClient.beginSignIn(signInRequest)
                .addOnSuccessListener(this, result -> {
                    try {
                        startIntentSenderForResult(
                                result.getPendingIntent().getIntentSender(), REQ_ONE_TAP,
                                null, 0, 0, 0);
                    } catch (IntentSender.SendIntentException e) {
                        android.util.Log.e(TAG, "Couldn't start One Tap UI: " + e.getLocalizedMessage());
                    }
                })
                .addOnFailureListener(this, e -> {
                    android.util.Log.d(TAG, e.getLocalizedMessage());
                });
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case REQ_ONE_TAP:
                try {
                    SignInCredential credential = oneTapClient.getSignInCredentialFromIntent(data);
                    String idToken = credential.getGoogleIdToken();
                    String username = credential.getId();
                    String password = credential.getPassword();

                    Toast.makeText(this, "Username is " + username, Toast.LENGTH_SHORT).show();

                    if (idToken !=  null) {
                        android.util.Log.d(TAG, "Got ID token.");
                    } else if (password != null) {
                        android.util.Log.d(TAG, "Got password.");
                    }
                } catch (ApiException e) {
                    Toast.makeText(this,
                            "Đăng nhập thất bại, vui lòng thử lại sau!", Toast.LENGTH_SHORT).show();
                }
                break;
        }
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

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}