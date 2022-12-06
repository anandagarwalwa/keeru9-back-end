export type ICreateGameReq = {
    name: string;
    url: string;
    description: string;
    thumbnail: string;
    gif_url: string;
    game_type: string;
    category_id: number;
    height: number;
    width: number;
    tags: number[];
    featured: boolean;
    popular: boolean;
    top_rated: boolean;
}

export type ISearchGamesQuery = {
    q?: string
}

export type IGameDetailParam = {
    id: string
}