package vn.edu.hcmuaf.fit.fitexam;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.ProgressDialog;
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

import com.bumptech.glide.Glide;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.material.textfield.TextInputEditText;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import de.hdodenhof.circleimageview.CircleImageView;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.common.RealPathUtil;
import vn.edu.hcmuaf.fit.fitexam.model.Faculty;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class EditProfileActivity extends AppCompatActivity {
    TextInputEditText edName, edPhone, edEmail, edDob;
    TextView tvMessage;
    ImageView btnBack;
    Button btnSave;
    ProgressDialog progressDialog;
    AutoCompleteTextView acGender, acFaculty;
    CircleImageView cvProfileImage, btnOpenGallery;
    Uri mUri;
    LoginSession session;
    GoogleSignInOptions gso;
    GoogleSignInClient gsc;
    String[] gender = new String[]{"Nam", "Nữ", "Khác"};
    String[] faculty;
    int[] facultyId;
    String selectedGender, selectedFaculty, selectedDate;
    HashMap<String, Integer> facultyMap = new HashMap<>();
    private static final int REQUEST_IMAGE_PICK = 1;
    private static final int PERMISSION_REQUEST_CODE = 100;

    private final ActivityResultLauncher<Intent> launcherGallery = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult o) {
                    if (o.getResultCode() == Activity.RESULT_OK) {
                        Intent data = o.getData();
                        if (data == null) {
                            return;
                        }
                        Uri uri = data.getData();
                        mUri = uri;
                        try {
                            Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), uri);
                            cvProfileImage.setImageBitmap(bitmap);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            });

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
        acFaculty = findViewById(R.id.faculty);
        cvProfileImage = findViewById(R.id.profileImage);
        btnOpenGallery = findViewById(R.id.btnOpenGallery);
        tvMessage = findViewById(R.id.showError);
        btnSave = findViewById(R.id.btnSave);
        btnBack = findViewById(R.id.btnBack);

        // Google Sign in
        gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.web_client_id))
                .requestEmail()
                .build();

        gsc = GoogleSignIn.getClient(this, gso);

        session = new LoginSession(getApplicationContext());
        String userId = LoginSession.getIdKey();

        if (checkInternetPermission()) {
            getUserInformation(Integer.parseInt(userId));
            getUserGender();
            getFaculty();
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

        acFaculty.setOnItemClickListener((parent, view, position, id) -> {
            selectedFaculty = (String) parent.getItemAtPosition(position);
        });

        btnOpenGallery.setOnClickListener(v -> {
            openGallery();
        });


        progressDialog = new ProgressDialog(this);
        progressDialog.setMessage("Đang cập nhật...");
        progressDialog.setCancelable(false);

        btnSave.setOnClickListener(view -> {
            if (checkInternetPermission()) {
                updateProfile(Integer.parseInt(userId));
            } else {
                Toast.makeText(this, "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
            }
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
        EditProfileActivity.this.getOnBackPressedDispatcher().addCallback(this, callback);
    }

    private void openGallery() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        launcherGallery.launch(Intent.createChooser(intent, "Select Picture"));
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_IMAGE_PICK && resultCode == RESULT_OK && data != null) {
            Uri selectedImageUri = data.getData();
            if (selectedImageUri != null) {
                cvProfileImage.setImageURI(selectedImageUri);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openGallery();
            }
        }
    }

    private void getUserInformation(int id) {
        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<User> userInfo = apiService.getUser(id);

        userInfo.enqueue(new Callback<User>() {
            @Override
            public void onResponse(@NonNull Call<User> call, @NonNull Response<User> response) {
                if (response.isSuccessful()) {
                    User user = response.body();

                    if (user != null) {
                        edName.setText(user.getName());
                        edPhone.setText(user.getPhone());
                        edEmail.setText(user.getEmail());
                        edEmail.setFocusable(false);

                        String gender = user.getGender();
                        acGender.setText(gender);
                        selectedGender = gender;
                        getUserGender();

                        if (user.getDob() != null) {
                            selectedDate = convertSelectedDateType(user.getDob());
                            edDob.setText(selectedDate);
                        }

                        if (user.getFaculty() != null) {
                            String facultyName = user.getFaculty().getName();
                            acFaculty.setText(facultyName);
                            selectedFaculty = facultyName;
                            getFaculty();
                        }

                        String googlePhotoUrl = getPhotoFromGoogleLogIn();
                        if (googlePhotoUrl != null && !googlePhotoUrl.isEmpty()) {
                            Glide.with(getApplicationContext()).load(googlePhotoUrl).into(cvProfileImage);
                        } else if (user.getImage() != null) {
                            String imageUrl = user.getImage().getUrl();
                            Glide.with(getApplicationContext()).load(imageUrl).into(cvProfileImage);
                        }
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<User> call, @NonNull Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    // Google log-in
    private String getPhotoFromGoogleLogIn() {
        String result = "";
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
        if (account != null) {
            Uri photoUrl = account.getPhotoUrl();

            if (photoUrl != null) {
                String avatar = photoUrl.toString();
                result += avatar;
            }
        }
        return result;
    }

    @SuppressLint("SetTextI18n")
    private void updateProfile(int id) {
        String name = edName.getText().toString().trim();
        String phone = edPhone.getText().toString().trim();
        String email = edEmail.getText().toString().trim();
        String dob = convertDateType(selectedDate);
        String gender = selectedGender;
        int facultyId = getFacultyIdByName(selectedFaculty);

        if (name.isEmpty() || phone.isEmpty() || email.isEmpty()) {
            tvMessage.setVisibility(View.VISIBLE);
            tvMessage.setText("Vui lòng điền đầy đủ thông tin.");
        } else {
            progressDialog.show();
            updateUser(id, name, phone, email, dob, gender, facultyId);
        }
    }

    private void updateUser(int id, String txtName, String txtPhone, String txtEmail, String txtDob, String txtGender, int txtFacultyId) {
        String bodyType = "multipart/form-data";
        RequestBody name = RequestBody.create(MediaType.parse(bodyType), txtName);
        RequestBody phone = RequestBody.create(MediaType.parse(bodyType), txtPhone);
        RequestBody email = RequestBody.create(MediaType.parse(bodyType), txtEmail);
        RequestBody dob = RequestBody.create(MediaType.parse(bodyType), txtDob);
        RequestBody gender = RequestBody.create(MediaType.parse(bodyType), txtGender);
        RequestBody facultyId = RequestBody.create(MediaType.parse(bodyType), String.valueOf(txtFacultyId));

        if (mUri != null) {
            String strRealPath = RealPathUtil.getRealPath(this, mUri);
            File file = new File(strRealPath);

            if (file.exists() && file.canRead()) {
                RequestBody requestFile = RequestBody.create(MediaType.parse(bodyType), file);
                MultipartBody.Part avatar = MultipartBody.Part.createFormData("avatar", file.getName(), requestFile);

                handleUpdateUser(id, name, phone, email, dob, gender, facultyId, avatar);
            } else {
                Toast.makeText(this, "Tệp không tồn tại hoặc không đọc được", Toast.LENGTH_SHORT).show();
                progressDialog.dismiss();
            }
        } else {
            handleUpdateUser(id, name, phone, email, dob, gender, facultyId, null);
        }
    }

    private void handleUpdateUser(int id, RequestBody name, RequestBody phone, RequestBody email, RequestBody dob, RequestBody gender, RequestBody facultyId, MultipartBody.Part avatar) {
        String emailSession = LoginSession.getEmailKey();

        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<Void> update = apiService.updateUser(id, name, phone, email, dob, gender, facultyId, avatar);

        update.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                progressDialog.dismiss();
                if (response.isSuccessful()) {
                    Log log = new Log(id, Log.ALERT, getPhoneIpAddress(), "Edit profile",
                            "Email: " + emailSession + " is edited profile successful", Log.SUCCESS);
                    addLog(log);

                    Toast.makeText(EditProfileActivity.this,
                            "Thông tin cập nhật thành công!", Toast.LENGTH_SHORT).show();

                    finish();
                } else {
                    Log log = new Log(id, Log.WARNING, getPhoneIpAddress(), "Edit profile",
                            "Email: " + emailSession + " is edited failed", Log.FAILED);
                    addLog(log);

                    Toast.makeText(EditProfileActivity.this,
                            "Thông tin cập nhật thất bại!", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                progressDialog.dismiss();
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private void addLog(Log log) {
        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<Log> editLog = apiService.createLog(log);

        editLog.enqueue(new Callback<Log>() {
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

    private void getFaculty() {
        Retrofit retrofit = ApiService.getClient(this);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<ArrayList<Faculty>> facultyList = apiService.getAllFaculties();

        facultyList.enqueue(new Callback<ArrayList<Faculty>>() {
            @Override
            public void onResponse(@NonNull Call<ArrayList<Faculty>> call, @NonNull Response<ArrayList<Faculty>> response) {
                if (response.isSuccessful()) {
                    ArrayList<Faculty> faculties = response.body();

                    if (faculties != null) {
                        facultyId = new int[faculties.size()];
                        faculty = new String[faculties.size()];
                        for (int i = 0; i < faculties.size(); i++) {
                            facultyId[i] = faculties.get(i).getId();
                            faculty[i] = faculties.get(i).getName();
                            facultyMap.put(faculty[i], facultyId[i]);
                        }
                        displayFaculty();
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<ArrayList<Faculty>> call, @NonNull Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
            }
        });
    }

    private int getFacultyIdByName(String facultyName) {
        return facultyMap.get(facultyName);
    }

    private void displayFaculty() {
        if (faculty != null) {
            ArrayAdapter<String> adapter = new ArrayAdapter<>(this, R.layout.drop_down_item, faculty);
            acFaculty.setAdapter(adapter);
        }
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
                    selectedDate = dayOfMonth1 + "/" + (monthOfYear + 1) + "/" + year1;
                    edDob.setText(selectedDate);
                }, year, month, dayOfMonth);

        datePickerDialog.show();
    }

    @SuppressLint("SimpleDateFormat")
    private String convertDateType(String inputDate) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("d/M/yyyy");
        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        try {
            Date date = inputFormat.parse(inputDate);
            assert date != null;
            return outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    @SuppressLint("SimpleDateFormat")
    private String convertSelectedDateType(String inputDate) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        SimpleDateFormat outputFormat = new SimpleDateFormat("d/M/yyyy");
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