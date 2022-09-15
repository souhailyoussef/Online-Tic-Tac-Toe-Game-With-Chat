import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.css']
})
export class PagenotfoundComponent implements OnInit {
  errorType : string =''
  constructor(private route : ActivatedRoute) { }

  ngOnInit(): void {
  this.errorType=this.route.snapshot.paramMap.get('error') || ''
  }

}
