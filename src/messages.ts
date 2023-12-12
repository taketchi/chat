import {Prisma, Messages, PrismaClient} from '@prisma/client'
import {getUserRoom} from "./userRoom";

const prisma = new PrismaClient()

export async function createMessage(roomId: string, userId: string, message: string) {
    const userRoom = await getUserRoom(roomId, userId)

    if(userRoom === null){
        throw new Error()
    }

    return prisma.messages.create({
        data: {
            userRoomId: userRoom.id,
            message,
        },
    });
}

export async function deleteMessage(messageId: string){
    await prisma.messages.update({
        where:{
            id: messageId
        },
        data:{
            deletedAt: new Date()
        }
    })
}

export async function getMessages(roomId: string, cursor?: Messages){
    const userRoom = await prisma.userRoom.findMany({
        select:{
            id:true
        },
        where:{
            roomId:roomId
        }
    })

    const userRoomIDs = userRoom.map((ur)=> ur.id )

    const config: Prisma.MessagesFindManyArgs = {
        take: 100,
        where:{
            userRoomId:{
                in:userRoomIDs
            }
        },
        orderBy:{
            createdAt: 'desc'
        }
    }
    if (cursor){
        config.cursor = {
            id:cursor.id
        }
    }
    return prisma.messages.findMany(config);
}