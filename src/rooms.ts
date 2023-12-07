import {User} from "./type";
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

export async function createUser(user:User){
    await prisma.user.create({
        data:user
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