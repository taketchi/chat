import {Prisma, PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function getUserRoom(roomId: string, userId:string){
    return prisma.userRoom.findUnique({
        where:{
            roomId_userId:{
                roomId:roomId,
                userId:userId
            }
        }
    })
}

export async function enterRoom(roomId: string, userId:string) {
    const existsUserRoom = await getUserRoom(roomId, userId)
    if(existsUserRoom){
        await prisma.userRoom.update({
            where:{
                roomId_userId:{
                    roomId:roomId,
                    userId:userId
                }
            },
            data:{
                deletedAt:null
            }
        })
    }
    else{
        await prisma.userRoom.create({
            data:{
                roomId: roomId,
                userId: userId
            }
        })
    }
}

export async function exitRoom(roomId: string, userId:string){
    await prisma.userRoom.update({
        where:{
            roomId_userId:{
                roomId:roomId,
                userId:userId
            }
        },
        data: {
            deletedAt: new Date()
        }
    })
}
