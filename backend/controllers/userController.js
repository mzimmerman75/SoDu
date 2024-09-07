import User from '../models/User.js';
import bcrypt from 'bcrypt';

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check for existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // if not existing, create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // add user to DB
    await newUser.save();

    // return the newly created user (excluding the password)
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export { createUser };