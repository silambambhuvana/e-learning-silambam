from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app1.models import User , InstructorProfile
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

#REGISTER
from rest_framework import status
@api_view(['POST'])
def register(request):
    data = request.data

    if User.objects.filter(email=data['email']).exists():
        return Response(
        {'error': 'Email already exists'},
        status=status.HTTP_400_BAD_REQUEST   # 🔥 IMPORTANT
    )

    User.objects.create(
        name=data['name'],
        email=data['email'],
        password=data['password'],
        role='student'
    )
    
    return Response({'message': 'Registered successfully'})

#LOGIN
import jwt
from django.conf import settings
from django.contrib.auth.hashers import check_password

@api_view(['POST'])
def login(request):
    data = request.data

    try:
        user = User.objects.get(email=data['email'])

        if check_password(data['password'], user.password):

            payload = {
                'id': user.id,
                'email': user.email,
                'role': user.role
            }

            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

            return Response({
                'token': token,
                'role': user.role,
                'name': user.name
            })

        else:
            return Response({'error': 'Invalid password'})

    except User.DoesNotExist:
        return Response({'error': 'User not found'})

#INSTRUCTOR 
from app1.models import User, InstructorProfile, Course,Video

@api_view(['POST'])
def create_instructor(request):

    token = request.headers.get('Authorization')  # 🔥 get from header

    if not token:
        return Response({'error': 'Token missing'}, status= 400)

    try:
        import jwt
        from django.conf import settings

        # 🔥 remove "Bearer "
        token = token.split(' ')[1]

        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = User.objects.get(id=decoded['id'])

        if user.role != 'admin':
            return Response({'error': 'Only admin allowed'} , status= 403)

    except Exception as e:
        print("ERROR:", e)
        return Response({'error': 'Invalid token'} , status= 401)

    data = request.data

     # 🔥🔥 ADD THIS (MAIN FIX)
    if User.objects.filter(email=data['email']).exists():
        return Response(
            {'error': 'Email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        new_user = User.objects.create(
        name=data['name'],
        email=data['email'],
        password=data['password'],
        role='instructor'
    )

        InstructorProfile.objects.create(
                    user=new_user,
                    bio="",
                    experience=0,
                    specialization=""
                    )
        print("USER CREATED:", new_user.email)
        print("Instructor + Profile created ✅")

        return Response({'message': 'Instructor created successfully'})

    except Exception as e:
        print("SAVE ERROR:", e)
        return Response({'error': str(e)} , status= 500)
    
#VIEW PROFILE
@api_view(['GET'])
def instructor_profile(request):

    token = request.headers.get('Authorization')

    try:
        import jwt
        from django.conf import settings

        token = token.split(' ')[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        user = User.objects.get(id=decoded['id'])
        profile = InstructorProfile.objects.get(user=user)

        return Response({
            'name': user.name,
            'email': user.email,

            'bio': profile.bio,
            'experience': profile.experience,
            'specialization': profile.specialization,

            # ✅ NEW FIELDS
            'profile_image': profile.profile_image.url if profile.profile_image else None,
            'dob': profile.dob,
            'phone': profile.phone,
            'address': profile.address,
            'achievements': profile.achievements,
        })

    except Exception as e:
        return Response({'error': str(e)})
    
#UPDATE PROFILE
@api_view(['POST'])
def update_instructor_profile(request):

    token = request.headers.get('Authorization')

    try:
        import jwt
        from django.conf import settings

        token = token.split(' ')[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        user = User.objects.get(id=decoded['id'])

        profile, created = InstructorProfile.objects.get_or_create(user=user)

        # ✅ OLD FIELDS
        profile.bio = request.data.get('bio')
        profile.experience = request.data.get('experience') or 0
        profile.specialization = request.data.get('specialization')

        # ✅ NEW FIELDS
        if request.FILES.get('profile_image'):
            profile.profile_image = request.FILES.get('profile_image')

        profile.dob = request.data.get('dob') or None
        profile.phone = request.data.get('phone')
        profile.address = request.data.get('address')
        profile.achievements = request.data.get('achievements')

        profile.save()

        return Response({'message': 'Profile updated successfully ✅'})

    except Exception as e:
        return Response({'error': str(e)})
    
#CREAT COURSE
@api_view(['POST'])
def admin_create_course(request):

    token = request.headers.get('Authorization')

    if not token:
        return Response({'error': 'Token missing'}, status=400)

    try:
        import jwt
        from django.conf import settings

        token = token.split(' ')[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        user = User.objects.get(id=decoded['id'])

        if user.role != 'admin':
            return Response({'error': 'Only admin allowed'}, status=403)

        Course.objects.create(
            title=request.data.get('title'),
            description=request.data.get('description'),
            image=request.FILES.get('image'),  
            instructor=None   # ✅ not assigned yet
        )

        return Response({'message': 'Course created successfully'})

    except Exception as e:
        return Response({'error': str(e)}, status=500)

#VIEW COURSE
@api_view(['GET'])
def get_courses(request):

    token = request.headers.get('Authorization')

    try:
        import jwt
        from django.conf import settings

        token = token.split(' ')[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        instructor = User.objects.get(id=decoded['id'])

        courses = Course.objects.filter(instructor=instructor)

        data = []
        for c in courses:
            data.append({
                'id': c.id,
                'title': c.title,
                'description': c.description,
                "image": c.image.url if c.image else None 
            })

        return Response(data)

    except Exception as e:
        return Response({'error': str(e)})
    
#UPDATE COURSE
@api_view(['POST'])
def update_course(request, id):

    course = Course.objects.get(id=id)

    course.title = request.data.get('title')
    course.description = request.data.get('description')

    # ✅ IMAGE UPDATE (IMPORTANT)
    if request.FILES.get('image'):
        course.image = request.FILES.get('image')

    course.save()

    return Response({'message': 'Course updated'})

#DELETE COURSE
@api_view(['DELETE'])
def delete_course(request, id):

    course = Course.objects.get(id=id)
    course.delete()

    return Response({'message': 'Course deleted'})

#ADD VIEDEO
@api_view(['POST'])
def add_video(request):

    course_id = request.data.get('course_id')

    course = Course.objects.get(id=course_id)

    Video.objects.create(
        course=course,
        title=request.data.get('title'),
        video_file=request.FILES.get('video_file'),
        is_assignment=request.data.get('is_assignment') == 'true'  # ✅ FIX
    )

    return Response({'message': 'Video uploaded'})

#VIEW VIEDEO
@api_view(['GET'])
def get_videos(request, course_id):

    videos = Video.objects.filter(course_id=course_id)

    data = []
    for v in videos:
        data.append({
    'id': v.id,
    'title': v.title,
    'video': v.video_file.url,
    'is_assignment': v.is_assignment   # ✅ ADD THIS LINE
})

    return Response(data)
#DELETE VIEDEO
@api_view(['DELETE'])
def delete_video(request, id):

    video = Video.objects.get(id=id)
    video.delete()

    return Response({'message': 'Video deleted'})


#STUDENT-PAGE 
#COURSE-VIEW
@api_view(['GET'])
def student_courses(request):
    courses = Course.objects.all().values()
    return Response(courses)

#VIEW VIEDEOS
from app1.models import StudentSubmission

@api_view(['GET'])
def student_videos(request, id):

    token = request.headers.get('Authorization')

    import jwt
    from django.conf import settings

    token = token.split(' ')[1]
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

    user = User.objects.get(id=decoded['id'])

     # ❌ BLOCK ACCESS
    if not Enrollment.objects.filter(student=user, course_id=id).exists():
        return Response({"error": "You are not enrolled in this course"})

    videos = Video.objects.filter(course_id=id)

    
    data = []
    for v in videos:

        submission = StudentSubmission.objects.filter(
            student=user,
            video=v
        ).first()

        data.append({
            "id": v.id,
            "title": v.title,
            "video_file": v.video_file.url if v.video_file else "",
            "is_assignment": v.is_assignment,
            "is_frozen": submission.is_frozen if submission else False, # ✅ IMPORTANT
            "feedback": submission.feedback if submission else ""
        })

    return Response(data)

from app1.models import Video, VideoProgress
#SAVE PROGRESS
@api_view(['POST'])
def mark_video_complete(request):

    token = request.headers.get('Authorization')

    if not token:
        return Response({'error': 'Token missing'})

    try:
        import jwt
        from django.conf import settings

        token = token.split(' ')[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        user = User.objects.get(id=decoded['id'])

        video_id = request.data.get('video_id')
        video = Video.objects.get(id=video_id)

        progress, created = VideoProgress.objects.get_or_create(
            user=user,
            video=video
        )

        progress.completed = True
        progress.save()

        return Response({'message': 'Marked as completed'})

    except Exception as e:
        return Response({'error': str(e)})
    
@api_view(['GET'])
def get_completed_videos(request):

    token = request.headers.get('Authorization')

    if not token:
        return Response({'error': 'Token missing'})

    try:
        import jwt
        from django.conf import settings

        token = token.split(' ')[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        user = User.objects.get(id=decoded['id'])

        completed = VideoProgress.objects.filter(
            user=user,
            completed=True
        ).values_list('video_id', flat=True)

        return Response(list(completed))

    except Exception as e:
        return Response({'error': str(e)})
    
from app1.models import StudentSubmission,Feedback
    
#STUDENT PRACTICAL VIEDEO SUBMISSION 
@api_view(['POST'])
def upload_submission(request):

    token = request.headers.get('Authorization')

    import jwt
    from django.conf import settings

    token = token.split(' ')[1]
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

    user = User.objects.get(id=decoded['id'])

    video_id = request.data.get('video_id')
    video = Video.objects.get(id=video_id)

    submission = StudentSubmission.objects.filter(
        student=user,
        video=video
    ).first()

    # 🔥 CHECK FREEZE
    if submission and submission.is_frozen:
        return Response({'error': 'Submission already frozen ❌'})

    # 🔥 CREATE OR UPDATE
    if submission:
        submission.file = request.FILES.get('file')
        submission.save()
    else:
        StudentSubmission.objects.create(
            student=user,
            video=video,
            file=request.FILES.get('file')
        )

    return Response({'message': 'Uploaded successfully'})
    
#   FREEZESUBMISSION
@api_view(['POST'])
def freeze_submission(request):

    token = request.headers.get('Authorization')

    import jwt
    from django.conf import settings

    token = token.split(' ')[1]
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

    user = User.objects.get(id=decoded['id'])

    video_id = request.data.get('video_id')

    submission = StudentSubmission.objects.get(
        student=user,
        video_id=video_id
    )

    submission.is_frozen = True
    submission.save()

    return Response({'message': 'Submission frozen ✅'})

#INSTRUCTOR VEW PRACTICAL VIEDEO
@api_view(['GET'])
def instructor_submissions(request, video_id):

    submissions = StudentSubmission.objects.filter(video_id=video_id)

    data = []
    for s in submissions:
        data.append({
            "id": s.id,
            "student_name": s.student.name,
            "file": s.file.url,
            "is_frozen": s.is_frozen,
            "feedback": s.feedback,
            "video_id": s.video.id
        })

    return Response(data)

#INSTRUCTOR ADD FEEDBACK
@api_view(['POST'])
def add_feedback(request):

    submission_id = request.data.get("submission_id")
    feedback = request.data.get("feedback")

    submission = StudentSubmission.objects.get(id=submission_id)
    submission.feedback = feedback
    submission.save()

    return Response({"message": "Feedback added"})

#DELETE SUBMISSION
@api_view(['DELETE'])
def delete_submission(request, id):
    try:
        submission = StudentSubmission.objects.get(id=id)
        submission.delete()
        return Response({'message': 'Submission deleted'})
    except Exception as e:
        return Response({'error': str(e)})
    
#TEST-QUESTIONS
from app1.models import Question,TestResult
@api_view(['GET'])
def course_questions(request, course_id):
    questions = Question.objects.filter(course_id=course_id)

    data = []
    for q in questions:
        data.append({
            "id": q.id,
            "question": q.question,
            "options": [q.option1, q.option2, q.option3, q.option4]
        })

    return Response(data)

#SUBMIT TEST
@api_view(['POST'])
def submit_test(request):

    token = request.headers.get('Authorization')
    token = token.split(' ')[1]

    import jwt
    from django.conf import settings

    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    user = User.objects.get(id=decoded['id'])

    answers = request.data.get("answers")
    course_id = request.data.get("course_id")

    if not Enrollment.objects.filter(student=user, course_id=course_id).exists():
        return Response({"error": "Enroll first"})

    existing = TestResult.objects.filter(student=user, course_id=course_id).first()

    if existing and not existing.can_retake:
        return Response({"error": "You already attempted the test"})

    score = 0
    review = []   # 🔥 IMPORTANT

    for qid, ans in answers.items():
        q = Question.objects.get(id=qid)

        is_correct = (q.correct_answer == ans)

        if is_correct:
            score += 1

        # 🔥 STORE REVIEW DATA
        review.append({
            "question": q.question,
            "your_answer": ans,
            "correct_answer": q.correct_answer,
            "is_correct": is_correct
        })

    total = len(answers)

    TestResult.objects.update_or_create(
    student=user,
    course_id=course_id,
    defaults={
        "score": score,
        "total": total,
        "can_retake": False,
        "results": review   # ✅ SAVE HERE
    }
)

    return Response({
        "score": score,
        "total": total,
        "review": review   # ✅ ADD THIS
    })

#GET TEST RESULT
@api_view(['GET'])
def get_test_result(request, course_id):

    token = request.headers.get('Authorization')
    token = token.split(' ')[1]

    import jwt
    from django.conf import settings

    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    user = User.objects.get(id=decoded['id'])

    if not Enrollment.objects.filter(student=user, course_id=course_id).exists():
        return Response({"error": "Enroll first"})

    try:
        result = TestResult.objects.get(student=user, course_id=course_id)

        return Response({
            "score": result.score,
            "total": result.total,
            "can_retake": result.can_retake,
            "review": result.results   
        })

    except:
        return Response({"message": "Not attempted"})

#ADDQUESTIONS
@api_view(['POST'])
def add_question(request):

    course_id = request.data.get("course_id")

    Question.objects.create(
        course_id=course_id,
        question=request.data.get("question"),
        option1=request.data.get("option1"),
        option2=request.data.get("option2"),
        option3=request.data.get("option3"),
        option4=request.data.get("option4"),
        correct_answer=request.data.get("correct_answer")
    )

    return Response({"message": "Question added"})

#GET QUESTIONS
@api_view(['GET'])
def get_questions(request, course_id):

    token = request.headers.get('Authorization')

    try:
        import jwt
        from django.conf import settings

        token = token.split(' ')[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        user = User.objects.get(id=decoded['id'])

        # ✅ OPTIONAL: only check for students
        if user.role == "student":
            if not Enrollment.objects.filter(student=user, course_id=course_id).exists():
                return Response({"error": "Enroll first"})

        qs = Question.objects.filter(course_id=course_id)

        data = []
        for q in qs:
            data.append({
                "id": q.id,
                "question": q.question,
                "option1": q.option1,
                "option2": q.option2,
                "option3": q.option3,
                "option4": q.option4,
                "correct_answer": q.correct_answer
            })

        return Response(data)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

#DELETE QUESTIONS
@api_view(['DELETE'])
def delete_question(request, id):
    Question.objects.get(id=id).delete()
    return Response({"message": "Deleted"})

#UPDATE QUESTIONS
@api_view(['POST'])
def update_question(request, id):
    q = Question.objects.get(id=id)

    q.question = request.data.get("question")
    q.option1 = request.data.get("option1")
    q.option2 = request.data.get("option2")
    q.option3 = request.data.get("option3")
    q.option4 = request.data.get("option4")
    q.correct_answer = request.data.get("correct_answer")
    q.save()

    return Response({"message": "Updated"})

#ALLOW RETAKE
@api_view(['POST'])
def allow_retake(request):
    try:
        result_id = request.data.get('result_id')

        result = TestResult.objects.get(id=result_id)
        result.can_retake = True
        result.save()

        return Response({"message": "Retake allowed"})

    except Exception as e:
        return Response({"error": str(e)})
    
#STUDENT _ RESULTS
@api_view(['GET'])
def instructor_test_results(request, course_id):
    try:
        results = TestResult.objects.filter(course_id=course_id)

        data = []
        for r in results:
            data.append({
                "id": r.id,
                "student_name": r.student.name,
                "score": r.score,
                "total": r.total,
                "can_retake": r.can_retake
            })

        return Response(data)

    except Exception as e:
        return Response({"error": str(e)})
    
#ALL COURSE
@api_view(['GET'])
def all_courses(request):
    courses = Course.objects.all()

    data = []
    for c in courses:
        data.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "image": request.build_absolute_uri(c.image.url) if c.image else None
        })

    return Response(data)

#ENROLLMENT
from app1.models import Enrollment
@api_view(['POST'])
def enroll_course(request):

    token = request.headers.get('Authorization')
    token = token.split(' ')[1]

    import jwt
    from django.conf import settings

    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    user = User.objects.get(id=decoded['id'])

    course_id = request.data.get("course_id")

    if Enrollment.objects.filter(student=user, course_id=course_id).exists():
        return Response({"message": "Already enrolled"})

    Enrollment.objects.create(student=user, course_id=course_id)

    return Response({"message": "Enrolled successfully"})

#MY COURSES
from app1.models import Course, Enrollment, Video, VideoProgress

@api_view(['GET'])
def my_courses(request):

    token = request.headers.get('Authorization')
    token = token.split(' ')[1]

    import jwt
    from django.conf import settings

    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    user = User.objects.get(id=decoded['id'])

    enrollments = Enrollment.objects.filter(student=user)

    data = []

    for e in enrollments:
        course = e.course

        total_videos = Video.objects.filter(course=course).count()

        completed_videos = VideoProgress.objects.filter(
            user=user,
            video__course=course,
            completed=True
        ).count()

        progress = 0
        if total_videos > 0:
            progress = int((completed_videos / total_videos) * 100)

        data.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "image": course.image.url if course.image else None ,
            "progress": progress   # ✅ THIS IS IMPORTANT
        })

    return Response(data)

#GET_STUDENTS
@api_view(['GET'])
def get_students(request):

    students = User.objects.filter(role='student')

    data = []
    for s in students:
        data.append({
            "id": s.id,
            "name": s.name,
            "email": s.email
        })

    return Response(data)

#GET_INSTRUCTORS
@api_view(['GET'])
def get_instructor(request):

    instructors = User.objects.filter(role='instructor')

    data = []
    for i in instructors:
        data.append({
            "id": i.id,
            "name": i.name,
            "email": i.email
        })

    return Response(data)

#UPDATE USER
@api_view(['POST'])
def update_user(request, id):

    user = User.objects.get(id=id)

    user.name = request.data.get("name")
    user.email = request.data.get("email")

    user.save()

    return Response({"message": "Updated successfully"})

#DELETE USER
@api_view(['DELETE'])
def delete_user(request, id):

    user = User.objects.get(id=id)
    user.delete()

    return Response({"message": "Deleted successfully"})


#ADMIN STUDENT COURSE MANAGE
@api_view(['GET'])
def admin_student_courses(request):

    data = []

    enrollments = Enrollment.objects.select_related('student', 'course')

    for e in enrollments:
        student = e.student
        course = e.course

        # 🔥 TOTAL VIDEOS
        total_videos = Video.objects.filter(course=course).count()

        # 🔥 COMPLETED VIDEOS
        completed = VideoProgress.objects.filter(
            user=student,
            video__course=course,
            completed=True
        ).count()

        progress = 0
        if total_videos > 0:
            progress = int((completed / total_videos) * 100)

        # 🔥 TEST RESULT
        test = TestResult.objects.filter(
            student=student,
            course=course
        ).first()

        score = f"{test.score}/{test.total}" if test else "Not Attempted"
        status = "Passed" if test and test.score >= test.total * 0.5 else "Failed"

        data.append({
            "id": e.id,
            "student_name": student.name,
            "email": student.email,
            "course_title": course.title,
            "progress": progress,
            "score": score,
            "status": status if test else "Not Attempted"
        })

    return Response(data)

#ALLOW RETAKE 
@api_view(['POST'])
def admin_allow_retake(request):
    enrollment_id = request.data.get("enrollment_id")

    enrollment = Enrollment.objects.get(id=enrollment_id)

    result = TestResult.objects.filter(
        student=enrollment.student,
        course=enrollment.course
    ).first()

    if result:
        result.can_retake = True
        result.save()

    return Response({"message": "Retake allowed"})

#RESET PROGRESS
@api_view(['POST'])
def reset_progress(request):
    enrollment_id = request.data.get("enrollment_id")

    enrollment = Enrollment.objects.get(id=enrollment_id)

    VideoProgress.objects.filter(
        student=enrollment.student,
        video__course=enrollment.course
    ).delete()

    return Response({"message": "Progress reset"})


#REMOBVE ENROLLMENT
@api_view(['DELETE'])
def remove_enrollment(request, id):
    try:
        Enrollment.objects.get(id=id).delete()
        return Response({"message": "Removed successfully"})
    except:
        return Response({"error": "Not found"})


#LIST
@api_view(['GET'])
def all_courses_list(request):
    courses = Course.objects.all()

    data = [
        {
            "id": c.id,
            "title": c.title
        }
        for c in courses
    ]

    return Response(data)

#ADMIN INSTRUCTOR COURSE
@api_view(['GET'])
def admin_courses(request):
    courses = Course.objects.all()

    data = []
    for c in courses:
        data.append({
            "id": c.id,
            "title": c.title,
            "instructor": c.instructor.name if c.instructor else "Not Assigned",
            "instructor_id": c.instructor.id if c.instructor else None
        })

    return Response(data)

#GET INSTRUCTOR LIST
@api_view(['GET'])
def get_instructors(request):
    instructors = User.objects.filter(role='instructor')

    return Response([
        {"id": i.id, "name": i.name}
        for i in instructors
    ])

#ASSIGN INSTRUCTOR
@api_view(['POST'])
def assign_instructor(request):

    course_id = request.data.get("course_id")
    instructor_id = request.data.get("instructor_id")

    try:
        course = Course.objects.get(id=course_id)
        instructor = User.objects.get(id=instructor_id)

        course.instructor = instructor
        course.save()

        return Response({"message": "Instructor assigned ✅"})

    except Exception as e:
        return Response({"error": str(e)})

@api_view(['POST'])
def save_video_time(request):

    token = request.headers.get('Authorization')

    import jwt
    from django.conf import settings

    token = token.split(' ')[1]
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

    user = User.objects.get(id=decoded['id'])

    video_id = request.data.get("video_id")
    time = request.data.get("current_time")

    progress, created = VideoProgress.objects.get_or_create(
        user=user,
        video_id=video_id
    )

    progress.current_time = time
    progress.save()

    return Response({"message": "Time saved"})

@api_view(['GET'])
def get_video_time(request, video_id):

    token = request.headers.get('Authorization')

    import jwt
    from django.conf import settings

    token = token.split(' ')[1]
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

    user = User.objects.get(id=decoded['id'])

    try:
        progress = VideoProgress.objects.get(
            user=user,
            video_id=video_id
        )
        return Response({"current_time": progress.current_time})
    except:
        return Response({"current_time": 0})


@api_view(['GET'])
def public_instructors(request):

    instructors = User.objects.filter(role='instructor')

    data = []

    for inst in instructors:

        profile = InstructorProfile.objects.filter(user=inst).first()

        data.append({
            "id": inst.id,
            "name": inst.name,
            "profile_image": request.build_absolute_uri(profile.profile_image.url) if profile and profile.profile_image else None,
            "bio": profile.bio if profile else "",
            "experience": profile.experience if profile else 0,
            "specialization": profile.specialization if profile else ""
        })

    return Response(data)

@api_view(['GET'])
def get_instructor_profile(request, id):
    try:
        profile = InstructorProfile.objects.get(user__id=id)

        return Response({
            "id": profile.user.id,
            "name": profile.user.name,
            "email": profile.user.email, 
            "experience": profile.experience,
            "specialization": profile.specialization,
            "bio": profile.bio,
            "profile_image": request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else None
        })

    except InstructorProfile.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
