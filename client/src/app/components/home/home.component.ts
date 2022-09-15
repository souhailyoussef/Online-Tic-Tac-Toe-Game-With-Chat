import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username = new FormControl('',Validators.required)
  roomUrl : string = ''
  constructor(private gameService : GameService, private router : Router) {

  }

  createRoom() {
    if(this.username.valid) {
      this.gameService.username=this.username.value;
      this.gameService.getRoomUrl().subscribe(res => {
      this.router.navigate(["/room", res.uuid])
    })
    }
   
    
  }
  joinRoom() {
    if(this.username.valid) {
      this.gameService.username=this.username.value;
      const uuid = {uuid : this.roomUrl.trim()}
      this.router.navigate(["/room",uuid.uuid])
    }
  }

  ngOnInit(): void {
    
  }

  

}
