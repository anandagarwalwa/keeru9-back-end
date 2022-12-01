export type ITag = {
    name: string;
    color: string;
    image: string;
    creation_date?: string;
    updated_date?: string;
    status?: 'A' | 'I' | 'D'
}