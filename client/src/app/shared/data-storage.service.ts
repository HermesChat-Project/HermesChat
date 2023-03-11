import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  private REST_API_SERVER: string = "http://localhost:1337/api";
  constructor(private httpClient: HttpClient) { }

  public getRequest(endpoint: string) {
    return this.httpClient.get(this.REST_API_SERVER + endpoint)
  }

  public DeleteRequest(endpoint: string) {
    return this.httpClient.delete(this.REST_API_SERVER + endpoint)
  }

  public PostRequest(endpoint: string, body: any) {
    return this.httpClient.post(this.REST_API_SERVER + endpoint, body)
  }

  public PutRequest(endpoint: string, body: any) {
    return this.httpClient.put(this.REST_API_SERVER + endpoint, body)
  }
}