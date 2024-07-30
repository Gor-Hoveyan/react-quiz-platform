import React from 'react';
import styles from './App.module.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Registration from './pages/registration/Registration';
import TestPage from './pages/testPage/TestPage';
import TestResult from './pages/testResult/TestResult';
import TestForm from './pages/testForm/TestForm';
import UserTests from './pages/userTests/UserTests';
import TestReview from './pages/testReview/TestReview';
import UserProfile from './pages/userProfile/UserProfile';
import Profile from './pages/profile/Profile';
import UserSettings from './pages/userSettings/UserSettings';
import Verification from './pages/verification/Verification';
import QuizForm from './pages/quizForm/QuizForm';
import QuizReview from './pages/quizReview/QuizReview';
import QuizPage from './pages/quizPage/QuizPage';
import QuizResult from './pages/quizResult/QuizResult';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' index element={<Home />} />
        <Route path='auth/login' element={<Login />} />
        <Route path='auth/registration' element={<Registration />} />
        <Route path='test/:id' element={<TestPage />} />
        <Route path='quiz/:id' element={<QuizPage />} />
        <Route path='test/:id/result' element={<TestResult />} />
        <Route path='quiz/:id/result' element={<QuizResult />} />
        <Route path='test/create' element={<TestForm />} />
        <Route path='quiz/create' element={<QuizForm />} />
        <Route path='user/myTests' element={<UserTests />} />
        <Route path='test/review/:id' element={<TestReview />} />
        <Route path='quiz/review/:id' element={<QuizReview />} />
        <Route path='profile' element={<UserProfile />} />
        <Route path='profile/:id' element={<Profile />} />
        <Route path='/settings' element={<UserSettings />} />
        <Route path='/verify' element={<Verification />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;