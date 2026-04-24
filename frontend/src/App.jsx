import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from "./components/HomePage";
import AboutPage from './components/AboutPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import AdminHome from './components/AdminHomePage';
import StudentHome from './components/StudentHomePage';
import InstructorHome from './components/InstructorHomePage';
import CreateInstructor from './components/CreateInstructor';
import InstructorProfile from "./components/InstructorProfile";
import AdminCreateCourse from './components/CreateCourse';
import EditCourse from './components/EditCourse';
import CourseDetails from './components/CourseDetails';
import StudentCourse from './components/StudentCoursePage';
import TestPage from './components/TestPage';
import ManageQuestions from './components/ManageQuestions';
import CourseResults from "./components/CourseResults";
import CourseListPage from "./components/CourseListPage";
import ManageStudents from './components/ManageStudents';
import ManageInstructors from './components/ManageInstructors';
import AdminStudentCourses from './components/AdminStudentCourses';
import ManageInstructorCourses from './components/ManageInstructorCourses';
import ViewInstructorProfile from './components/ViewInstructorProfile';
import PublicCourse from './components/PublicCourse';
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/admin" element={<AdminHome/>}/>
        <Route path="/student" element={<StudentHome/>}/>
        <Route path="/instructor" element={<InstructorHome/>}/>
        <Route path="/create_instructor" element={<CreateInstructor/>}/>
        <Route path="/instructor/profile" element={<InstructorProfile />} />
         <Route path="/admin-create-course" element={<AdminCreateCourse />} />
        <Route path="/edit-course/:id" element={<EditCourse />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/student-course/:id" element={<StudentCourse />} />
        <Route path="/test/:id" element={<TestPage />} />
        <Route path="/manage-questions/:id" element={<ManageQuestions />} />
        <Route path="/course-results/:id" element={<CourseResults />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/manage-students" element={<ManageStudents />} />
        <Route path="/manage-instructors" element={<ManageInstructors />} />
        <Route path="/admin-courses" element={<AdminStudentCourses />} />
        <Route path="/manage-instructor-courses" element={<ManageInstructorCourses />} />


        <Route path="/view-instructor/:id" element={<ViewInstructorProfile />} />
        <Route path="/publiccourse" element={<PublicCourse />} />
      </Routes>

    </Router>
  );
}


export default App
