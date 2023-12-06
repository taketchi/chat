import {User} from "./type";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()
dayjs.extend(utc)

export async function createUser(user:User){
    await prisma.user.create({
        data:{
            mailAddress:user.mailAddress,
            username:user.username,
            passwordHash:user.passwordHash,
        }
    })
}

export async function updateUser(user:User){
    await prisma.user.update({
        where:{
            id:user.id,
        },
        data:{
            mailAddress:user.mailAddress,
            username:user.username,
            passwordHash:user.passwordHash
        }
    })
}

export async function deleteUser(id:string) {
    await prisma.user.update({
        where:{
            id: id
        },
        data:{
            deletedAt: dayjs().utc().format('YYYY-MM-DD HH:mm:ss')
        }
    })
}

export async function getUser(mailAddress:string):Promise<User>{
    const user = prisma.user.findFirst({
        where: {
            mailAddress: mailAddress
        }
    });
    if(user === null){
        throw new Error('mailAddress is invalid')
    }
    else{
        // @ts-ignore
        return user
    }
}