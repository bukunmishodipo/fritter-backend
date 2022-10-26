import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Comment, PopulatedComment} from '../comment/model';
import type {Freet, PopulatedFreet} from '../freet/model';

// Update this if you add a property to the Freet or Comment type!

type FreetResponse = {
    _id: string;
    author: string;
    dateCreated: string;
    content: string;
    dateModified: string;
  };

type CommentResponse = {
  _id: string;
  user: string;
  freet: string;
  content: string;
  dateCommented: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = (freet: HydratedDocument<Freet>): FreetResponse => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = freetCopy.authorId;
  delete freetCopy.authorId;
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified)
  };
};

export {
  constructFreetResponse
};

/**
 * Transform a raw comment object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
 const constructCommentResponse = (comment: HydratedDocument<Comment>): CommentResponse => {
    const commentCopy: PopulatedComment = {
      ...comment.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const {username} = commentCopy.userId;
    const {content} = commentCopy.freetId;
    delete commentCopy.userId;
    return {
      ...commentCopy, // return all the fields of comment copt
      _id: commentCopy._id.toString(),
      user: username,
      freet: content, // TODO: i want to display other elements of the freet in my frontend but 
      dateCommented: formatDate(comment.dateCommented),
    };
  };
  
  export {
    constructCommentResponse
  };
