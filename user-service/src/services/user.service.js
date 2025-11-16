const userRepository = require('../repositories/user.repository');
const cacheService = require('./cache.service');

class UserService {
  async getAllUsers() {
    const users = await userRepository.findAll();
    return users.map(user => user.toObject());
  }

  async getUserById(id) {
    const cacheKey = `user:${id}`;
    const cachedUser = await cacheService.get(cacheKey);
    
    if (cachedUser) {
      console.log('User retrieved from cache');
      return cachedUser;
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const userObject = user.toObject();
    await cacheService.set(cacheKey, userObject, 3600);
    
    return userObject;
  }

  async createUserProfile(userId, userData) {
    const { name, email, phone, address } = userData;

    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    const profileExists = await userRepository.userProfileExists(userId);
    if (profileExists) {
      throw new Error('User profile already exists');
    }

    const user = await userRepository.create(userId, name, email, phone, address);
    return user.toObject();
  }

  async updateUserProfile(id, userData) {
    const { name, email, phone, address } = userData;

    const user = await userRepository.update(id, name, email, phone, address);
    if (!user) {
      throw new Error('User not found');
    }
    
    const userObject = user.toObject();
    const cacheKey = `user:${id}`;
    await cacheService.set(cacheKey, userObject, 3600);
    
    return userObject;
  }

  async deleteUserProfile(id) {
    const deleted = await userRepository.delete(id);
    if (!deleted) {
      throw new Error('User not found');
    }
    
    const cacheKey = `user:${id}`;
    await cacheService.delete(cacheKey);
    
    return { message: 'User deleted successfully' };
  }
}

module.exports = new UserService();
