import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-left-menu',
    templateUrl: './left-menu.component.html',
    styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {

    constructor(
        private router: Router,
    ) { }

    ngOnInit(): void {
    }

    onHome() {
        this.router.navigate(['home']);
    }

    onReleases() {
        this.router.navigate(['releases']);
    }

    onInvestments() {
        this.router.navigate(['investments']);
    }

    onReports() {
        this.router.navigate(['reports']);
    }

    onSpendingLimit() {
        this.router.navigate(['spending-limit']);
    }

    onCategories() {
        this.router.navigate(['categories']);
    }

    onCards() {
        this.router.navigate(['cards']);
    }

    onAccounts() {
        this.router.navigate(['accounts']);
    }
}
