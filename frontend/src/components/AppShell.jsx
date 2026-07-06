import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import HomePage from './HomePage'
import AuthForm from './AuthForm'
import Dashboard from './Dashboard'
import { clearAuthToken } from '../services/api'

function AppShell() {
    const [user, setUser] = useState(null)

    const handleAuthSuccess = (authenticatedUser) => {
        setUser(authenticatedUser)
    }

    const handleLogout = () => {
        clearAuthToken()
        setUser(null)
    }

    return (
        <>
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/" className="text-lg font-semibold text-slate-900">MediCare</Link>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Home</Link>
                        {user ? <Link to="/dashboard" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Dashboard</Link> : <Link to="/login" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Login</Link>}
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
                <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthForm mode="login" onAuthSuccess={handleAuthSuccess} />} />
                <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthForm mode="register" onAuthSuccess={handleAuthSuccess} />} />
                <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            </Routes>
        </>
    )
}

export default AppShell
