import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';

const TREE_DATA: any[] = [
    {
        name: 'Fruit',
        test: 'asasdas',
        children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
    },
    {
        name: 'Vegetables',
        children: [
            {
                name: 'Green',
                children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
            },
            {
                name: 'Orange',
                children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
            },
        ],
    },
];
  

interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

@Component({
    selector: 'app-category-report',
    templateUrl: './category-report.component.html',
    styleUrls: ['./category-report.component.css']
})
export class CategoryReportComponent implements OnInit {
    
    @Output() isLoaded = new EventEmitter<boolean>();

    isLoad: boolean = true;

    options: any = {
        tooltip: {
            trigger: 'item'
        },

        series: [{
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            color: [
                '#37A2DA',
                '#32C5E9',
                '#67E0E3',
                '#9FE6B8',
                '#FFDB5C',
                '#ff9f7f',
            ],
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
            ]
        }]
    };





    private transformer = (node: any, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
        };
    };

    treeControl = new FlatTreeControl<ExampleFlatNode>(
        node => node.level,
        node => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this.transformer,
        node => node.level,
        node => node.expandable,
        node => node.children,
    );
      
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    constructor() {
        this.dataSource.data = TREE_DATA;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoaded.emit();
            this.isLoad = false;

            console.log('CATEGORY REPORT');
        }, 1000);
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
