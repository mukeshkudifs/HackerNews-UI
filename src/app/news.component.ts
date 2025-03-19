import { Component, OnInit } from '@angular/core';
import { NewsService } from './services/NewsService.service';
import {ImportsModule} from './imports'
import {News} from './models/news.model'
import {NgxPaginationModule} from 'ngx-pagination';
import { CommonModule } from '@angular/common'
import {map,debounceTime} from 'rxjs'
import {fromEvent} from 'rxjs'


@Component({
  standalone:true,
  selector: 'app-news',
  templateUrl: 'news.component.html',
  styleUrls: ['./news.component.css'],
  imports: [
    ImportsModule,
    CommonModule,
    NgxPaginationModule
]
})
export class NewsComponent implements OnInit {
  title:string = 'News'
  newsList:News[] = [];  
  isLoading = true; 
  errorMessage = ''; 
  pageSize:number=10;
  pageNumber:number=1
  totalStories:number=200;
  filteredNewsList: News[] = [];

  constructor(private newsService: NewsService) {
    
  }

  ngOnInit(): void {
    this.fetchNews(this.pageNumber,this.pageSize);
  }

  fetchNews(pageNumber:number,pageSize:number): void {
    this.newsService.getNews(pageNumber,pageSize).subscribe({
      next: (data) => {
        this.newsList = data.data;
        this.filteredNewsList = this.newsList;
        this.pageSize = data.pageSize;
        this.pageNumber = data.page;
        this.totalStories = data.totalStories;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load news. Please try again later.';
        console.error('Error fetching news:', error);
        this.isLoading = false;
      },
    });
  }

  pageChanged(event: number) 
  {
    this.pageNumber=event;
    this.fetchNews(event,this.pageSize);
  }

   // Search News
   filterNews(searchQuery:string) 
   {
    if (searchQuery.trim() === '') {
      this.filteredNewsList = [...this.newsList]; // Reset to full list
    } else {
      this.filteredNewsList = this.newsList.filter(news => 
        news.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    this.totalStories = this.filteredNewsList.length;
    this.pageNumber = 1; // Reset to first page after search
  }

  // Reset Search
  resetSearch(inputElement: HTMLInputElement) {

    this.filteredNewsList = [...this.newsList];
    this.totalStories = this.newsList.length;
    this.pageNumber = 1;
    inputElement.value='';
    this.fetchNews(this.pageNumber,this.pageSize);
  }

searchNews(event:any){

  fromEvent(event.target,'keyup')
    .pipe(
         map((event:any)=> event.target.value.trim().toLowerCase()),
         debounceTime(1000)       
    ).subscribe({
      next: (value:any) => this.filterNews(value)
    })
}

}
