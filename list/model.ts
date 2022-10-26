import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import FreetCollection from 'freet/collection';

/**
 * This file defines the properties stored in a liked Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for List on the backend
export type List = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  creatorId: Types.ObjectId; // the user who created the List
  subscriberId: Array<Types.ObjectId>;
  freetIds: Array<Types.ObjectId>;
  dateCreated: Date;
};

export type PopulatedList = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  creatorId: User; // the user creates the list
  subscriberId: Array<User>;
  freetIds: Array<Freet>;
  dateCreated: Date; // will be used to sort lists from most to least recent
};

// Mongoose schema definition for interfacing with a MongoDB table
// lists stored in this table will have these fields, with the
// type given by the type property, inside MongoDB

const ListSchema = new Schema<List>({
  // The author userId
  freetId:{
    type: Schema.Types.ObjectId,
    required: true
  },
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
});

const ListModel = model<List>('List', ListSchema);
export default ListModel;
