import express from 'express';
import { deleteUserById, getUser, getUserById } from '../db/user';

export const getAllUsers = async (req:express.Request, res: express.Response) => {
  try {
    const users = await getUser();
    return res.status(200).json(users);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }  
};

export const deleteUser = async (req:express.Request, res: express.Response) => {
  try {
    const {id} = req.params;
    const deletedUser = await deleteUserById(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Not Found: User not found' });
    }

    return res.status(200).json(deletedUser);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const updateUser = async (req:express.Request, res: express.Response) => {
  try {
    const {id} = req.params;
    const {firstname, lastname} = req.body;
    if(!firstname || !lastname){
      return res.sendStatus(400).json({ error: 'Bad Request: Missing required fields' });
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Not Found: User not found' });
    }

    user.firstname = firstname;
    user.lastname = lastname;
    const userUpdated = await user.save()
    return res.status(200).json(userUpdated).end();

  } catch (error) {
    console.log(error);
    return res.sendStatus(500).json({ error: 'Internal Server Error' });
  }
}