import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {FreetResponse} from '../freet/util';
import {constructFreetResponse} from '../freet/util';
import type {Like, PopulatedLike} from '../like/model';
import FreetModel from '../freet/model';
import { User } from 'user/model';

// Update this if you add a property to the Freet type!
type LikeResponse = {
  _id: string;
  freet: FreetResponse;
  user: string;
  dateLiked: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Like object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A like
 * @returns {LikeResponse} - The like object formatted for the frontend
 */
const constructLikeResponse = async (like: HydratedDocument<Like>): Promise<LikeResponse> => {
  const likeCopy: PopulatedLike = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const freet = await FreetModel.findById(likeCopy.freetId);
  const {username} = likeCopy.userId;
  delete likeCopy.userId;
  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
    freet: constructFreetResponse(freet),
    user: username,
    dateLiked: formatDate(like.dateLiked)
  };
};

export {
  constructLikeResponse,
  LikeResponse
};
