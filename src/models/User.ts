import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface PaymentInfo {
  amount: number;
  currency: string;
  last4: string;
  paymentMethod: string;
  paymentDate: Date;
}

interface AddressInfo {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface PlanInfo {
  planId: string;
  planAmount: number;
  gstAmount: number;
}

interface WalletInfo {
  balance: number;
  currency: string;
  lastUpdated: Date;
}

interface PreviousRegData {
  address?: AddressInfo;
  plan?: PlanInfo;
  lastUpdated: Date;
}

interface MetadataInfo {
  utmCampaign?: string;
  utmMedium?: string;
  utmSource?: string;
}

export interface IUserPaymentInfo {
  cardType?: string;
  lastFour?: string;
  expMonth?: number;
  expYear?: number;
  stripeCustomerId?: string;
  default?: boolean;
}

export interface IUserSubscription {
  planId?: string;
  planName?: string;
  status?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
}

export interface INotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface IWallet {
  balance: number;
  currency: string;
  transactions?: Array<{
    amount: number;
    type: string;
    description: string;
    date: Date;
    reference?: string;
  }>;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  emailVerificationCode?: string;
  emailVerificationExpires?: Date;
  password: string;
  createdAt: Date;
  status: 'pending' | 'active' | 'suspended';
  paymentCompleted: boolean;
  paymentDate?: Date;
  paymentInfo?: PaymentInfo;
  previousRegData?: PreviousRegData;
  referralCode?: string;
  usedReferralCode?: string;
  referrals: mongoose.Types.ObjectId[];
  referredBy: mongoose.Types.ObjectId;
  referralAncestors: { userId: mongoose.Types.ObjectId; level: number }[];
  referralCount: number;
  totalEarnings: number;
  plan: string;
  planAmount: number;
  updatedAt: Date;
  wallet?: WalletInfo;
  role?: 'user' | 'admin' | 'superadmin';
  photoUrl?: string;
  metadata?: MetadataInfo;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorMethod?: 'sms' | 'email';
  twoFactorCode?: string;
  twoFactorCodeExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  phoneVerificationToken?: string;
  phoneVerificationExpires?: Date;
  paymentInfo?: IUserPaymentInfo[];
  subscriptions?: IUserSubscription[];
  notificationPreferences?: INotificationPreferences;
  wallet?: IWallet;
  usedPromotion?: string[];
  lastLogin?: Date;
  lastIP?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationCode: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralAncestors: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    level: Number
  }],
  referralCount: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  planAmount: {
    type: Number,
    default: 0
  },
  paymentCompleted: {
    type: Boolean,
    default: false
  },
  paymentDate: {
    type: Date,
  },
  paymentInfo: {
    amount: Number,
    currency: String,
    last4: String,
    paymentMethod: String,
    paymentDate: Date,
  },
  previousRegData: {
    address: {
      type: Object,
      default: null
    },
    plan: {
      type: Object,
      default: null
    },
    lastUpdated: {
      type: Date,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  usedReferralCode: {
    type: String
  },
  referrals: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  wallet: {
    balance: Number,
    currency: String,
    lastUpdated: Date
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  photoUrl: {
    type: String,
    default: ''
  },
  metadata: {
    utmCampaign: String,
    utmMedium: String,
    utmSource: String
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  twoFactorMethod: {
    type: String,
    enum: ['sms', 'email'],
    default: 'sms'
  },
  twoFactorCode: {
    type: String,
    select: false
  },
  twoFactorCodeExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  phoneVerificationToken: {
    type: String,
    select: false
  },
  phoneVerificationExpires: {
    type: Date,
    select: false
  },
  paymentInfo: [
    {
      cardType: { type: String },
      lastFour: { type: String },
      expMonth: { type: Number },
      expYear: { type: Number },
      stripeCustomerId: { type: String },
      default: { type: Boolean, default: false }
    }
  ],
  subscriptions: [
    {
      planId: { type: String },
      planName: { type: String },
      status: { type: String, enum: ['active', 'canceled', 'past_due', 'unpaid', 'trialing', 'paused'] },
      currentPeriodEnd: { type: Date },
      cancelAtPeriodEnd: { type: Boolean, default: false },
      stripeSubscriptionId: { type: String }
    }
  ],
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  wallet: {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    transactions: [
      {
        amount: { type: Number, required: true },
        type: { type: String, required: true, enum: ['credit', 'debit'] },
        description: { type: String, required: true },
        date: { type: Date, default: Date.now },
        reference: { type: String }
      }
    ]
  },
  usedPromotion: [{ type: String }],
  lastLogin: {
    type: Date
  },
  lastIP: {
    type: String
  }
});

// Pre-save middleware to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate referral code
UserSchema.pre('save', function (next) {
  if (!this.referralCode && this.isNew) {
    this.referralCode = crypto.randomBytes(6).toString('hex').toUpperCase();
  }
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 