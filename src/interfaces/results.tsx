
export interface SingleItem {
  id?: string,
  label: string,
  description: string | null,
  meta: {
    catID?: string,
    status?: string,
    color?: string
  }
}

export interface Results {
  count: number,
  next: string,
  prev: string,
  results: SingleItem[]
}