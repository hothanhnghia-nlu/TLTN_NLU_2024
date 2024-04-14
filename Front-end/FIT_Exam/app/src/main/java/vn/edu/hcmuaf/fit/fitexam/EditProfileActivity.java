package vn.edu.hcmuaf.fit.fitexam;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import vn.edu.hcmuaf.fit.fitexam.R;
import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.format.Formatter;
import android.view.ContextThemeWrapper;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.textfield.TextInputEditText;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import de.hdodenhof.circleimageview.CircleImageView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.hcmuaf.fit.fitexam.api.APIService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class EditProfileActivity extends AppCompatActivity {
    TextInputEditText edName, edPhone, edEmail, edDob;
    TextView tvMessage;
    ImageView btnBack;
    Button btnSave;
    AutoCompleteTextView acGender;
    CircleImageView cvProfileImage, cvCamera;
    String[] gender = new String[] {"Nam", "Nữ", "Khác"};
    String selectedGender;
    private static final int REQUEST_IMAGE_PICK = 1;
    private static final int REQUEST_IMAGE_CAPTURE = 2;
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profile);

        edName = findViewById(R.id.fullName);
        edPhone = findViewById(R.id.phoneNumber);
        edEmail = findViewById(R.id.email);
        edDob = findViewById(R.id.dob);
        acGender = findViewById(R.id.gender);
        cvProfileImage = findViewById(R.id.profileImage);
        cvCamera = findViewById(R.id.camera);
        tvMessage = findViewById(R.id.showError);
        btnSave = findViewById(R.id.btnSave);
        btnBack = findViewById(R.id.btnBack);

        if (checkInternetPermission()) {
//            getUserInformation(Integer.parseInt(id));
            getUserGender();
        } else {
            Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        edDob.setOnClickListener(v -> {
            Calendar calendar = Calendar.getInstance();
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH);
            int dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);

            showDateDialog(year, month, dayOfMonth);
        });

        acGender.setOnItemClickListener((parent, view, position, id) -> {
            selectedGender = (String) parent.getItemAtPosition(position);
        });

        cvProfileImage.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            startActivityForResult(intent, REQUEST_IMAGE_PICK);
        });

        cvCamera.setOnClickListener(v -> {
            checkCameraPermission();
        });

        btnSave.setOnClickListener(view -> {
//            updateProfile(Integer.parseInt(id));
            updateProfile();
        });

        btnBack.setOnClickListener(view -> {
            finish();
        });

    }
    private void checkCameraPermission() {
        if (ContextCompat.checkSelfPermission(this, "android.permission.CAMERA")
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{"android.permission.CAMERA"},
                    CAMERA_PERMISSION_REQUEST_CODE);
        } else {
            openCamera();
        }
    }

    private void openCamera() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_IMAGE_PICK && resultCode == RESULT_OK && data != null) {
            Uri selectedImageUri = data.getData();
            if (selectedImageUri != null) {
                cvProfileImage.setImageURI(selectedImageUri);
            }
        } else if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK && data != null) {
            Bundle extras = data.getExtras();
            assert extras != null;
            Bitmap imageBitmap = (Bitmap) extras.get("data");
            cvProfileImage.setImageBitmap(imageBitmap);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openCamera();
            } else {
                Toast.makeText(this, "Lỗi mở máy ảnh", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @SuppressLint("SetTextI18n")
    private void updateProfile() {
        String name = edName.getText().toString();
        String phone = edPhone.getText().toString();
        String email = edEmail.getText().toString();
        String dob = convertDateType(edDob.getText().toString());
        String gender = selectedGender;

        if (name.isEmpty() || phone.isEmpty() || email.isEmpty() || dob.isEmpty() || gender.isEmpty()) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Vui lòng điền đầy đủ thông tin.");
        } else {
            Intent intent = new Intent(this, MainActivity.class);
            startActivity(intent);
            finish();
        }
    }

    private void updateUser(int id, User user) {
        String email = LoginSession.getEmailKey();
        Call<Void> update = APIService.apiService.putUser(id, user);

        update.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Log log = new Log(id, Log.ALERT, getPhoneIpAddress(), "Edit profile",
                            "Email: " + email + " is edited successful", Log.SUCCESS);
                    addLog(log);

                    Toast.makeText(EditProfileActivity.this,
                            "Thông tin cập nhật thành công!", Toast.LENGTH_SHORT).show();

                    finish();
                } else {
                    Log log = new Log(id, Log.WARNING, getPhoneIpAddress(), "Edit profile",
                            "Email: " + email + " is edited failed", Log.FAILED);
                    addLog(log);

                    Toast.makeText(EditProfileActivity.this,
                            "Thông tin cập nhật thất bại!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                Toast.makeText(EditProfileActivity.this,
                        "Get API Failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void addLog(Log log) {
        Call<Log> editLog = APIService.apiService.postLog(log);

        editLog.enqueue(new Callback<Log>() {
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

    private String getPhoneIpAddress() {
        WifiManager wifiManager = (WifiManager) getApplicationContext().getSystemService(WIFI_SERVICE);
        return Formatter.formatIpAddress(wifiManager.getConnectionInfo().getIpAddress());
    }

    private void getUserGender() {
        if (gender != null) {
            ArrayAdapter<String> adapter = new ArrayAdapter<>(this, R.layout.drop_down_item, gender);
            acGender.setAdapter(adapter);
        }
    }

    private void showDateDialog(int year, int month, int dayOfMonth) {
        DatePickerDialog datePickerDialog = new DatePickerDialog(new ContextThemeWrapper(
                EditProfileActivity.this, android.R.style.Theme_Holo_Light_Dialog_MinWidth),
                (view, year1, monthOfYear, dayOfMonth1) -> {
                    String selectedDate = dayOfMonth1 + "/" + (monthOfYear + 1) + "/" + year1;
                    edDob.setText(selectedDate);
                }, year, month, dayOfMonth);

        datePickerDialog.show();
    }

    @SuppressLint("SimpleDateFormat")
    private String convertDateType(String inputDate) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("d/M/yyyy");
        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Date date = inputFormat.parse(inputDate);
            assert date != null;
            return outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Check internet permission
    public boolean checkInternetPermission() {
        ConnectivityManager manager = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}