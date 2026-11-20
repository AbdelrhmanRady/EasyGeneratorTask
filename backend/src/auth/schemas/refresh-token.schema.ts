import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshTokenEntity>;

@Schema({ collection: 'refresh_tokens' })
export class RefreshTokenEntity {
  @Prop({ required: true, unique: true })
  tokenHash: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenEntity);

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
