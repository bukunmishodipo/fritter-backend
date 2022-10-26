import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from '../comment/middleware';
import * as util from './util';

const router = express.Router();

/*
 * Get comments on freet.
 *
 * @name GET /api/freets?freetId=id
 *
 * @return {CommentResponse[]} - An array of comments on  freet with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */

router.get(
  '/',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetComments = await CommentCollection.findAllByFreet(req.query.freet as string);
    const response = freetComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new comment.
 *
 * @name POST /api/comments
 *
 * @param {string} content - The content of the comment
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent
    // check if the freet a user is commenting on exists 
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const referenceId = (req.body.freeId as string) // TODO: make front end forms, follow the readme 
    const comment = await CommentCollection.addOne(userId, freetId, req.body.content);

    res.status(201).json({
      message: 'Your comment was created successfully.',
      comment: util.constructCommentResponse(comment)
    });
  }
);

/**
 * Delete a comment
 *
 * @name DELETE /api/comments/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentModifier
  ],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);
export {router as commentRouter};
