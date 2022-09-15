import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('chat') chat : ElementRef | undefined;
  @ViewChild('inputElement') ipnutElement : ElementRef | undefined;
  roomId : string = ''
  input : string = ''
  messages$ : Observable<any[]> = of()
  current_room : string =''
  snackbarToggle : boolean = false
  constructor(private chatService : ChatService, private route : ActivatedRoute ) { }



  ngOnInit(): void {
    this.messages$=this.chatService.chat$
    this.roomId = this.route.snapshot.params['uuid']
   // if(this.gameService.username)    this.username=this.gameService.username;
  }



  scrollDown() {
    //scrolls down the chat container to the last message
    this.chat!.nativeElement.scrollTop = this.chat!.nativeElement.scrollHeight;
  }

  clearAndSetFocus() {
        //clears input and sets focus on the textarea
        this.input=''
        this.ipnutElement!.nativeElement.focus();
  }
  userConnected() {
    this.chatService.userConnected()

  }
  sendMessage() {
    if(this.input.trim())
    this.chatService.sendMessage(this.input,this.roomId)
    this.scrollDown()
    this.clearAndSetFocus()
  }


  copyLinkToClipboard() {
    navigator.clipboard.writeText(this.roomId)
    // Alert the copied text
    this.showSnackbar()
  }

  showSnackbar() {
    this.snackbarToggle=true;
    setTimeout(() => {
      this.snackbarToggle=false
    }, 3000);
  }

  
}
