
import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class ChartComponent {
  @ViewChild('chart_data_list') chart_data_list!: ElementRef;
  constructor(public chatSelector: ChatSelectorService, private dialog: MatDialogRef<ChartComponent>) {}

  fields: {name: string, value: number, color: string}[] = [
    {name: "", value: 0, color: "#ff0000"},
  ];

  changeChartType(type: number) {
    this.chatSelector.chartType = type;
  }
  addField(){
    this.fields.push({name: "", value: 0, color: "#ff0000"});
  }

  deleteField(i: number){
    this.fields.splice(i, 1);
  }

  checkFieldName(name: string){
    for(let i = 0; i < this.fields.length; i++){
      if(this.fields[i].name == name && i != this.fields.length - 1){
        return 'visible';
      }
    }
    return 'hidden';
  }

  sendChart(){
    let children = this.chart_data_list.nativeElement.children;
    let series : {name: string, data: number[]}[] | number[] = [];
    let chart: {height: number, type: string} = {height: 0, type: "bar"};
    let labels : string[] = [];
    let title : {text: string} = {text: "prova"};
    let xaxis : {categories: string[]} = {categories: []};
    let colors : string[] = [];
    chart.height = 450;

    let data;

    if(this.chatSelector.chartType == 2){
      chart.type = "pie";
      series = [] as number[];
      for(let i = 0; i < children.length; i++){
        let el = children[i].children[0] as HTMLInputElement;
        if(el.value.trim() != ""){
          let value = children[i].children[1] as HTMLInputElement;
          let color = children[i].children[2] as HTMLInputElement;
          labels.push(el.value);
          series.push(value.valueAsNumber as number);
          colors.push(color.value);
        }
      }
      data = {chart: chart, series: series, title: title, labels: labels, colors: colors};

    }
    else
    {
      series = [] as {name: string, data: number[]}[];
      chart.type = this.getType(this.chatSelector.chartType);
      series.push({name: "serie", data: []});
      for(let i = 0; i < children.length; i++){
        let el = children[i].children[0] as HTMLInputElement;
        if(el.value.trim() != ""){
          let value = children[i].children[1] as HTMLInputElement;
          let color = children[i].children[2] as HTMLInputElement;
          xaxis.categories.push(el.value);
          series[0].data.push(value.valueAsNumber);
          colors.push(color.value);
        }
      }
      console.log(colors);
      data = {chart: chart, series: series, title: title, xaxis: xaxis, colors: colors};

    }


    let result = {data: data, type: this.chatSelector.chartType, opt: null}
    this.dialog.close(result);
  }
  getType(type: number){
    if(type == 1)
      return "bar";
    return "line";
  }
}
