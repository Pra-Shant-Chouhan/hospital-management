import { Link } from 'react-router-dom'

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

export default HomePage
