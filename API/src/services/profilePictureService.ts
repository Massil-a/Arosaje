import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { bucket } from '../firebase/firebase';
import path from 'path';

class ProfilePictureService {
  static async addProfilePicture(userId: number, file: any) {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { idUsers: userId } });
      if (!user) return { status: 404, body: { message: 'User not found' } };

      const filename = `${userId}_pp${path.extname(file.originalname)}`;
      const fileUpload = bucket.file(filename);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      return { status: 200, body: { message: 'Profile picture uploaded successfully', filename } };
    } catch (error) {
      console.error('Error in addProfilePicture:', error);
      return { status: 500, body: { message: 'Internal server error' } };
    }
  }

  static async getProfilePicture(userId: number) {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { idUsers: userId } });
      if (!user) return { status: 404, body: { message: 'User not found' } };

      const filename = `${userId}_pp`;
      const file = bucket.file(filename);
      const [exists] = await file.exists();
      if (!exists) return { status: 404, body: { message: 'Profile picture not found' } };

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2050',
      });

      return { status: 200, body: { url } };
    } catch (error) {
      console.error('Error in getProfilePicture:', error);
      return { status: 500, body: { message: 'Internal server error' } };
    }
  }

  static async getMultipleProfilePictures(userIds: number[]) {
    try {
      const userRepository = getRepository(User);
      const files = userIds.map(userId => `${userId}_pp`);
      const urls = await Promise.all(files.map(async (filename) => {
        const file = bucket.file(filename);
        const [exists] = await file.exists();
        if (exists) {
          const [url] = await file.getSignedUrl({ action: 'read', expires: '01-01-2050' });
          return { userId: parseInt(filename.split('_')[0]), url };
        }
        return null;
      }));

      return { status: 200, body: urls.filter(url => url !== null) };
    } catch (error) {
      console.error('Error in getMultipleProfilePictures:', error);
      return { status: 500, body: { message: 'Internal server error' } };
    }
  }

  static async updateProfilePicture(userId: number, file: any) {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { idUsers: userId } });
      if (!user) return { status: 404, body: { message: 'User not found' } };

      const oldFilename = `${userId}_pp`;
      const oldFile = bucket.file(oldFilename);
      await oldFile.delete().catch(() => {}); // Ignore if file does not exist

      const newFilename = `${userId}_pp${path.extname(file.originalname)}`;
      const newFileUpload = bucket.file(newFilename);
      await newFileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      return { status: 200, body: { message: 'Profile picture updated successfully', filename: newFilename } };
    } catch (error) {
      console.error('Error in updateProfilePicture:', error);
      return { status: 500, body: { message: 'Internal server error' } };
    }
  }

  static async resetProfilePicture(userId: number) {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { idUsers: userId } });
      if (!user) return { status: 404, body: { message: 'User not found' } };

      const filename = `${userId}_pp`;
      const file = bucket.file(filename);
      await file.delete().catch(() => {}); // Ignore if file does not exist

      return { status: 200, body: { message: 'Profile picture reset successfully' } };
    } catch (error) {
      console.error('Error in resetProfilePicture:', error);
      return { status: 500, body: { message: 'Internal server error' } };
    }
  }
}

export { ProfilePictureService };
