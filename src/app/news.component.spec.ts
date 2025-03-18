import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NewsComponent } from './news.component';
import { NewsService } from './services/NewsService.service';
import { NewsModel } from './models/news.model';
import { ImportsModule } from './imports';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { fakeAsync, tick } from '@angular/core/testing';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let newsService: NewsService;


  const mockResponse: NewsModel = {
    data: [
      { id: 1, title: 'News 1', url:'url 1'},
      { id: 2, title: 'News 2', url:'url 2' },
    ],
    pageSize: 10,
    page: 1,
    totalStories: 500
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ImportsModule, CommonModule, NgxPaginationModule,NewsComponent],
      providers: [NewsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    newsService = TestBed.inject(NewsService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should fetch news on initialization', () => {
    spyOn(newsService, 'getNews').and.returnValue(of(mockResponse));

    fixture.detectChanges();

    expect(newsService.getNews).toHaveBeenCalledWith(1, 10);
    expect(component.newsList).toEqual(mockResponse.data);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors when API fails', () => {
    spyOn(newsService, 'getNews').and.returnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges(); 

    expect(newsService.getNews).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Failed to load news. Please try again later.');
    expect(component.isLoading).toBeFalse();
  });

  it('should fetch news when page is changed', () => {
    spyOn(newsService, 'getNews').and.returnValue(of(mockResponse));
    
    component.pageChanged(2); 

    expect(newsService.getNews).toHaveBeenCalledWith(2, component.pageSize);
  });

 
  it('should set isLoading to true before fetching news', () => {
    spyOn(newsService, 'getNews').and.callFake(() => {
      expect(component.isLoading).toBeTrue();
      return of(mockResponse);
    });

    component.fetchNews(1, 10);
  });


  it('should filter news based on search query', () => {
    component.newsList = mockResponse.data;
    
    component.filterNews('News 1');
  
    expect(component.filteredNewsList.length).toBe(1);
    expect(component.filteredNewsList[0].title).toBe('News 1');
  });

  
  it('should reset news list when search query is empty', () => {
    component.newsList = mockResponse.data;
    component.filteredNewsList = []; // Assume it was previously filtered
  
    component.filterNews('');
  
    expect(component.filteredNewsList.length).toBe(mockResponse.data.length);
  });

  it('should return empty list if no news matches search query', () => {
    component.newsList = mockResponse.data;
  
    component.filterNews('Non-existent News');
  
    expect(component.filteredNewsList.length).toBe(0);
  });

  it('should reset to page 1 after filtering', () => {
    component.pageNumber = 3; // Assume we were on page 3
  
    component.filterNews('News 1');
  
    expect(component.pageNumber).toBe(1);
  });

  it('should reset search and fetch news again', () => {
    const inputElement = document.createElement('input');
    inputElement.value = 'News 1';
  
    spyOn(component, 'fetchNews');
  
    component.newsList = mockResponse.data;
    component.filteredNewsList = [];
    component.pageNumber = 2;
  
    component.resetSearch(inputElement);
  
    expect(component.filteredNewsList.length).toBe(mockResponse.data.length);
    expect(component.pageNumber).toBe(1);
    expect(inputElement.value).toBe('');
    expect(component.fetchNews).toHaveBeenCalledWith(1, component.pageSize);
  });



});
