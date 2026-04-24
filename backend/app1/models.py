from django.db import models
from django.contrib.auth.hashers import make_password


class User(models.Model):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email


# INSTRUCTOR DASHBOARD
class InstructorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    bio = models.TextField(blank=True)
    experience = models.IntegerField(default=0)
    specialization = models.CharField(max_length=100, blank=True)

    # ✅ NEW FIELDS
    profile_image = models.ImageField(upload_to='instructor_profiles/', null=True, blank=True)

    dob = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    achievements = models.TextField(blank=True)

    def __str__(self):
        return self.user.email

class Course(models.Model):
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # ✅ FIX
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='course_images/', null=True, blank=True)  # ✅ ADD THIS
    created_at = models.DateTimeField(auto_now_add=True)

class Video(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    video_file = models.FileField(upload_to='videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_assignment = models.BooleanField(default=False)

class StudentVideo(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    video_file = models.FileField(upload_to='student_videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class StudentSubmission(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    file = models.FileField(upload_to="submissions/")
    is_frozen = models.BooleanField(default=False)
    feedback = models.TextField(blank=True, null=True)

class VideoProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey('Video', on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
# ✅ NEW FIELD (ADD THIS ONLY)
    current_time = models.FloatField(default=0)

    def __str__(self):
        return f"{self.user} - {self.video}"


class Feedback(models.Model):
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    student_video = models.ForeignKey(StudentVideo, on_delete=models.CASCADE)
    comment = models.TextField()

class Question(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    question = models.TextField()
    option1 = models.CharField(max_length=200)
    option2 = models.CharField(max_length=200)
    option3 = models.CharField(max_length=200)
    option4 = models.CharField(max_length=200)
    correct_answer = models.CharField(max_length=200)

class TestResult(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    score = models.IntegerField()
    total = models.IntegerField()
    can_retake = models.BooleanField(default=False)
    results = models.JSONField(default=list) 

#ENROLLEMENT 

class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)