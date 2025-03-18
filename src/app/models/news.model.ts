export interface News {
  id: number;
  title: string;
  url: string;
}


export interface NewsModel{
    pageSize:number,
    page:number,
    totalStories :number,
    data:News[]
}