import {PrismaClient, Room} from '@prisma/client'

const prisma = new PrismaClient()

export async function createRoom(roomName:string){
    return prisma.room.create({
        data: {
            name: roomName,
        }
    });
}

export async function getRoom(roomId:string){
    return prisma.room.findFirst({
        where: {
            id: roomId
        }
    });
}

export async function deleteRoom(room:Room){
    await prisma.room.delete({
        where: {
            id: room.id
        }
    });
}