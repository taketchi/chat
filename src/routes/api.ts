import bcrypt from 'bcrypt'
import Router from 'express-promise-router'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import {Env, User} from '../type'
import {createUser, getUser} from "../users";
import {validateMailAddress, validatePassword} from "../validator";

const myEnv: Env = {
    SECRET:"",
    REFRESH_SECRET:""
}
dotenv.config({ path: '../../.env', processEnv: myEnv })
const saltRounds = 10;
export const router = Router()

// @ts-ignore
router.use((err, req, res, next) => {
    res.status(403).json(err.message);
});

router.post("/login",async (req, res, next) =>{
    const {mailAddress, password} = req.body
    let user: User
    try {
        user = await getUser(mailAddress)
    }
    catch (error) {
        throw new Error('mailAddress is invalid')
    }

    const passwordCompareResult = await bcrypt.compare(password, user.passwordHash)
    if(!passwordCompareResult){
        throw new Error('password is invalid')
    }
    
    const token = jwt.sign({
        email: user.mailAddress
    }, myEnv.SECRET, { expiresIn: '1h' });

    const refreshToken = jwt.sign({
        email: user.mailAddress
    }, myEnv.REFRESH_SECRET, { expiresIn: '2 days' });

    res.status(200).json({
        token: token,
        refreshToken: refreshToken,
        username:user.username
    })
})

router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body
    let decoded
    try{
        decoded = jwt.verify(refreshToken,myEnv.REFRESH_SECRET)
    }
    catch (err) {
        throw new Error('bad refreshToken')
    }
    const token = jwt.sign(decoded, myEnv.SECRET, { expiresIn: '1h' });
    res.status(200).json({
        token: token
    })
})

router.post('/signup', async (req, res)=>{
    const { mailAddress, username, password } = req.body
    if(!validateMailAddress(mailAddress)){
        throw new Error('mailAddress is invalid')
    }

    try{
        await getUser(mailAddress)
    }
    catch (error) {
        throw new Error('mailAddress cannot be used')
    }

    if(username.length < 1) {
        throw new Error('Please enter your name')
    }

    if(!validatePassword(password)){
        throw new Error('Please change to a strong password')
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)

    await createUser({
        mailAddress: mailAddress,
        username: username,
        passwordHash : passwordHash,
    })
    res.status(200).end()
})
