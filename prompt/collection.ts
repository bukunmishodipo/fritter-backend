import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';
import UserCollection from '../user/collection';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including viewing, liking and unliking liked tweets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Like> is the output of the FreetModel() constructor,
 * and contains all the information in Like. https://mongoosejs.com/docs/typescript.html
 */
class CommentCollection {
  /**
   * Add a comment to the collection
   *
   * @param {string} userId - The user who comments on the freet
   * @param {Freet} freetId - The freet
   * @param {string} content - content of the comment
   * @return {Promise<HydratedDocument<Comment>>} - The newly created comment
   */
  static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      userId,
      freetId,
      content,
      dateCommented: date,
    });
    await comment.save(); // Saves like to MongoDB
    return comment.populate('userId');
  }

   /**
   * Find a comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
    static async findOne(commentId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
      return CommentModel.findOne({_id: commentId}).populate('userId');
    }

  /**
   * Get all comments on the freet in database
   *
   * @param {FreetId_} freetId - The username of author of the freets
   * @return {Promise<HydratedDocument<Comments>[]>} - An array of all of the freets
   */
  static async findAllByFreet(freetId: Types.ObjectId| string): Promise<Array<HydratedDocument<Comment>>> {
    const freet = await FreetCollection.findOne(freetId);
    return CommentModel.find({freet: freet._id}).populate('userId');
  }

  /**
   * Remove a comment
   *
   * @param {string} commentId  - The comment to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const comment = await CommentModel.deleteOne({_id: commentId});
    return comment !== null;
  }
}

export default CommentCollection;
