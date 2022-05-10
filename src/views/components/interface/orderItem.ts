export interface studentInterface {
  chineseName?: string
  comment?: string
  phoneNumber?: string
}

export interface itemInterface {
  productName: string
  unitPrice: number
  quantity: number
  itemPrice: number
}

export interface dataInterface {
  id?: string
  complete?: number
  creationDate?: string
  student?: studentInterface
  items?: itemInterface[]
  totalPrice?: number
}
