using FITExamAPI.Data;
using FITExamAPI.Repository;
using FITExamAPI.Service;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Connect SQL Server Database
builder.Services.AddDbContext<FitExamContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("FITExamDb"));
});

builder.Services.AddCors(p => p.AddPolicy("MyCors", build =>
{
    build.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));

builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Add Scope
builder.Services.AddScoped<AuthRepository, AuthService>();
builder.Services.AddScoped<UserRepository, UserService>();
builder.Services.AddScoped<ImageRepository, ImageService>();
builder.Services.AddScoped<FacultyRepository, FacultyService>();
builder.Services.AddScoped<SubjectRepository, SubjectService>();
builder.Services.AddScoped<ExamRepository, ExamService>();
builder.Services.AddScoped<ResultRepository, ResultService>();
builder.Services.AddScoped<LogRepository, LogService>();

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

app.UseCors("MyCors");

app.UseAuthorization();

app.MapControllers();

app.Run();
