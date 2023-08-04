// path: frontend\src\MainRoutes.js
import { useContext } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatRoomViewer from "./components/ChatRoomViewer";
import Signup from "./components/SignUp";
import LanguageSwitcher from "./components/LanguageSwitcher";
import AuthContext from "./AuthContext";

const MainRoutes = () => {
    const { isLoggedIn, onLogin, onLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        onLogout();
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        {t('welcome')}
                    </Typography>
                    <LanguageSwitcher />
                    {isLoggedIn ? (
                        <>
                            <Button color="inherit" onClick={handleLogout}>{t('logout')}</Button>
                            <Button color="inherit" component={Link} to="/dashboard">
                                {t('dashboard')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                {t('login')}
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                {t('signup')}
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/signup" element={<Signup onLogin={onLogin} />} />
                <Route path="/login" element={<Login onLogin={onLogin} />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                <Route path="/chat/:chatRoomId" element={<ChatRoomViewer />} />
            </Routes>
        </>
    );
};

export default MainRoutes;