package vn.edu.hcmuaf.fit.fitexam;

import static android.content.Context.WIFI_SERVICE;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiManager;
import android.os.Bundle;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.text.format.Formatter;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import de.hdodenhof.circleimageview.CircleImageView;
import retrofit2.Retrofit;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.common.LoginSession;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class ProfileFragment extends Fragment {
    TextView tvName, tvFaculty, tvEmail, tvPhone, tvDob, tvGender;
    RelativeLayout changePassword, editProfile, logout;
    CircleImageView cvProfileImage;
    SwipeRefreshLayout swipeRefreshLayout;
    GoogleSignInOptions gso;
    GoogleSignInClient gsc;
    LoginSession session;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_profile, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout);
        swipeRefreshLayout.setColorSchemeColors(getResources().getColor(R.color.green_nlu));

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        tvName = view.findViewById(R.id.fullName);
        tvFaculty = view.findViewById(R.id.faculty);
        tvEmail = view.findViewById(R.id.email);
        tvPhone = view.findViewById(R.id.phoneNumber);
        tvDob = view.findViewById(R.id.dob);
        tvGender = view.findViewById(R.id.gender);
        cvProfileImage = view.findViewById(R.id.profileImage);
        changePassword = view.findViewById(R.id.changePassword);
        editProfile = view.findViewById(R.id.editProfile);
        logout = view.findViewById(R.id.deleteAccount);

        // Google Sign in
        gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        gsc = GoogleSignIn.getClient(getActivity(), gso);

        session = new LoginSession(getContext());
        String id = LoginSession.getIdKey();

        if (checkInternetPermission()) {
            swipeRefreshLayout.setOnRefreshListener(() -> getUserInformation(Integer.parseInt(id)));

            getUserInformation(Integer.parseInt(id));
            googleLogIn();
        } else {
            Toast.makeText(getActivity(), "Vui lòng kểm tra kết nối mạng...", Toast.LENGTH_SHORT).show();
        }

        editProfile.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), EditProfileActivity.class);
            startActivity(intent);
        });

        changePassword.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), ChangePasswordActivity.class);
            startActivity(intent);
        });

        logout.setOnClickListener(v -> {
            handleLogoutDialog();
        });
    }

    private void getUserInformation(int id) {
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<User> userInfo = apiService.getUser(id);

        userInfo.enqueue(new Callback<User>() {
            @SuppressLint("SetTextI18n")
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    User user = response.body();

                    if (user != null) {
                        tvName.setText(user.getName());
                        tvEmail.setText(user.getEmail());
                        tvPhone.setText(user.getPhone());
                        tvGender.setText(user.getGender());

                        if (user.getDob() != null) {
                            tvDob.setText(convertDateType(user.getDob()));
                        }

                        if (user.getFaculty() != null) {
                            tvFaculty.setText("Khoa " + user.getFaculty().getName());
                        }

                        if (user.getImage() != null) {
                            String imageUrl = user.getImage().getUrl();
                            Glide.with(getContext()).load(imageUrl).into(cvProfileImage);
                        }
                    } else {
                        tvName.setText("Trống");
                        tvEmail.setText("Trống");
                        tvPhone.setText("Trống");
                        tvGender.setText("Trống");
                        tvDob.setText("Trống");
                    }
                }
                swipeRefreshLayout.setRefreshing(false);
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                android.util.Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                swipeRefreshLayout.setRefreshing(false);
            }
        });
    }
    // Google log-in
    private void googleLogIn() {
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(getActivity());
        if (account != null) {
            Uri photoUrl = account.getPhotoUrl();

            if (photoUrl != null) {
                String avatar = photoUrl.toString();
                Glide.with(getContext()).load(avatar).into(cvProfileImage);
            }
        }
    }

    // Handle logout dialog
    @SuppressLint("SetTextI18n")
    private void handleLogoutDialog() {
        Dialog dialog = new Dialog(getActivity());
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(false);
        dialog.setContentView(R.layout.custom_notification_dialog);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);

        TextView tvMessage = dialog.findViewById(R.id.message);
        Button btnYes = dialog.findViewById(R.id.btnSend);
        Button btnNo = dialog.findViewById(R.id.btnCancel);

        tvMessage.setText("Bạn có chắc muốn đăng xuất?");

        btnYes.setOnClickListener(view -> {
            logout();
        });

        btnNo.setOnClickListener(view -> dialog.dismiss());
        dialog.show();
    }

    private void logout() {
        String userId = LoginSession.getIdKey();
        String email = LoginSession.getEmailKey();

        Log log = new Log(Integer.parseInt(userId), Log.INFO, getPhoneIpAddress(), "Logout",
                "Email: " + email + " is logout successful", Log.SUCCESS);
        addLog(log);

        LoginSession.clearSession();
        gsc.signOut();

        Intent intent = new Intent(getActivity(), MainActivity.class);
        startActivity(intent);
        getActivity().finish();
    }

    private void addLog(Log log) {
        Retrofit retrofit = ApiService.getClient(getContext());
        ApiService apiService = retrofit.create(ApiService.class);

        Call<Log> logoutLog = apiService.createLog(log);

        logoutLog.enqueue(new Callback<Log>() {
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
        WifiManager wifiManager = (WifiManager) getActivity()
                .getApplicationContext().getSystemService(WIFI_SERVICE);
        return Formatter.formatIpAddress(wifiManager.getConnectionInfo().getIpAddress());
    }

    @SuppressLint("SimpleDateFormat")
    private String convertDateType(String inputDate) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy");
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
        ConnectivityManager manager = (ConnectivityManager) getActivity()
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}