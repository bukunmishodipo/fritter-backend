import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {LikeResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get comments user.
 *
 * @name GET /api/freets?authorId=id
 *
 * @return {LikeResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.user !== undefined) {
      next();
      return;
    }

    const allLikes = await LikeCollection.findAll();
    const response = allLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const authorLikes = await LikeCollection.findLikesByUsername(req.query.author as string);
    const response = authorLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new like.
 *
 * @name POST /api/likes
 *
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await LikeCollection.addOne(userId, req.params.freetId); //TODO

    res.status(201).json({
      message: 'Your like was created successfully.',
      freet: util.constructLikeResponse(freet)
    });
  }
);

/**
 * Delete a like (Unlike)
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    likeValidator.isLikeExists,
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);

export {router as likeRouter};
