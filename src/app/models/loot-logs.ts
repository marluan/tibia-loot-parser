import { Item } from "./item";

export class LootLogs {
  creature:string="";
  qtd:number=0;
  itens:Map<string,Item>=new Map();
}
