import {PrismaClient, Room} from '@prisma/client'

const prisma = new PrismaClient()

export async function createRoom(roomName:string){
    try {
        return await prisma.room.create({
            data: {
                name: roomName
            }
        });
    } catch(error) {
        console.error("Error creating room:", error);
        throw error;  // re-throwing the error to be handled by the caller function
    }
}

export async function getRoom(roomId:string):Promise<Room>{
    const room = prisma.room.findFirst({
        where: {
            id: roomId
        }
    });
    if(room === null){
        throw new Error('roomID is invalid')
    }
    else{
        // @ts-ignore
        return room
    }
}

export async function enterRoom(room:Room,userId) {
    const existsRoom = prisma.room.findFirst({
        where:{
            roomID: room.id,
            userID: userId
        }
    })

    if (existsRoom !== null) {
        await prisma.room.update({
            where:{
                roomId: room.id,
                userId: userId
            },
            data: {
                deletedAt: null
            }
        })
    }
    else {
        await prisma.room.update({
            where:{
                roomId: room.id
            },
            data: {
                userId: userid,
            }
        })
    }
}

export async function exitRoom(room:Room, userId){
    await prisma.room.update({
        where:{
            roomId: room.id,
            userId: userId
        },
        data: {
            deletedAt: new Date()
        }
    })
}

export async function deleteRoom(room:Room){
    await prisma.room.delete({
        where: {
            id: room.id
        }
    });
}