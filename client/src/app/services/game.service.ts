import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ChatService } from './chat.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  socket : Socket = io(environment.url)
  username : string |undefined;

  private symbolSubject : BehaviorSubject<string> = new BehaviorSubject<string>('')
  public symbol$ : Observable<string> = this.symbolSubject.asObservable()
  private myTurnSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public myTurn$ : Observable<boolean> = this.myTurnSubject.asObservable();
  private boardSubject : BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['','','','','','','','',''])
  public board$ : Observable<string[]>  = this.boardSubject.asObservable()

  
  constructor(private http : HttpClient,private router : Router) { 
    this.socket.on('error' , (error)=> {
      if(error.error==='fullRoom') this.router.navigate(['**',{error:'fullRoom'}])
      else if(error.error==='no_username') this.router.navigate([''])
    })
   

    //this.socket.on('gameStart', ()=> this.startGame())
    this.socket.on('start-game', (data) => {
        this.startGame(data)
    })

    //when a player makes a move
    this.socket.on('move-made', (data)=> {
      //render move

      this.moveMade(data)
       // If the symbol of the last move was the same as the current player
      // means that now is opponent's turn
      this.myTurnSubject.next(data.symbol !== this.symbolSubject.value);

    if (!this.isGameOver()) { 

    }
    else {
      this.resetBoard()
    }

    })
  }

  getRoomUrl() : Observable<any> {
    return this.http.get(`${environment.url}/room`)
  }
 

  createRoom(roomId : string) {
    this.socket.emit('createRoom', roomId)
  }



  joinRoom(roomId : string, username : string) {
    this.socket.emit('join-room', roomId,username)
  }

 
  startGame(data : any) {
    this.symbolSubject.next(data.symbol);
    this.myTurnSubject.next((data.symbol === 'X'))// 'X' starts first
  }

  makeMove(position : number) {

    if (!this.myTurnSubject.value)
    {
      return ; // Shouldn't happen since the board is disabled
    }
    if(this.boardSubject.value[position-1]!=='') return; //if square is already occupied, do nothing
    //else
    this.socket.emit('make-move', { // Valid move (on client side) -> emit to server
      symbol : this.symbolSubject.value,
      position: position
    })
  }

  moveMade(data: any) {
    let oldValue = this.boardSubject.value
    oldValue[data.position-1]=data.symbol
    let newValue = oldValue 
    this.boardSubject.next(newValue)
  }

  isGameOver() {
    let board= this.boardSubject.value
    var matches = ["XXX", "OOO"]; // This are the string we will be looking for to declare the match over
    if(board[0]+board[1]+board[2]==='XXX' || board[0]+board[1]+board[2]==='OOO' ||
    board[3]+board[4]+board[5]==='XXX' || board[3]+board[4]+board[5]==='OOO' ||
    board[6]+board[7]+board[8]==='XXX' || board[6]+board[7]+board[8]==='OOO' ||
    board[0]+board[3]+board[6]==='XXX' || board[0]+board[3]+board[6]==='OOO' ||
    board[1]+board[4]+board[7]==='XXX' || board[1]+board[4]+board[7]==='OOO' ||
    board[2]+board[5]+board[8]==='XXX' || board[2]+board[5]+board[8]==='OOO' || 
    board[0]+board[4]+board[8]==='XXX' || board[0]+board[4]+board[8]==='OOO' ||
    board[2]+board[4]+board[6]==='XXX' || board[2]+board[4]+board[6]==='OOO' || !board.includes(''))
    {
      return true
    }
    return false;
  }

 
  getCurrentTurn() : boolean {
    return this.myTurnSubject.value
  }
  getCurrentSymbol() : string {
    return this.symbolSubject.value
  }

  getBoardValue() : string[] {
    return this.boardSubject.value
  }

  resetBoard() {
    this.boardSubject.next(['','','','','','','','',''])
    const oldSymbol = this.symbolSubject.value;
    if(oldSymbol) (oldSymbol==='X') ? this.symbolSubject.next('O') : this.symbolSubject.next('X') //swap symbols when rseeting the board
    //make sure it's my turn
    this.myTurnSubject.next(this.symbolSubject.value==='X');

  } 

  getSquareValue(position: number) : string {
    return this.boardSubject.value[position-1]
  }


}
