export type User = {
    id?:string,
    mailAddress:string,
    username:string,
    passwordHash:string
}

export type Env = {
    SECRET:string,
    REFRESH_SECRET:string
}