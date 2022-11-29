export type ICreateGameReq = {
    name: string;
    url: string;
    description: string;
    thumbnail: string;
    gif_url: string;
    game_type: string;
}

export type ISearchGamesQuery = {
    q?: string
}

export type IGameDetailParam = {
    id: string
}