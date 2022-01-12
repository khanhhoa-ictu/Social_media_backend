export interface PostType {
    userId : string,
    desc : string,
    img : string,
    likes : string[],
    comments : string[]
}

export const initialValue = {
    userId : '',
    desc : '',
    img : '',
    likes : [],
    comments : []
}