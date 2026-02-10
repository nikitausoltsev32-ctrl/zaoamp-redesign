export interface DeliveryCalculationRequest {
  derivalCity: string
  arrivalCity: string
  weight: number // тонны
  volume?: number // кубометры
  address?: string
}

export interface TruckLoad {
  number: number
  weight: number
  volume?: number
  price: number
  pricePerTon: number
  deliveryDays: string
  details?: {
    basePrice: number
    markup: number
  }
}

export interface DeliveryCalculationResponse {
  totalWeight: number
  totalVolume?: number
  trucksCount: number
  trucks: TruckLoad[]
  totalPrice: number
  totalBasePrice: number
  averageDeliveryDays: string
  splitByTrucks: boolean
  warning?: string
}

export interface DellinCity {
  code: string
  name: string
  region: string
  hasTerminal: boolean
}

export const MAX_TRUCK_WEIGHT = 20 // тонн
export const MARKUP_PERCENTAGE = 10 // процентов
