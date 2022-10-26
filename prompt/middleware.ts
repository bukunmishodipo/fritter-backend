import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import CommentCollection from '../comment/collection';

const isCommentExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.commentId);
  const comment = validFormat ? await CommentCollection.findOne(req.params.commentId) : '';
  if (!comment) {
    res.status(404).json({
      error: {
        commentNotFound: `Comment with comment ID ${req.params.commentId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose commentId is in req.params
 */
 const isValidCommentModifier = async (req: Request, res: Response, next: NextFunction) => {
  const comment = await CommentCollection.findOne(req.params.commentId);
  const userId = comment.userId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' comments.'
    });
    return;
  }

  next();
};


export {
  isCommentExists,
  isValidCommentModifier
};
