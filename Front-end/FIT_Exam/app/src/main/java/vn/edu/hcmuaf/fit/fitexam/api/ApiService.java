package vn.edu.hcmuaf.fit.fitexam.api;

import java.util.ArrayList;

import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Path;
import retrofit2.http.Query;
import vn.edu.hcmuaf.fit.fitexam.model.Exam;
import vn.edu.hcmuaf.fit.fitexam.model.Faculty;
import vn.edu.hcmuaf.fit.fitexam.model.Log;
import vn.edu.hcmuaf.fit.fitexam.model.Result;
import vn.edu.hcmuaf.fit.fitexam.model.Subject;
import vn.edu.hcmuaf.fit.fitexam.model.User;
import vn.edu.hcmuaf.fit.fitexam.model.utils.UserConst;

public interface ApiService {
    String apiUrl = "http://192.168.1.25/api/";

    HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor()
            .setLevel(HttpLoggingInterceptor.Level.BASIC);

    OkHttpClient.Builder okBuilder = new OkHttpClient.Builder().addInterceptor(interceptor);

    ApiService apiService = new Retrofit.Builder()
            .baseUrl(apiUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .client(okBuilder.build())
            .build()
            .create(ApiService.class);

    @Multipart
    @POST("register")
    Call<User> register(@Part(UserConst.KEY_NAME) RequestBody name,
            @Part(UserConst.KEY_EMAIL) RequestBody email,
            @Part(UserConst.KEY_PHONE) RequestBody phone,
            @Part(UserConst.KEY_PASSWORD) RequestBody password);

    @Multipart
    @POST("login")
    Call<User> login(@Part(UserConst.KEY_EMAIL) RequestBody email,
            @Part(UserConst.KEY_PASSWORD) RequestBody password);

    @GET("users/id")
    Call<String> getUserId(@Query("email") String email);
    @GET("users/{id}")
    Call<User> getUser(@Path(UserConst.KEY_ID) int id);

    @Multipart
    @PUT("users/{id}")
    Call<Void> updateUser(
            @Path(UserConst.KEY_ID) int id,
            @Part(UserConst.KEY_NAME) RequestBody name,
            @Part(UserConst.KEY_PHONE) RequestBody phone,
            @Part(UserConst.KEY_EMAIL) RequestBody email,
            @Part(UserConst.KEY_DOB) RequestBody dob,
            @Part(UserConst.KEY_GENDER) RequestBody gender,
            @Part(UserConst.KEY_FACULTY_ID) RequestBody facultyId,
            @Part MultipartBody.Part avatar);

    @Multipart
    @PUT("users/change-password/{id}")
    Call<Void> changePassword(@Path(UserConst.KEY_ID) int id,
            @Part(UserConst.KEY_PASSWORD) RequestBody password);

    @GET("faculties")
    Call<ArrayList<Faculty>> getAllFaculties();

    @GET("subjects")
    Call<ArrayList<Subject>> getAllSubjects();

    @GET("exams")
    Call<ArrayList<Exam>> getAllExams();
    @GET("exams/subject")
    Call<ArrayList<Exam>> getAllExamsBySubjectId(@Query("id") String id);

    @GET("results")
    Call<ArrayList<Result>> getAllResults();
    @GET("exams/user")
    Call<ArrayList<Result>> getAllResultsByUserId(@Query("id") String id);

    @POST("logs")
    Call<Log> createLog(@Body Log log);
}
