import mongoose, { Document, Schema } from 'mongoose';

export interface IReferralLink extends Document {
  userId: mongoose.Types.ObjectId;
  referralCode: string;
  shortId: string;
  campaign: string;
  medium: string;
  source: string;
  clicks: number;
  conversions: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralLinkSchema = new Schema<IReferralLink>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  referralCode: {
    type: String,
    required: true,
    index: true
  },
  shortId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  campaign: {
    type: String,
    default: 'default'
  },
  medium: {
    type: String,
    default: 'custom'
  },
  source: {
    type: String,
    default: 'direct'
  },
  clicks: {
    type: Number,
    default: 0
  },
  conversions: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure shortId is unique
ReferralLinkSchema.index({ shortId: 1 }, { unique: true });

// Add compound index for userId and createdAt for efficient querying
ReferralLinkSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.ReferralLink || mongoose.model<IReferralLink>('ReferralLink', ReferralLinkSchema); 