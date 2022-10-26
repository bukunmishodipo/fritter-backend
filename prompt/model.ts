import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import FreetCollection from 'freet/collection';

/**
 * This file defines the properties stored in a prompt
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
export type Prompt = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation - maps to a prompt string in frontend
  userId: Types.ObjectId; // the user who answers the prompt
  content: string;
  dateResponded: Date;
  dateModified: Date;
};

export type PopulatedPrompt = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User; // the user who comments on the Freet
  freetId: Freet | Comment; // freet being commented on
  content: string;
  dateCommented: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Likes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB

const PromptSchema = new Schema<Prompt>({
  // The author userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
  },
  dateResponded:{
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // The date the comment was created
  dateCommented: {
    type: Date,
    required: true
  },
});

const CommentModel = model<Comment>('comment', CommentSchema);
export default CommentModel;
