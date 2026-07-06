import jwt from 'jsonwebtoken'

export const generateToken = (user) =>
    jwt.sign(
        { id: user._id || user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'hospital-secret',
        { expiresIn: '1d' },
    )
