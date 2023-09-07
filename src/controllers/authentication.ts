import { createUser, getUserByEmail } from '../db/user';
import express from 'express';
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({ error: 'Bad Request: Missing required fields' });
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid email or password' });
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash){
            return res.status(401).json({ error: 'Unauthorized: Invalid email or password' });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();
        res.cookie('NBU-AUTH', user.authentication.sessionToken, {domain: 'localhost', path: '/'});
        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {firstname, lastname, email, password} = req.body;
        if(!firstname || !lastname || !email || !password ){
            return res.status(400).json({ error: 'Bad Request: Missing required fields' });
        }

        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return res.status(400).json({ error: 'Bad Request: Email already exists' });

        }

        const salt = random();
        const user = await createUser({
            email,
            firstname,
            lastname,
            authentication:{salt, password: authentication(salt, password)},
        });
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}