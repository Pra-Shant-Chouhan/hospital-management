import mongoose from 'mongoose'
import { seedDemoData } from './storage.js'

export let dbMode = 'memory'

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        dbMode = 'memory'
        seedDemoData()
        return { connected: false, mode: 'memory' }
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        })
        dbMode = 'mongo'
        console.log('MongoDB connected')
        return { connected: true, mode: 'mongo' }
    } catch (error) {
        dbMode = 'memory'
        seedDemoData()
        console.warn('MongoDB unavailable, using in-memory storage:', error.message)
        return { connected: false, mode: 'memory', error: error.message }
    }
}
