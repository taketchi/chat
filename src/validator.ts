
export function validateMailAddress(_mailAddress:any):boolean {
    const mailAddress = _mailAddress.toString()
    return !!mailAddress.match(/^[A-Za-z0-9][A-Za-z0-9_.-]*@[A-Za-z0-9_.-]+\.[A-Za-z0-9]+$/);
}

export function validatePassword(password:string):boolean {
    return !!password.match(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,}$/i)
}
