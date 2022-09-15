import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  roomId : string = ''
  username : string =''
  message : string = ''
  symbol$: Observable<string> = new Observable()
  myTurn$ : Observable<boolean>= new Observable()
  board$ : Observable<any>= of(['','','','','','','','',''])
  @ViewChildren('square') squares : QueryList<ElementRef> | undefined
  hovered_square_id : number= -1

  constructor(private gameService : GameService, private route : ActivatedRoute, private router : Router) { 
    //this.messages$= this.gameService.chat$
    this.symbol$=this.gameService.symbol$ 
    this.myTurn$=this.gameService.myTurn$
    this.board$=this.gameService.board$
    if(!this.gameService.username)  this.router.navigate([''])

  }

  ngOnInit(): void { 
   //this.gameService.getCurrentRoom().subscribe(res =>  this.roomName= res)
   this.roomId = this.route.snapshot.params['uuid']
   if(this.gameService.username)    this.username=this.gameService.username;
   this.gameService.joinRoom(this.roomId, this.username)

  }

  makeMove(position : number) {
    this.gameService.makeMove(position)

  
  }

  showWithHoverStyle(id : number ) {
    //adds predrawn X/O symbol on the selected square when hovered
    this.hovered_square_id=id    
  }
  showWithDefaultStyle() {
    this.hovered_square_id=0
  }

  getSquareValue(position : number) {
    return this.gameService.getSquareValue(position)
  }

  ngDestroy() {}

}
