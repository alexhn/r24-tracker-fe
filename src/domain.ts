export interface ShareSales {
    share_price: number,
    shares_left: number
}

export interface Project {
    id: number,
    slug: string,
    title: string,
    shareSales: ShareSales[],
    country: string
}