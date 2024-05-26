using CloudinaryDotNet;
using FITExamAPI.Data;
using FITExamAPI.Helpter;
using FITExamAPI.Repository;
using FITExamAPI.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Connect SQL Server Database
var connectionString = builder.Configuration.GetConnectionString("FITExamDb");
builder.Services.AddDbContext<FitExamContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCors",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Add Scope
builder.Services.AddScoped<AuthRepository, AuthService>();
builder.Services.AddScoped<UserRepository, UserService>();
builder.Services.AddScoped<EmailRepository, EmailService>();
builder.Services.AddScoped<ImageRepository, ImageService>();
builder.Services.AddScoped<FacultyRepository, FacultyService>();
builder.Services.AddScoped<SubjectRepository, SubjectService>();
builder.Services.AddScoped<ExamRepository, ExamService>();
builder.Services.AddScoped<QuestionRepository, QuestionService>();
builder.Services.AddScoped<AnswerRepository, AnswerService>();
builder.Services.AddScoped<ResultRepository, ResultService>();
builder.Services.AddScoped<ResultDetailRepository, ResultDetailService>();
builder.Services.AddScoped<LogRepository, LogService>();

// Cloudinary configuration
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddSingleton(sp =>
{
    var config = sp.GetRequiredService<IOptions<CloudinarySettings>>().Value;
    var account = new Account(config.CloudName, config.ApiKey, config.ApiSecret);
    return new Cloudinary(account);
});

// SMTP configuration
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("MyCors");

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.Run();
