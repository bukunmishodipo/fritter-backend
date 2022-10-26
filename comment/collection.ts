import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';
import UserCollection from '../user/collection';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import FreetCollection from '../freet/collection';
import FreetModel from '../freet/model';

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
   * @param {Freet | Comment} referenceId - The freet
   * @param {string} content - content of the comment
   * @return {Promise<HydratedDocument<Comment>>} - The newly created comment
   */
  static async addOne(userId: Types.ObjectId | string, referenceId: Types.ObjectId | string, isComment: boolean, content: string): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    if(FreetModel.findOne({_id: referenceId}) == null){
      isComment = true;
    }
    const comment = new CommentModel({
      userId,
      referenceId,
      isComment,
      content,
      dateCommented: date,
    });
    await comment.save(); // Saves like to MongoDB
    return comment.populate('userId');
  }

  //TODO: fix frontend
    /**
   * Get all the comments in the database
   *
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the freets
   */
     static async findAll(): Promise<Array<HydratedDocument<Comment>>> {
      // Retrieves freets and sorts them from most to least recent
      return CommentModel.find({}).sort({dateCreated: -1}).populate('userId');
    }

   /**
   * Find a comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given referenceId, if any
   */
    static async findOne(commentId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
      return CommentModel.findOne({_id: commentId}).populate('userId');
    }

  /**
   * Gets all comments on the freet in database
   *
   * @param {FreetId_} referenceId - The username of author of the freets
   * @return {Promise<HydratedDocument<Comments>[]>} - An array of all of the freets
   */
  static async findAllByFreet(referenceIdToSearchFor: Types.ObjectId| string): Promise<Array<HydratedDocument<Comment>>> {
    return CommentModel.find({referenceId: referenceIdToSearchFor}).populate('userId');
  }

  // TODO: fix delete in frontend
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
