import bcrypt from 'bcrypt'

export const memoryStore = {
    users: [],
    appointments: [],
}

let userCounter = 1
let appointmentCounter = 1
const demoPasswordHash = bcrypt.hashSync('123456', 10)

export const seedDemoData = () => {
    if (memoryStore.users.length > 0) {
        return memoryStore
    }

    memoryStore.users.push(
        {
            _id: `user-${userCounter++}`,
            name: 'Dr. Alice Green',
            email: 'alice@hospital.com',
            password: demoPasswordHash,
            role: 'doctor',
            specialization: 'Cardiology',
            createdAt: new Date(),
        },
        {
            _id: `user-${userCounter++}`,
            name: 'Bob Carter',
            email: 'bob@hospital.com',
            password: demoPasswordHash,
            role: 'patient',
            createdAt: new Date(),
        },
    )

    return memoryStore
}

export const getMemoryUserByEmail = (email) =>
    memoryStore.users.find((user) => user.email === email)

export const getMemoryUserById = (id) =>
    memoryStore.users.find((user) => user._id === id)

export const createMemoryUser = (userData) => {
    const user = {
        _id: `user-${userCounter++}`,
        ...userData,
        createdAt: new Date(),
    }
    memoryStore.users.push(user)
    return user
}

export const getMemoryUsersByRole = (role) =>
    memoryStore.users.filter((user) => user.role === role)

export const getMemoryAppointmentsForUser = (userId, role) =>
    memoryStore.appointments.filter((appointment) => {
        if (role === 'doctor') {
            return appointment.doctor?.toString() === userId.toString()
        }
        return appointment.patient?.toString() === userId.toString()
    })

export const getMemoryAppointmentById = (id) =>
    memoryStore.appointments.find((appointment) => appointment._id === id)

export const createMemoryAppointment = (appointmentData) => {
    const appointment = {
        _id: `appointment-${appointmentCounter++}`,
        ...appointmentData,
        createdAt: new Date(),
        status: 'Booked',
    }
    memoryStore.appointments.push(appointment)
    return appointment
}

export const cancelMemoryAppointment = (id) => {
    const appointment = getMemoryAppointmentById(id)
    if (!appointment) {
        return null
    }
    appointment.status = 'Cancelled'
    return appointment
}
