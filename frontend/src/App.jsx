import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import api, { clearAuthToken, setAuthToken } from './services/api'

function HomePage({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="overflow-hidden rounded-[36px] border border-slate-200/80 bg-white/85 shadow-[0_30px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-14">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-cyan-600" />
                Premium Care Booking Platform
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Feel cared for from the very first click.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Book trusted appointments, discover top specialists, and stay on top of every visit with a beautiful, intelligent care experience.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {user ? (
                  <>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      Signed in as {user.name}
                    </span>
                    <button type="button" onClick={onLogout} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
                      Login
                    </Link>
                    <Link to="/register" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Today</p>
                  <p className="text-xl font-semibold">Dr. Alice Green</p>
                </div>
                <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-300">
                  Available
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Next Appointment</p>
                  <p className="mt-1 text-lg font-semibold">10:30 AM • Cardiology</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Patient Satisfaction</p>
                  <p className="mt-1 text-lg font-semibold">98%</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-2xl bg-cyan-50 p-3 text-cyan-600">✚</div>
            <h2 className="text-xl font-semibold text-slate-900">For patients</h2>
            <p className="mt-3 text-slate-600">Browse specialists, reserve time with your doctor, and manage follow-ups in one calm place.</p>
          </article>
          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-600">❤</div>
            <h2 className="text-xl font-semibold text-slate-900">For doctors</h2>
            <p className="mt-3 text-slate-600">Review upcoming visits, track patient appointments, and keep your schedule in sync.</p>
          </article>
          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-2xl bg-violet-50 p-3 text-violet-600">⚡</div>
            <h2 className="text-xl font-semibold text-slate-900">Secure and simple</h2>
            <p className="mt-3 text-slate-600">Authenticated booking flows backed by a modern MERN stack and protected APIs.</p>
          </article>
        </section>
      </div>
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
      setAuthToken(response.data.token)
      onAuthSuccess(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_40%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">MediCare</p>
            <h2 className="mt-4 text-3xl font-semibold">Your healthcare journey, beautifully simplified.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">Secure access, smart booking, and a calm experience tailored for every patient and doctor.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
            <p className="font-semibold">24/7 care support</p>
            <p className="mt-1 text-slate-300">Always ready for your next appointment.</p>
          </div>
        </div>

        <form className="p-8 sm:p-10" onSubmit={handleSubmit}>
          <div className="mb-6 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">{mode === 'login' ? 'Welcome back' : 'Create account'}</p>
            <h2 className="text-3xl font-semibold text-slate-900">{mode === 'login' ? 'Access your portal' : 'Join the care team'}</h2>
            <p className="text-sm text-slate-500">{mode === 'login' ? 'Sign in to manage appointments and visits.' : 'Book appointments and track your care journey.'}</p>
          </div>
          {error ? <p className="mb-4 text-sm font-medium text-rose-600">{error}</p> : null}
          {mode === 'register' ? (
            <>
              <input className="mb-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <select className="mb-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
              {form.role === 'doctor' ? (
                <input className="mb-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
              ) : null}
            </>
          ) : null}
          <input className="mb-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="mb-3 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" className="mt-2 w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">{mode === 'login' ? 'Login' : 'Register'}</button>
          <Link to={mode === 'login' ? '/register' : '/login'} className="mt-4 block text-center text-sm font-medium text-blue-600">{mode === 'login' ? 'Need an account?' : 'Already registered?'}</Link>
        </form>
      </div>
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.16),_transparent_28%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[32px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_25px_100px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Dashboard</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Welcome, {user?.name}</h2>
              <p className="mt-2 text-sm text-slate-500">Role: {user?.role}</p>
            </div>
            <button type="button" onClick={onLogout} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">Logout</button>
          </div>
        </header>

        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p> : null}

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">🗓</div>
            <h3 className="text-xl font-semibold text-slate-900">Book an appointment</h3>
            <form onSubmit={handleBook} className="mt-4 space-y-3">
              <select className="w-full rounded-2xl border border-slate-300 px-4 py-3" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                <option value="">Select a doctor</option>
                {doctorOptions.map((doctor) => (
                  <option key={doctor.value} value={doctor.value}>{doctor.label}</option>
                ))}
              </select>
              <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" type="datetime-local" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
              <button type="submit" className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Book appointment</button>
            </form>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-600">✓</div>
            <h3 className="text-xl font-semibold text-slate-900">Your appointments</h3>
            {appointments.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No appointments yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {appointments.map((appointment) => {
                  const patientName = appointment.patientName || appointment.patient?.name || 'Unknown patient'
                  const doctorName = appointment.doctorName || appointment.doctor?.name || 'Unknown doctor'

                  return (
                    <li key={appointment._id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-800">{appointment.status}</p>
                        <p className="text-sm text-slate-500">{new Date(appointment.appointmentDate).toLocaleString()}</p>
                        <p className="mt-1 text-sm text-slate-600">Patient: {patientName}</p>
                        <p className="text-sm text-slate-600">Doctor: {doctorName}</p>
                      </div>
                      {appointment.status === 'Booked' ? (
                        <button type="button" onClick={() => handleCancel(appointment._id)} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancel</button>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </article>
        </section>
      </div>
    </div>
  )
}

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
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

function App() {
  return <AppShell />
}

export default App
