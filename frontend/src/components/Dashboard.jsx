import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'

const sampleDoctors = [
    { _id: 'doctor-1', name: 'Dr. Maya Patel', specialization: 'Cardiology' },
    { _id: 'doctor-2', name: 'Dr. Samuel Ortiz', specialization: 'Neurology' },
]

const sampleAppointments = [
    { _id: 'apt-1', status: 'Booked', appointmentDate: '2026-07-06T10:30:00', patientName: 'Rina M.', doctorName: 'Dr. Maya Patel' },
    { _id: 'apt-2', status: 'Confirmed', appointmentDate: '2026-07-06T14:00:00', patientName: 'Evan T.', doctorName: 'Dr. Samuel Ortiz' },
]

function Dashboard({ user, onLogout }) {
    const [doctors, setDoctors] = useState(sampleDoctors)
    const [appointments, setAppointments] = useState(sampleAppointments)
    const [doctorId, setDoctorId] = useState('')
    const [appointmentDate, setAppointmentDate] = useState('')
    const [message, setMessage] = useState('')
    const [activeEmrTab, setActiveEmrTab] = useState('summary')
    const role = (user?.role || 'patient').toLowerCase()

    const loadData = async () => {
        try {
            const [doctorResponse, appointmentResponse] = await Promise.all([
                api.get('/users/doctors'),
                api.get('/appointments'),
            ])
            const nextDoctors = doctorResponse.data?.length ? doctorResponse.data : sampleDoctors
            const nextAppointments = appointmentResponse.data?.length ? appointmentResponse.data : sampleAppointments
            setDoctors(nextDoctors)
            setAppointments(nextAppointments)
        } catch (error) {
            setDoctors(sampleDoctors)
            setAppointments(sampleAppointments)
            setMessage(error.response?.data?.message || 'Using the demo dashboard view while the service is unavailable.')
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleBook = async (event) => {
        event.preventDefault()
        setMessage('')

        if (!doctorId || !appointmentDate) {
            setMessage('Please select a doctor and appointment time.')
            return
        }

        try {
            const response = await api.post('/appointments', { doctorId, appointmentDate })
            setMessage(response.data.message || 'Appointment booked successfully.')
            setAppointmentDate('')
            loadData()
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to book appointment')
        }
    }

    const handleCancel = async (id) => {
        try {
            const response = await api.put(`/appointments/${id}/cancel`)
            setMessage(response.data.message || 'Appointment canceled.')
            loadData()
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to cancel appointment')
        }
    }

    const doctorOptions = useMemo(() => doctors.map((doctor) => ({ value: doctor._id, label: `${doctor.name} (${doctor.specialization || 'General'})` })), [doctors])

    const roleTitle = role === 'doctor' ? 'Doctor Workspace' : role === 'nurse' ? 'Nurse Station' : role === 'admin' ? 'Admin Dashboard' : 'Patient Portal'

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <header className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(30,41,59,0.08)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0EA5E9]">{roleTitle}</p>
                            <h2 className="mt-2 text-3xl font-semibold text-[#1E293B]">Welcome back, {user?.name || 'Care Team'}</h2>
                            <p className="mt-2 text-sm text-slate-600">Role: {user?.role || 'Patient'}</p>
                        </div>
                        <button type="button" onClick={onLogout} className="rounded-full bg-[#1E293B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2">Logout</button>
                    </div>
                </header>

                {message ? (
                    <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                        {message}
                    </div>
                ) : null}

                {role === 'patient' ? (
                    <>
                        <section className="grid gap-4 md:grid-cols-3" aria-label="Primary patient actions">
                            <button type="button" onClick={() => scrollToSection('book-appointment')} className="rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0EA5E9]">Book Appointment</p>
                                <p className="mt-2 text-lg font-semibold text-[#1E293B]">Reserve a visit</p>
                                <p className="mt-2 text-sm text-slate-600">Choose a doctor and confirm a time in seconds.</p>
                            </button>
                            <button type="button" onClick={() => scrollToSection('lab-results')} className="rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0EA5E9]">View Lab Results</p>
                                <p className="mt-2 text-lg font-semibold text-[#1E293B]">Review recent findings</p>
                                <p className="mt-2 text-sm text-slate-600">Stay informed with clear and timely lab updates.</p>
                            </button>
                            <button type="button" onClick={() => scrollToSection('billing')} className="rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0EA5E9]">Pay Bill</p>
                                <p className="mt-2 text-lg font-semibold text-[#1E293B]">Resolve invoices</p>
                                <p className="mt-2 text-sm text-slate-600">Keep your account balance current with one tap.</p>
                            </button>
                        </section>

                        <section className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
                            <article id="book-appointment" className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 inline-flex rounded-2xl bg-sky-50 p-3 text-[#0EA5E9]" aria-hidden="true">🗓</div>
                                <h3 className="text-xl font-semibold text-[#1E293B]">Book an appointment</h3>
                                <p className="mt-2 text-sm text-slate-600">A calm, accessible experience for your next visit.</p>
                                <form onSubmit={handleBook} className="mt-4 space-y-3">
                                    <label className="block text-sm font-medium text-slate-700" htmlFor="doctor-select">
                                        Choose a doctor
                                        <select id="doctor-select" className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus:border-[#0EA5E9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                                            <option value="">Select a doctor</option>
                                            {doctorOptions.map((doctor) => (
                                                <option key={doctor.value} value={doctor.value}>{doctor.label}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block text-sm font-medium text-slate-700" htmlFor="appointment-date">
                                        Select a time
                                        <input id="appointment-date" className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus:border-[#0EA5E9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2" type="datetime-local" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
                                    </label>
                                    <button type="submit" className="w-full rounded-full bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2">Book appointment</button>
                                </form>
                            </article>

                            <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700" aria-hidden="true">✓</div>
                                <h3 className="text-xl font-semibold text-[#1E293B]">Your appointments</h3>
                                <div id="lab-results" className="mt-4 space-y-3">
                                    {appointments.length === 0 ? (
                                        <p className="text-sm text-slate-500">No appointments yet.</p>
                                    ) : (
                                        appointments.map((appointment) => {
                                            const patientName = appointment.patientName || appointment.patient?.name || 'Unknown patient'
                                            const doctorName = appointment.doctorName || appointment.doctor?.name || 'Unknown doctor'

                                            return (
                                                <div key={appointment._id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{appointment.status}</p>
                                                        <p className="text-sm text-slate-500">{new Date(appointment.appointmentDate).toLocaleString()}</p>
                                                        <p className="mt-1 text-sm text-slate-600">Patient: {patientName}</p>
                                                        <p className="text-sm text-slate-600">Doctor: {doctorName}</p>
                                                    </div>
                                                    {appointment.status === 'Booked' ? (
                                                        <button type="button" onClick={() => handleCancel(appointment._id)} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2">Cancel</button>
                                                    ) : null}
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                                <div id="billing" className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
                                    <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Balance due</p>
                                    <p className="mt-2 text-2xl font-semibold">$124.00</p>
                                    <p className="mt-1 text-sm text-slate-300">Includes the most recent consultation visit.</p>
                                </div>
                            </article>
                        </section>
                    </>
                ) : null}

                {role === 'doctor' ? (
                    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                        <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 inline-flex rounded-2xl bg-sky-50 p-3 text-[#0EA5E9]" aria-hidden="true">🗓</div>
                            <h3 className="text-xl font-semibold text-[#1E293B]">Today&apos;s schedule</h3>
                            <ul className="mt-4 space-y-3" aria-label="Daily patient schedule">
                                {[
                                    { time: '08:30', patient: 'Lina Brooks', reason: 'Follow-up' },
                                    { time: '10:00', patient: 'Mick Chen', reason: 'Cardiac review' },
                                    { time: '13:45', patient: 'Nora Singh', reason: 'Lab consultation' },
                                ].map((visit) => (
                                    <li key={visit.time} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                                        <div>
                                            <p className="font-semibold text-slate-800">{visit.patient}</p>
                                            <p className="text-sm text-slate-600">{visit.reason}</p>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{visit.time}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700" aria-hidden="true">✚</div>
                            <h3 className="text-xl font-semibold text-[#1E293B]">EMR preview</h3>
                            <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="EMR sections">
                                {[
                                    { id: 'summary', label: 'Summary' },
                                    { id: 'notes', label: 'Notes' },
                                    { id: 'orders', label: 'Orders' },
                                ].map((tab) => (
                                    <button key={tab.id} type="button" role="tab" aria-selected={activeEmrTab === tab.id} className={`rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2 ${activeEmrTab === tab.id ? 'bg-[#1E293B] text-white' : 'bg-slate-100 text-slate-700'}`} onClick={() => setActiveEmrTab(tab.id)}>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {activeEmrTab === 'summary' ? (
                                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p className="font-semibold text-slate-900">Patient: Lina Brooks</p>
                                    <p className="mt-2">Diagnosis: Controlled hypertension with mild fatigue.</p>
                                    <p className="mt-1">Last review: 2 days ago.</p>
                                </div>
                            ) : null}
                            {activeEmrTab === 'notes' ? (
                                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p>Medication adherence is improving. Continue low-sodium diet.</p>
                                </div>
                            ) : null}
                            {activeEmrTab === 'orders' ? (
                                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p>Pending: CBC, metabolic panel, and blood pressure log.</p>
                                </div>
                            ) : null}

                            <div className="mt-5 flex flex-wrap gap-3">
                                <button type="button" className="rounded-full bg-[#0EA5E9] px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2">Prescribe</button>
                                <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2">Order Test</button>
                            </div>
                        </article>
                    </section>
                ) : null}

                {role === 'nurse' ? (
                    <section className="rounded-[24px] border border-slate-200 bg-[#1E293B] p-6 text-white shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Ward overview</p>
                                <h3 className="mt-2 text-2xl font-semibold">Active patients</h3>
                            </div>
                            <div className="rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-slate-100">12 monitored patients</div>
                        </div>
                        <ul className="mt-6 space-y-3" aria-label="Nurse station patient list">
                            {[
                                { name: 'Anna Bell', room: 'Room 204', status: 'Medication due', priority: 'High' },
                                { name: 'Noah Reyes', room: 'Room 210', status: 'Vital alert', priority: 'Immediate' },
                                { name: 'Ella Ford', room: 'Room 305', status: 'Room call', priority: 'Medium' },
                            ].map((patient) => (
                                <li key={patient.name} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-semibold">{patient.name}</p>
                                        <p className="text-sm text-slate-300">{patient.room}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-sky-500/20 px-3 py-1 text-sm font-medium text-sky-200">{patient.status}</span>
                                        <span className="rounded-full border border-white/15 px-3 py-1 text-sm font-medium text-slate-100">{patient.priority}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}

                {role === 'admin' ? (
                    <>
                        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {[
                                { label: 'Bed occupancy', value: '86%', detail: '4 beds available' },
                                { label: 'Staff-to-patient ratio', value: '1:8', detail: 'Within target' },
                                { label: 'Revenue today', value: '$38.4k', detail: '+12% from yesterday' },
                                { label: 'Critical bottlenecks', value: '3', detail: '2 ICU transfers pending' },
                            ].map((item) => (
                                <article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                                    <p className="mt-3 text-3xl font-semibold text-[#1E293B]">{item.value}</p>
                                    <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                                </article>
                            ))}
                        </section>

                        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                            <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-[#1E293B]">Daily throughput</h3>
                                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                                    <table className="min-w-full divide-y divide-slate-200" aria-label="Daily throughput table">
                                        <caption className="sr-only">Operational throughput summary</caption>
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Unit</th>
                                                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patients</th>
                                                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Avg wait</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-slate-700">Emergency</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">23</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">12 min</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-slate-700">Radiology</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">18</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">18 min</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-slate-700">ICU</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">9</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">6 min</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </article>

                            <article className="rounded-[24px] border border-slate-200 bg-[#1E293B] p-6 text-white shadow-sm">
                                <h3 className="text-xl font-semibold">Critical operations</h3>
                                <ul className="mt-4 space-y-3">
                                    <li className="rounded-2xl border border-white/10 bg-white/10 p-3">ICU bed handoff pending for 2 patients.</li>
                                    <li className="rounded-2xl border border-white/10 bg-white/10 p-3">Pharmacy restock required for anticoagulants.</li>
                                    <li className="rounded-2xl border border-white/10 bg-white/10 p-3">Lab sample backlog increased by 8% this hour.</li>
                                </ul>
                            </article>
                        </section>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default Dashboard
