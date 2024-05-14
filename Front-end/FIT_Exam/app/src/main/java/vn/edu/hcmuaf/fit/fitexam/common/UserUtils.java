package vn.edu.hcmuaf.fit.fitexam.common;

import android.util.Log;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public class UserUtils {

    public static void getUserId(String email) {
        getUserIdByEmail(email, userId -> {
            if (userId != null) {
                LoginSession.saveIdKeySession(userId);
            }
        });
    }

    public static void getUserIdGoogle(String email) {
        getUserIdByEmail(email, userId -> {
            if (userId != null) {
                LoginSession.saveLoginSession(userId, email, "");
            }
        });
    }

    public static void getUserIdByEmail(String email, final UserIdCallback callback) {
        Call<String> call = ApiService.apiService.getUserId(email);

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
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                callback.onUserIdReceived(null);
            }
        });
    }

    public static String getUserEmail(int id) {
        final StringBuilder builder = new StringBuilder();
        getUserEmailById(id, email -> {
            if (email != null) {
                builder.append(email);
            }
        });
        return builder.toString();
    }

    public static void getUserEmailById(int id, final UserIdCallback callback) {
        Call<User> call = ApiService.apiService.getUser(id);

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    User user = response.body();
                    assert user != null;
                    String email = user.getEmail();
                    callback.onUserIdReceived(email);
                } else {
                    callback.onUserIdReceived(null);
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                callback.onUserIdReceived(null);
            }
        });
    }
}
