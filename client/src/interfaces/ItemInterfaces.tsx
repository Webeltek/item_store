export interface ItemFormValues {
    name: string;
    stock: string;
    price: string;
    images?: {
      uuid: string;
      path?: string;
      url: string;
    }[];
    description: string;
}

export interface ItemShape extends ItemFormValues {
    _id: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}