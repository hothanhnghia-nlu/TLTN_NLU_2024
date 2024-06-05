package vn.edu.hcmuaf.fit.fitexam.common;

import android.content.Context;
import android.util.Log;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import vn.edu.hcmuaf.fit.fitexam.api.ApiService;
import vn.edu.hcmuaf.fit.fitexam.model.User;

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

}
