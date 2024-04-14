package vn.edu.hcmuaf.fit.fitexam.api;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.User;

public interface APIService {
    String apiUrl = "";

    HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor()
            .setLevel(HttpLoggingInterceptor.Level.BASIC);

    OkHttpClient.Builder okBuilder = new OkHttpClient.Builder().addInterceptor(interceptor);

    APIService apiService = new Retrofit.Builder()
            .baseUrl(apiUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .client(okBuilder.build())
            .build()
            .create(APIService.class);

    @POST("Register")
    Call<User> register(@Body User user);
    @POST("Login")
    Call<User> loginUser(@Body User user);

    @GET("Users/id/{email}")
    Call<String> getUserId(@Path("email") String email);
    @GET("Users/{id}")
    Call<User> getUser(@Path("id") int id);
    @PUT("Users/{id}")
    Call<Void> putUser(@Path("id") int id, @Body User user);
    @DELETE("Users/{id}")
    Call<Void> deleteUser(@Path("id") int id);

    @POST("Logs")
    Call<Log> postLog(@Body Log log);
}
