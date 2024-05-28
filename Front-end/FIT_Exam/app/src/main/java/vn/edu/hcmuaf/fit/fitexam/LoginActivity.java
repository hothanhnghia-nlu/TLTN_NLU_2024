package vn.edu.hcmuaf.fit.fitexam;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.text.format.Formatter;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputEditText;

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

public class LoginActivity extends AppCompatActivity {
    TextInputEditText edEmail, edPassword;
    Button btnLogin;
    TextView tvMessage, btnSignup, btnForgotPassword;
    RelativeLayout btnLoginGoogle;
    GoogleSignInOptions gso;
    GoogleSignInClient gsc;
    private static final int RC_SIGN_IN = 9001;

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
        gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.web_client_id))
                .requestEmail()
                .build();

        gsc = GoogleSignIn.getClient(this, gso);

        String email = LoginSession.getEmailKey();
        if (email != null) {
            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
            startActivity(intent);
            finish();
        }

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
        String email = edEmail.getText().toString().trim();
        String password = edPassword.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Vui lòng nhập email hoặc mật khẩu.");
        } else {
            addUser(email, password);
        }
    }

    private void addUser(String txtEmail, String txtPassword) {
        String bodyType = "multipart/form-data";
        RequestBody email = RequestBody.create(MediaType.parse(bodyType), txtEmail);
        RequestBody password = RequestBody.create(MediaType.parse(bodyType), txtPassword);

        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<User> login = apiService.login(email, password);

        login.enqueue(new Callback<User>() {
            @SuppressLint("SetTextI18n")
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                getUserId(txtEmail, userId -> {
                    if (userId == null) {
                        return;
                    }
                    if (response.isSuccessful()) {
                        LoginSession.saveLoginSession(userId, txtEmail, txtPassword);

                        Log log = new Log(Integer.parseInt(userId), Log.INFO, getPhoneIpAddress(), "Login",
                                "Email: " + txtEmail + " is login successful", Log.SUCCESS);
                        addLog(log);

                        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                        startActivity(intent);
                        finish();
                    } else {
                        tvMessage.setVisibility(View.VISIBLE);
                        tvMessage.setText("Vui lòng kiểm tra lại email và mật khẩu.");

                        Toast.makeText(LoginActivity.this,
                                "Đăng nhập không thành công!", Toast.LENGTH_SHORT).show();

                        Log log = new Log(Integer.parseInt(userId), Log.ALERT, getPhoneIpAddress(),
                                "Login", "Email: " + txtEmail + " is login failed", Log.FAILED);
                        addLog(log);
                    }
                });
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private void addLog(Log log) {
        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<Log> loginLog = apiService.createLog(log);

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
        gsc.signOut().addOnCompleteListener(this, new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@Nullable Task<Void> task) {
                gsc.revokeAccess().addOnCompleteListener(LoginActivity.this, new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@Nullable Task<Void> task) {
                        signIn();
                    }
                });
            }
        });
    }

    private void signIn() {
        Intent intent = gsc.getSignInIntent();
        startActivityForResult(intent, RC_SIGN_IN);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                GoogleSignInAccount account = task.getResult(ApiException.class);
                if (account != null) {
                    handleSignInResult(account);
                }
            } catch (Exception e) {
                Toast.makeText(this,
                        "Đăng nhập thất bại, vui lòng thử lại sau!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void handleSignInResult(GoogleSignInAccount account) {
        String bodyType = "multipart/form-data";
        String txtEmail = account.getEmail();
        String txtName = account.getDisplayName();
        String txtPassword = "googleLogin";

        RequestBody email = RequestBody.create(MediaType.parse(bodyType), txtEmail);
        RequestBody name = RequestBody.create(MediaType.parse(bodyType), txtName);
        RequestBody password = RequestBody.create(MediaType.parse(bodyType), txtPassword);

        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<User> register = apiService.register(name, email, null, password);
        register.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    handleAlertDialog(account);
                } else {
                    handleExistingUser(account);
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private void handleExistingUser(GoogleSignInAccount account) {
        String bodyType = "multipart/form-data";
        String txtEmail = account.getEmail();
        String txtPassword = "googleLogin";

        RequestBody email = RequestBody.create(MediaType.parse(bodyType), txtEmail);
        RequestBody password = RequestBody.create(MediaType.parse(bodyType), txtPassword);

        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<User> login = apiService.login(email, password);
        login.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                getUserId(txtEmail, userId -> {
                    if (userId == null) {
                        return;
                    }
                    if (response.isSuccessful()) {
                        LoginSession.saveLoginSession(userId, txtEmail, txtPassword);

                        Log log = new Log(Integer.parseInt(userId), Log.INFO, getPhoneIpAddress(), "Login",
                                "Email: " + txtEmail + " is login Google successful", Log.SUCCESS);
                        addLog(log);

                        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                        startActivity(intent);
                        finish();
                    } else {
                        Log log = new Log(Integer.parseInt(userId), Log.ALERT, getPhoneIpAddress(),"Login",
                                "Email: " + txtEmail + " is login Google failed", Log.FAILED);
                        addLog(log);
                    }
                });
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private void getUserId(String email, final UserIdCallback callback) {
        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<String> call = apiService.getUserId(email);

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

    // Handle alert dialog
    @SuppressLint("SetTextI18n")
    private void handleAlertDialog(GoogleSignInAccount account) {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.custom_alert_dialog);
        dialog.setCancelable(false);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);

        TextView tvMessage = dialog.findViewById(R.id.message);
        Button btnContinuous = dialog.findViewById(R.id.btnContinuous);

        tvMessage.setText("Đăng nhập Google thành công");
        btnContinuous.setText("Tiếp tục");

        btnContinuous.setOnClickListener(view -> {
            handleExistingUser(account);
        });
        dialog.show();
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}