from django.urls import path
from .views import register, login , create_instructor , instructor_profile,update_instructor_profile,public_instructors,get_instructor_profile
from .views import get_courses,update_course,delete_course,add_video,get_videos,delete_video
from .views import student_courses , student_videos,mark_video_complete,get_completed_videos
from .views import upload_submission,add_feedback,freeze_submission,instructor_submissions,delete_submission
from .views import course_questions,submit_test,add_question,get_questions,update_question,delete_question,get_test_result,instructor_test_results,allow_retake
from .views import all_courses,my_courses,enroll_course
from .views import get_students,get_instructor,update_user,delete_user
from .views import remove_enrollment,admin_allow_retake,admin_student_courses,reset_progress,all_courses_list
from .views import admin_courses,get_instructors,assign_instructor,admin_create_course,save_video_time,get_video_time

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('create_instructor/', create_instructor),
    path('instructor-profile/', instructor_profile),
    path('update-instructor-profile/', update_instructor_profile),
    path('public-instructors/', public_instructors),
    path('view-instructors-profile/<int:id>/', get_instructor_profile),

    # INSTRUCTOR COURSE
    path('admin-create-course/', admin_create_course),
    path('get-courses/', get_courses),
    path('update-course/<int:id>/', update_course),
    path('delete-course/<int:id>/', delete_course),

    # INSTRUCTOR VIDEO
    path('add-video/', add_video),
    path('get-videos/<int:course_id>/', get_videos),
    path('delete-video/<int:id>/', delete_video),

    #STUDENT COURSE
    path('student-courses/', student_courses),
    path('student-videos/<int:id>/', student_videos),
    path('mark-complete/', mark_video_complete),
    path('completed-videos/', get_completed_videos),

    #PRACTICAL VIDEO SUBMISSION
    path('upload-submission/', upload_submission),
    path('freeze-submission/', freeze_submission),
    path('add-feedback/', add_feedback),
    path('instructor-submissions/<int:video_id>/', instructor_submissions),
    path('delete-submission/<int:id>/', delete_submission),

    #TEST
    path('course-questions/<int:course_id>/', course_questions),
    path('submit-test/', submit_test),
    path('add-question/', add_question),
    path('get-questions/<int:course_id>/', get_questions),
    path('delete-question/<int:id>/', delete_question),
    path('update-question/<int:id>/', update_question),
    path('get-test-result/<int:course_id>/', get_test_result),
    path('instructor-test-results/<int:course_id>/',instructor_test_results),
    path('allow-retake/', allow_retake),
    path('all-courses/', all_courses),
    path('enroll-course/', enroll_course),
    path('my-courses/', my_courses),

    #ADMIN 
    path('students/', get_students),
    path('instructors/', get_instructor),
    path('update-user/<int:id>/', update_user),
    path('delete-user/<int:id>/', delete_user),
    path('admin-student-courses/', admin_student_courses),
    path('admin-allow-retake/', admin_allow_retake),
    path('reset-progress/', reset_progress),
    path('remove-enrollment/<int:id>/', remove_enrollment),
    path('all-courses-list/', all_courses_list),
    path('admin-courses/', admin_courses),
    path('get-instructors/', get_instructors),
    path('assign-instructor/', assign_instructor),
    path('save-video-time/', save_video_time),
    path('get-video-time/<int:video_id>/', get_video_time),
    
]
