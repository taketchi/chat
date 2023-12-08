import {Messages, PrismaClient} from '@prisma/client'
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
    if (cursor){
        return prisma.messages.findMany({
            take: 100,
            cursor:{
                id: cursor.id
            },
            include:{
                userRoom:{
                    roomId: roomId
                }
            },
            orderBy:{
                createdAt: 'desc'
            }
        });
    }
    else {
        return prisma.messages.findMany({
            take: 100,
            include:{
                userRoom:{
                    roomId: roomId
                }
            },
            orderBy:{
                createdAt: 'desc'
            }
        });
    }
}