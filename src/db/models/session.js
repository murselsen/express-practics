import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    // Tokens
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },

    // Token validity times
    accessTokenVaildUntil: { type: Date, required: true },
    refreshTokenVaildUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

const SessionCollection = model('sessions', sessionSchema);

export default SessionCollection;
