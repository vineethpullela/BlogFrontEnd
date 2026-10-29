import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class BlogPostService {
private readonly apiUrl= 'http://localhost:5193/api/BlogPost'
  constructor(private http: HttpClient) {}

  getAllPost(){
      return this.http.get<any[]>(this.apiUrl);
    }

    //Phase 1:  obervable text-only method 
    createPost(data:any){
      //  const headers = new HttpHeaders()
      // .set('Content-Type', 'application/json');
      return this.http.post(this.apiUrl,data);
    }




}