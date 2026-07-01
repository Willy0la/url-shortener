import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'url-shortener', timestamps: true, autoIndex: true })
export class Url {
  @Prop({ type: String, required: true })
  originalUrl!: string;
  @Prop({ type: String, required: true, unique: true })
  shortCode!: string;
  @Prop({ type: Number, default: 0 })
  clickCount!: number;
  @Prop({ type: Date, default: null })
  expiresAt!: Date | null;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner!: Types.ObjectId;
  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
}

export type UrlDocument = Url & Document;
export const UrlSchema = SchemaFactory.createForClass(Url);

UrlSchema.pre<UrlDocument>('save', function () {
  this.isActive = this.expiresAt === null || this.expiresAt > new Date();
});

UrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
