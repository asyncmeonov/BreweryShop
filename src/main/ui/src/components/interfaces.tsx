export interface BaseBeer {
    name: string,
    description: string,
    label: string,
    amountAvailable: number,
    size: number
}

export interface BeerType extends BaseBeer {
    id: string,
    amount: number,
    price: number
}

export interface AdminBeerRequest extends BaseBeer {
    amountInStock: number,
    defaultPrice: number,
    priceModels: PriceModel[],
    availableByDefault: boolean
}

export interface AdminBeer extends AdminBeerRequest {
    id: string
}

export interface PriceModel {
    price: number,
    licenseType: string
}

export interface BaseLicense {
    license: string
}

export interface License extends BaseLicense {
    type: string,
    expiryDate?: Date
}

export interface LoginToken extends BaseLicense {
    token: string,
    isAdmin: boolean,
    error: string
}

export interface Order {
    pirateName: string,
    pirateContact: string,
    orderBeers: BeerType[]
}

export interface AdminOrder extends Order {
    id: string,
    total: number,
    license: string,
    licenseType: string,
    dateCreated: Date,
    dateCompleted?: Date,
    notes?: string
}

export interface DeliveryRequest {
    deliveryDate: Date,
    maxCapacity: number
}

export interface Delivery extends DeliveryRequest {
    id: string,
    distributor?: string,
    bookedOrders: string[]
}

export { }