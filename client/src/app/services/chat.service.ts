import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameService } from './game.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatSubject : BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  public chat$ : Observable<any[]> = this.chatSubject.asObservable()
  
  constructor(private gameService : GameService) { 
    this.userConnected()

    this.gameService.socket.on('message', message => {
      this.onMessageEvent(message)
    })
  }
  onMessageEvent(message : any) {
    this.chatSubject.next([...this.chatSubject.getValue(),message])
  }

  userConnected() {
    this.gameService.socket.on('user-connected' , (username)=> {
        this.onMessageEvent({username:'XO BOT', text : `${username} has joined the chat!`, time : moment().format('hh:mm')});
    })
  }

  sendMessage(message : any, roomId: string) {
    this.gameService.socket.emit('chatMessage', message, roomId)
  }

}
