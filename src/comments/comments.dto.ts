export type CommentDTO = {
    id?: number
    user_id: number
    post_id: number
    description: string
    active: boolean
    user_remove?: string
}