import { Component, OnInit } from '@angular/core';
import { UserLogs } from '../models/user-logs';

@Component({
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.scss']
})
export class InputDataComponent implements OnInit {
  userLogs:UserLogs = new UserLogs();
  submitted = false;
  healMin:number=10000;
  healMax:number=0;
  healSum:number=0;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() { this.submitted = true; }

  parseLogs() {
    this.userLogs.healings=[];
    let rep=this.userLogs.logs.replace(/^[0-9]{2}:[0-9]{2} ([^Y]|Y[^o]|Yo[^u]|You[^ ]|You [^h]|You h[^e]|You he[^a]).*/mg,"");
    rep = rep.replace(/^([A-Za-z].*)/mg,"");

    rep = rep.replace(/^[0-9]{2}:[0-9]{2} You heal yourself for ([0-9]+) hitpoints./mg,"$1");

    const regex = /[0-9]+/g;
    let m;
    let currentHeal:number=0;
    while ((m = regex.exec(rep)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
            currentHeal=Number(match);

            if(currentHeal>this.healMax) {
              this.healMax=currentHeal;
            }
            if(currentHeal<this.healMin) {
              this.healMin=currentHeal;
            }
            this.healSum+= currentHeal;
            this.userLogs.healings.push(currentHeal);
        });
    }

  }

  getAvg():number {
    if(this.healSum>0) {
      return (this.healSum / this.userLogs.healings.length).toFixed(2) as any;
    }
    return Number(0);
  }


}
