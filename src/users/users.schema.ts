import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, autoIndex: true, collection: 'url-user' })
export class User {
  @Prop({ type: String, required: true, minlength: 1 })
  fullName!: string;

  @Prop({ unique: true, type: String, required: true, trim: true })
  email!: string;

  @Prop({ unique: true, type: String, required: true, trim: true })
  userName!: string;

  @Prop({ required: true, type: String })
  password!: string;
  @Prop({ required: true, type: String })
  pinCode!: string;

  @Prop({ required: true, unique: true, type: String })
  phoneNumber!: string;

  @Prop({ type: Date, default: null })
  lockedUntil!: Date | null;
  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;
  @Prop({ type: Number, default: 0 })
  retry!: number;
  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', function () {
  this.isActive = this.deletedAt === null;
  if (this.lockedUntil && this.lockedUntil < new Date()) {
    this.lockedUntil = null;
    this.retry = 0;
  }
});
