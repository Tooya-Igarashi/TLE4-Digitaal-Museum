import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
        username: {type: String, required: true},
        email: {type: String, required: true},
        password: {type:String, required: true, minLength: 8},
        role: {type:String, enum: ["artist", "visitor", "admin"], default: "visitor"},
        premium: {type: Boolean, default: false},
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `${process.env.BASE_URI}/${ret._id}`,
                    },
                    collection: {
                        href: `${process.env.BASE_URI}`
                    },
                };

                delete ret._id;
                delete ret.password;
                delete ret.premium
            }
        }
    }
)

//Hash the password >:D
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};