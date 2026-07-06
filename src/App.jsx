import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import api from './services/api'
import './App.css'

function HomePage({ user, onLogout }) {
  return (
    <div className="page-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Hospital appointment system</p>
          <h1>Book care with confidence</h1>
          <p className="hero-copy">
            Patients can browse specialists, schedule appointments, and manage them in one place.
          </p>
        </div>
        <div className="hero-actions">
          {user ? (
            <>
              <span className="pill">Signed in as {user.name}</span>
              <button type="button" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="primary-btn">Login</Link>
              <Link to="/register" className="secondary-btn">Register</Link>
            </>
          )}
        </div>
      </header>

      <section className="grid-cards">
        <article className="card">
          <h2>For patients</h2>
          <p>Find doctors, reserve appointments, and track your bookings.</p>
        </article>
        <article className="card">
          <h2>For doctors</h2>
          <p>Review your schedule and stay updated with patient appointments.</p>
        </article>
        <article className="card">
          <h2>Secure and simple</h2>
          <p>Built with JWT authentication and a REST API backed by MongoDB-ready services.</p>
        </article>
      </section>
    </div>
  )
}

function AuthForm({ mode, onAuthSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', specialization: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : form

      const response = await api.post(endpoint, payload)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      onAuthSuccess(response.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed')
    }
  }

  return (
    <div className="page-shell form-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
        <p className="muted">{mode === 'login' ? 'Access your dashboard' : 'Join the hospital appointment system'}</p>
        {error ? <p className="error">{error}</p> : null}
        {mode === 'register' ? (
          <>
            <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            {form.role === 'doctor' ? (
              <input placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
            ) : null}
          </>
        ) : null}
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="primary-btn">{mode === 'login' ? 'Login' : 'Register'}</button>
        <Link to={mode === 'login' ? '/register' : '/login'} className="text-link">{mode === 'login' ? 'Need an account?' : 'Already registered?'}</Link>
      </form>
    </div>
  )
}

function Dashboard({ user, onLogout }) {
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [message, setMessage] = useState('')

  const loadData = async () => {
    try {
      const [doctorResponse, appointmentResponse] = await Promise.all([
        api.get('/users/doctors'),
        api.get('/appointments'),
      ])
      setDoctors(doctorResponse.data)
      setAppointments(appointmentResponse.data)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load data')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleBook = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await api.post('/appointments', { doctorId, appointmentDate })
      setMessage(response.data.message)
      setAppointmentDate('')
      loadData()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to book appointment')
    }
  }

  const handleCancel = async (id) => {
    try {
      const response = await api.put(`/appointments/${id}/cancel`)
      setMessage(response.data.message)
      loadData()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to cancel appointment')
    }
  }

  const doctorOptions = useMemo(() => doctors.map((doctor) => ({ value: doctor._id, label: `${doctor.name} (${doctor.specialization || 'General'})` })), [doctors])

  return (
    <div className="page-shell dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Welcome, {user?.name}</h2>
          <p className="muted">Role: {user?.role}</p>
        </div>
        <button type="button" onClick={onLogout}>Logout</button>
      </header>

      {message ? <p className="success">{message}</p> : null}

      <section className="dashboard-grid">
        <article className="card wide-card">
          <h3>Book an appointment</h3>
          <form onSubmit={handleBook} className="stacked-form">
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
              <option value="">Select a doctor</option>
              {doctorOptions.map((doctor) => (
                <option key={doctor.value} value={doctor.value}>{doctor.label}</option>
              ))}
            </select>
            <input type="datetime-local" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
            <button type="submit" className="primary-btn">Book appointment</button>
          </form>
        </article>

        <article className="card wide-card">
          <h3>Your appointments</h3>
          {appointments.length === 0 ? (
            <p className="muted">No appointments yet.</p>
          ) : (
            <ul className="list-stack">
              {appointments.map((appointment) => (
                <li key={appointment._id} className="list-item">
                  <div>
                    <strong>{appointment.status}</strong>
                    <p>{new Date(appointment.appointmentDate).toLocaleString()}</p>
                  </div>
                  {appointment.status === 'Booked' ? (
                    <button type="button" onClick={() => handleCancel(appointment._id)}>Cancel</button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}

function AppShell() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <BrowserRouter>
      <nav className="top-nav">
        <Link to="/">Home</Link>
        {user ? <Link to="/dashboard">Dashboard</Link> : <Link to="/login">Login</Link>}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthForm mode="login" onAuthSuccess={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthForm mode="register" onAuthSuccess={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return <AppShell />
}

export default App
