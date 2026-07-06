import mongoose from 'mongoose'

export let dbMode = 'memory'

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        dbMode = 'memory'
        return { connected: false, mode: 'memory' }
    }

    try {
        await mongoose.connect(process.env.MONGO_URI)
        dbMode = 'mongo'
        return { connected: true, mode: 'mongo' }
    } catch (error) {
        dbMode = 'memory'
        return { connected: false, mode: 'memory', error: error.message }
    }
}
