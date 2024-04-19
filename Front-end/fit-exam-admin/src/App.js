import HomePage from "./Pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ProfilePage from "./Pages/ProfilePage";
import EditProfilePage from "./Pages/EditProfilePage";
import ExamPage from "./Pages/ExamPage";
import SubjectPage from "./Pages/SubjectPage";
import StudentPage from "./Pages/StudentPage";
import TeacherPage from "./Pages/TeacherPage";
import QuestionBankPage from "./Pages/QuestionBankPage";
import LogPage from "./Pages/LogPage";
import FacultyPage from "./Pages/FacultyPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/my-profile" element={<ProfilePage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/students" element={<StudentPage />} />
                <Route path="/teachers" element={<TeacherPage />} />
                <Route path="/faculties" element={<FacultyPage />} />
                <Route path="/exams" element={<ExamPage />} />
                <Route path="/subjects" element={<SubjectPage />} />
                <Route path="/question-bank" element={<QuestionBankPage />} />
                <Route path="/logs" element={<LogPage />} />
            </Routes>
        </Router>
    );
}

export default App;
