import { Component, OnInit } from '@angular/core';
import { UserLogs } from '../models/user-logs';
import * as XLSX from 'xlsx';
import { BeforeAfter } from '../models/before-after';
import { LootLogs } from '../models/loot-logs';
import { Item } from '../models/item';

@Component({
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.scss']
})
export class InputDataComponent implements OnInit {
  fileName= 'ExcelSheet.xlsx';
  lootLogsMap:Map<string,LootLogs>=new Map();
  lootLogs:string="";
  submitted = false;
  beforeAfter:Array<BeforeAfter> = [];
  exurasio:boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() { this.submitted = true; }

  parseLogs() {
    this.lootLogsMap.clear();
    let creature:string="";
    let itens:string="";
    let rep:Array<string>=this.lootLogs.split(/\r?\n/);
    rep.forEach(currentLoot => {
      if(currentLoot.match(/^[0-9]{2}:[0-9]{2} Loot of ([A-Za-z ]+):(([0-9 ]+[A-Za-z ]+,?)+)/gm)){
        creature=currentLoot.replace(/^[0-9]{2}:[0-9]{2} Loot of (a )?([A-Za-z ]+):(([0-9 ]+[A-Za-z ]+,?)+)/gm,"$2");
        itens=currentLoot.replace(/^[0-9]{2}:[0-9]{2} Loot of ([A-Za-z ]+):(([0-9 ]+[A-Za-z ]+,?)+)/gm,"$2");
        let lootBag:LootLogs=this.lootLogsMap.get(creature)||new LootLogs();

        let itensList=itens.split(/,/);
        itensList.forEach(item => {
          let itemType:Item = new Item();
          let itemName:string="";
          lootBag.creature=creature;
          if(item.match(/[0-9]+.*/)){
            itemName = item.replace(/([0-9 ]+)([A-Za-z ]+)/,"$2");
            if(lootBag.itens.has(itemName)){
              let itTemp=lootBag.itens.get(itemName)||new Item();
              itTemp.qtd+=Number(item.replace(/([0-9 ]+)([A-Za-z ]+)/,"$1")) || 0;
            } else {
              itemType.item = itemName;
              itemType.qtd = Number(item.replace(/([0-9 ]+)([A-Za-z ]+)/,"$1"));
              lootBag.itens.set(itemName,itemType);
            }
          } else {
            itemName = item.match(/^ a .*/)? item.replace(/^( a )([A-Za-z ]+)/,"$2") :item.replace(/([0-9 ]+[A-Za-z ]+)/,"$1");
            if(lootBag.itens.has(itemName)){
              let itTemp=lootBag.itens.get(itemName)||new Item();
              itTemp.qtd+=1;
            } else {
              itemType.item = itemName;
              itemType.qtd = 1;
              lootBag.itens.set(itemName,itemType);
            }

          }
          if(!this.lootLogsMap.has(creature))
            this.lootLogsMap.set(creature,lootBag);
        });
        lootBag.qtd+=1;
      }
    });

  }

  generateTable() {
    this.parseLogs();
  }



  exportExcel() {
    //this.fileName=this.userLogs.userName+"_"+this.userLogs.spellName+"_"+"_lvl_"+this.userLogs.level+".xlsx";
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }


}
