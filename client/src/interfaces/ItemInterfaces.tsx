export interface ImageShape {
    uuid: string;
    path?: string;
    url: string;
}

export interface ItemFormValues {
    name: string;
    stock: string;
    price: string;
    images?: ImageShape[];
    description: string;
}

export interface ItemShape extends ItemFormValues {
    _id: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}