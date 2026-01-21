import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  accounts: {
    provider: string;
    providerAccountId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    role: {
      type: String,
      enum: ['admin', 'editor', 'viewer'],
      default: 'viewer',
    },
    permissions: {
      type: [String],
      default: [],
    },
    accounts: [
      {
        provider: String,
        providerAccountId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Define role-based permissions
UserSchema.pre('save', function (this: IUser) {
  if (this.isModified('role')) {
    switch (this.role) {
      case 'admin':
        this.permissions = [
          'read:all',
          'write:all',
          'delete:all',
          'manage:users',
          'view:analytics',
          'approve:content',
        ];
        break;
      case 'editor':
        this.permissions = [
          'read:all',
          'write:own',
          'write:content',
          'approve:content',
        ];
        break;
      case 'viewer':
        this.permissions = ['read:all'];
        break;
    }
  }
});

export const User = models.User || model<IUser>('User', UserSchema);
