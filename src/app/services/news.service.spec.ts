import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NewsService } from './NewsService.service';
import { NewsModel,News } from '../models/news.model';
import { environment } from '../../environments/environment';

describe('NewsService', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}News/topstories`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NewsService],
    });

    service = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch news with correct URL and parameters', () => {
    const mockNews: News[] = [
      { id: 1, title: 'Test News 1',url:'Test Url 1' },
      { id: 2, title: 'Test News 2',url:'Test Url 1'},
    ];

     
   const mockNewsResponse:NewsModel={
        page:1,
        pageSize:2,
        data: mockNews,
        totalStories:2
      }


    service.getNews(1, 2).subscribe((news) => {
      expect(news).toBeDefined();
    });

    const req = httpMock.expectOne(`${apiUrl}?page=1&pagesize=2`);
    expect(req.request.method).toBe('GET');

   req.flush(mockNews);
  });

  it('should handle error when fetching news fails', () => {
    service.getNews(1, 2).subscribe({
      next: () => fail('Expected an error, but got success response'),
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne(`${apiUrl}?page=1&pagesize=2`);
    expect(req.request.method).toBe('GET');

    req.flush('Fetching error', { status: 500, statusText: 'Server Error' });
  });
});
