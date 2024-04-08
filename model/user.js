import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    taskDesc: {
        type: String,
        required: true
    },
    reminderTime: { 
        type: Date,
        required: true
    },
    currentTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['remaining', 'completed'],
        default: 'remaining'
    }
});

const userSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: (props) => `${props.value} is not a valid email address!`
        },
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"]
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function(value) {
                return this.password === value;
            },
            message: "Passwords do not match",
        },
    },
    tasks: [taskSchema] 
});

userSchema.pre("save", async function(next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }

        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();

    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);

export default User;
