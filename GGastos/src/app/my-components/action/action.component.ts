import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

    @Input() title: string = "";
    @Output() onClose = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    onEmitClose() {
        this.onClose.emit();
    }
}
