import app from './app.js'
import { connectDB } from './middleware/config/db.js'

const port = process.env.PORT || 5000

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Hospital API running on port ${port}`)
    })
})
