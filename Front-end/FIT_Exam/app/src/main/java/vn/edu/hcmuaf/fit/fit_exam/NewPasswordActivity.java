package vn.edu.hcmuaf.fit.fit_exam;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.android.material.textfield.TextInputEditText;

public class NewPasswordActivity extends AppCompatActivity {
    TextInputEditText edPassword, edConfPassword;
    TextView tvMessage;
    Button btnSave;

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
}