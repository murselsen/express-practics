import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// 
usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  console.log('User object without password:', obj);
  return obj;
};

const UsersCollection = model('users', usersSchema);

export default UsersCollection;
