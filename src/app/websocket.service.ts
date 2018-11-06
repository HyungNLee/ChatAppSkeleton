import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environment } from '../environments/environment';

@Injectable()
export class WebsocketService {

  // Our socket connection
  private socket;

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {

    // Hardcode 'environment.ws_url' as 'http://localhost:5000'
    // if we don't use environment variables.
    
    this.socket = io(environment.ws_url);

    // Define observable which will observe any incoming messages from our socket.io server
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        console.log("Received message from Websocket Server");
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });

    // Define our observer which will listen to messages from other components and send messages back to our socket server whenever the 'next()' method is called.

    let observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    // We will return out Rx.Subject which is a combination of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }

}
