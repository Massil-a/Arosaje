import { Request, Response } from 'express';
import { ProfilePictureService } from '../services/profilePictureService';

const addProfilePicture = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const file = req.file;
  const result = await ProfilePictureService.addProfilePicture(parseInt(userId), file);
  return res.status(result.status).json(result.body);
};

const getProfilePicture = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await ProfilePictureService.getProfilePicture(parseInt(userId));
  return res.status(result.status).json(result.body);
};

const getMultipleProfilePictures = async (req: Request, res: Response) => {
  const { userIds } = req.body;
  const result = await ProfilePictureService.getMultipleProfilePictures(userIds);
  return res.status(result.status).json(result.body);
};

const updateProfilePicture = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const file = req.file;
  const result = await ProfilePictureService.updateProfilePicture(parseInt(userId), file);
  return res.status(result.status).json(result.body);
};

const resetProfilePicture = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await ProfilePictureService.resetProfilePicture(parseInt(userId));
  return res.status(result.status).json(result.body);
};

export { addProfilePicture, getProfilePicture, getMultipleProfilePictures, updateProfilePicture, resetProfilePicture };
