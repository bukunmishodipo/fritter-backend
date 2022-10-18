import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import FreetCollection from 'freet/collection';

/**
 * This file defines the properties stored in a liked Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
export type Like = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Freet;
  userId: User; // the user who likes the Freet
  dateLiked: Date; // will be used to sort likes from most to least recent
};

// Mongoose schema definition for interfacing with a MongoDB table
// Likes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB

const LikeSchema = new Schema<Like>({
  // The author userId
  freet:{
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
  },
  // The date the freet was created
  dateLiked: {
    type: Date,
    required: true
  },
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
