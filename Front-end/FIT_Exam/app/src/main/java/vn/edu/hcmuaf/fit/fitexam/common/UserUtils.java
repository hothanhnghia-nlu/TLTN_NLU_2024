package vn.edu.hcmuaf.fit.fitexam.common;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;

public class UserUtils {

    public static void getUserId(Context context, String email) {
        getUserIdByEmail(context, email, userId -> {
            if (userId != null) {
                LoginSession.saveIdKeySession(userId);
            }
        });
    }

    public static void getUserIdByEmail(Context context, String email, final UserIdCallback callback) {
        Retrofit retrofit = ApiService.getClient(context);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<String> call = apiService.getUserId(email);

        call.enqueue(new Callback<String>() {
            @Override
            public void onResponse(@NonNull Call<String> call, @NonNull Response<String> response) {
                if (response.isSuccessful()) {
                    String userId = response.body();
                    callback.onUserIdReceived(userId);
                } else {
                    callback.onUserIdReceived(null);
                }
            }

            @Override
            public void onFailure(@NonNull Call<String> call, @NonNull Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                callback.onUserIdReceived(null);
            }
        });
    }

    public static void getUserStatusByEmail(Context context, String email, final UserStatusCallback callback) {
        Retrofit retrofit = ApiService.getClient(context);
        ApiService apiService = retrofit.create(ApiService.class);

        Call<Integer> call = apiService.getUserStatus(email);

        call.enqueue(new Callback<Integer>() {
            @Override
            public void onResponse(@NonNull Call<Integer> call, @NonNull Response<Integer> response) {
                if (response.isSuccessful()) {
                    int status = response.body();
                    callback.onUserStatusReceived(status);
                } else {
                    callback.onUserStatusReceived(-1);
                }
            }

            @Override
            public void onFailure(@NonNull Call<Integer> call, @NonNull Throwable t) {
                Log.e("API_ERROR", "Error occurred: " + t.getMessage());
                callback.onUserStatusReceived(-1);
            }
        });
    }

}
