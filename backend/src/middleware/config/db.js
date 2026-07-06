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
        console.log('MongoDB connected')
        return { connected: true, mode: 'mongo' }
    } catch (error) {
        dbMode = 'memory'
        console.error('MongoDB connection error:', error.message)
        return { connected: false, mode: 'memory', error: error.message }
    }
}
