import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  private REST_API_SERVER: string = "https://10.88.229.127:8090/";
  constructor(private httpClient: HttpClient) { }
  options = {
    observe : 'response' as 'response',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  }


  public getRequest(endpoint: string, options: any = {
    observe : 'response' as 'response',
    withCredentials: true
  }) {
    return this.httpClient.get(this.REST_API_SERVER + endpoint, options)
  }

  public DeleteRequest(endpoint: string, options: any = this.options) {
    return this.httpClient.delete(this.REST_API_SERVER + endpoint, options)
  }

  public PostRequest(endpoint: string, body: FormData) {
    console.log(body);
    return this.httpClient.post(this.REST_API_SERVER + endpoint, body)
  }

  public PostRequestWithHeaders(endpoint: string, body: any, options: any) {
    return this.httpClient.post(this.REST_API_SERVER + endpoint, body, options);
  }



  public PutRequest(endpoint: string, body: any) {
    return this.httpClient.put(this.REST_API_SERVER + endpoint, body)
  }
}
