import React from 'react';
import styles from './App.module.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Registration from './pages/registration/Registration';
import TestPage from './pages/testPage/TestPage';
import ResultPage from './pages/resultPage/ResultPage';
import TestForm from './pages/testForm/TestForm';
import UserTests from './pages/userTests/UserTests';
import TestReview from './pages/testReview/TestReview';


function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' index element={<Home />} />
        <Route path='auth/login' element={<Login />} />
        <Route path='auth/registration' element={<Registration />} />
        <Route path='test/:id' element={<TestPage />} />
        <Route path='test/:id/result' element={<ResultPage />} />
        <Route path='test/create' element={<TestForm />} />
        <Route path='user/myTests' element={<UserTests />} />
        <Route path='test/review/:id' element={<TestReview />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
