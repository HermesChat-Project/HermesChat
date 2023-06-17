
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
  title: string = "";
  chart_color: string = "#ff0000";

  changeChartType(type: number) {
    this.chatSelector.chartType = type;
  }
  addField(){
    this.fields.push({name: "", value: 0, color: "#ff0000"});
  }

  addNumber(index: number){
    this.fields[index].value++;
  }

  subtractNumber(index: number){
    this.fields[index].value--;
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
    let series : {name: string, data: number[]}[] | number[] = [];
    let chart: {height: number, type: string} = {height: 450, type: "bar"};
    let labels : string[] = [];
    let title : {text: string} = {text: this.title};
    let xaxis : {categories: string[]} = {categories: []};
    let colors : string[] = [];


    let data;

    console.log(this.fields)

    if(this.chatSelector.chartType == 2){
      chart.type = "pie";
      series = [] as number[];
      for(const field of this.fields){
        if(field.name.trim() != ""){
          let value = field.value;
          let color = field.color;
          labels.push(field.name);
          series.push(value as number);
          colors.push(color);
        }
      }
      data = {chart: chart, series: series, title: title, labels: labels, colors: colors};

    }
    else
    {
      series = [] as {name: string, data: number[]}[];
      chart.type = this.getType(this.chatSelector.chartType);
      series.push({name: "value", data: []});
      colors.push(this.chart_color);
      for(const field of this.fields){
        if(field.name.trim() != ""){
          let value = field.value;
          let color = field.color;
          xaxis.categories.push(field.name);
          series[0].data.push(value);
        }
      }
      data = {chart: chart, series: series, title: title, xaxis: xaxis, colors: colors};

    }

    let result = {data}
    console.log(result);
    this.dialog.close(result);
  }
  getType(type: number){
    if(type == 1)
      return "bar";
    return "line";
  }
}
