export interface UserType {
    email: string,
    name: string,
    password: string,
    address: string,
    phone_number: string,
    profilePicture: string,
    avatarUrl: string,
    followers: string[],
    followings: string[],
    is_verify: boolean,
    desc: string,
    gender:string,
}

export const initUser = {
    email: '',
    name: '',
    password: '',
    address: '',
    phone_number: '',
    profilePicture: '',
    avatarUrl: '',
    followers: [],
    followings: [],
    is_verify: false,
    desc: '',
    gender:'',
}

export interface FriendType{
    _id : string,
    name:string,
    profilePicture:string,
}