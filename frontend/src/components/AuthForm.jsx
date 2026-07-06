import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../services/api'

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

export default AuthForm
