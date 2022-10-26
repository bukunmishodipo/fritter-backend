import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

// Extend Like functionality to comments

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including viewing, liking and unliking liked tweets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Like> is the output of the FreetModel() constructor,
 * and contains all the information in Like. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} userId - The user liking the freet
   * @param {Freet} freetId - The freet
   * @return {Promise<HydratedDocument<Like>>} - The newly created liked freet
   */
  static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<HydratedDocument<Like>> {
    const date = new Date();
    const like = new LikeModel({
      userId,
      freetId,
      dateLiked: date,
    });
    await like.save(); // Saves like to MongoDB
    return like.populate('userId', 'freetId');
  }

   /**
   * Find a like by likeId
   *
   * @param {string} likeId - The id of the like to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The freet with the given freetId, if any
   */
    static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
      return LikeModel.findOne({_id: freetId}).populate('userId');
    }
  
    /**
     * Get all the likes in the database
     *
     * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the freets
     */
    static async findAll(): Promise<Array<HydratedDocument<Like>>> {
      // Retrieves freets and sorts them from most to least recent
      return LikeModel.find({}).sort({dateModified: -1}).populate('userId');
    }

  /**
   * Get all likes on a freet
   *
   * @param {Freet} freetId - The freet
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
   static async findLikesByFreet(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    const freet = await FreetCollection.findOne(freetId);
    return LikeModel.find({freetId: freet._id}).populate('userId');
  }

  /**
   * Get all of a users likes in the database
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findLikesByUsername(username: string): Promise<Array<HydratedDocument<Like>>> {
    const user = await UserCollection.findOneByUsername(username);
    return LikeModel.find({userId: user._id}).populate('userId', 'freetId');
  }

  /**
   * Get number of likes on a freet
   *
   * @param {Freet} freetId - The freet
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
   static async numLikes(freetId: Types.ObjectId | string): Promise<Number> {
    const freet = await FreetCollection.findOne(freetId);
    const num = await LikeCollection.findLikesByFreet(freet._id);
    return num.length;
  }

    /**
   * Get users who liked a freet
   *
   * @param {Freet} freetId - The freet
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
     static async findUsersWhoLiked(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Users>>> {
      const likes = await LikeCollection.findLikesByFreet(freetId);
      const users = [];
      for (var val of likes) {
        users.push(val.userId);
      }
      return users;
    }

  /**
   * Remove a freet from a user's likes.
   *
   * @param {string} likeId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(likeId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({_id: likeId});
    return like !== null;
  }
}

export default LikeCollection;
