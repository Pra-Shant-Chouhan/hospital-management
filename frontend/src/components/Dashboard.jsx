import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'

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

export default Dashboard
