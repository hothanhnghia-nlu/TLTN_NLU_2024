package vn.edu.hcmuaf.fit.fitexam;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;

import vn.edu.hcmuaf.fit.fitexam.R;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import de.hdodenhof.circleimageview.CircleImageView;

public class ProfileFragment extends Fragment {
    TextView tvName, tvFaculty, tvEmail, tvPhone, tvDob, tvGender;
    RelativeLayout changePassword, editProfile, logout;
    CircleImageView cvProfileImage;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_profile, container, false);
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

        String id = "";

        if (checkInternetPermission()) {
//            getUserInformation(Integer.parseInt(id));
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

    }

    // Handle display logout dialog
    @SuppressLint("SetTextI18n")
    private void handleLogoutDialog() {
        Dialog dialog = new Dialog(getActivity());
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(false);
        dialog.setContentView(R.layout.custom_logout_dialog);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);

        TextView tvMessage = dialog.findViewById(R.id.message);
        Button btnYes = dialog.findViewById(R.id.btnSend);
        Button btnNo = dialog.findViewById(R.id.btnCancel);

        tvMessage.setText("Bạn có chắc muốn đăng xuất?");

        btnYes.setOnClickListener(view -> {
            Intent intent = new Intent(getActivity(), LoginActivity.class);
            startActivity(intent);
            getActivity().finish();
        });

        btnNo.setOnClickListener(view -> dialog.dismiss());
        dialog.show();
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