import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TesteComponent } from '../dialog/teste/teste.component';
import { ExtractDataService } from '../extract-data.service';
import { CategoriesService } from '../categories/categories.service';
import { ReleasesService } from '../releases/releases.service';
import { AccountsService } from '../accounts/accounts.service';

@Component({
    selector: 'app-releases-upload',
    templateUrl: './releases-upload.component.html',
    styleUrls: ['./releases-upload.component.css']
})
export class ReleasesUploadComponent implements OnInit {

    constructor(
        private dialog: MatDialog,
        private extractDataService: ExtractDataService,
        private categoriesService: CategoriesService,
        private releasesService: ReleasesService,
        private accountsService: AccountsService,
    ) { }

    ngOnInit(): void {
        this.findAllAccountsAndCreditCards();
        this.findIncomeCategory();
        this.findExpensesCategory();
    }

    groupedList: any[] = [];
    expanded: boolean[] = [];


    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result as string;
            const transactions = this.parseCSV(text);
            this.groupedList = this.groupByDescription(transactions);
            this.expanded = new Array(this.groupedList.length).fill(false); // inicia tudo fechado


            this.boraArrumar(this.groupedList);
        };

        reader.readAsText(file);
    }

    toggle(index: number): void {
        this.expanded[index] = !this.expanded[index];
    }

    parseCSV(csv: string): any[] {
        const lines = csv.trim().split('\n');
        const transactions: any[] = [];

        for (const line of lines) {
            const [date, amount, id, ...descParts] = line.split(',');
            let description = descParts.join(',').trim();
            description = this.cleanDescription(description);

            transactions.push({
                date: date.trim(),
                amount: parseFloat(amount),
                id: id.trim(),
                description,
            });
        }

        return transactions;
    }

    cleanDescription(desc: string): string {
        desc = desc.replace(/•{3}\.\d{3}\.\d{3}-•{2}/g, '');

        // Remove "Transferência..." genérica (com ou sem Pix)
        desc = desc.replace(/Transfer[êe]ncia (recebida|enviada)( pelo Pix)?\s*[-:]?\s*/gi, '');

        // Remove "Pix recebido de", "Pix enviado para", etc.
        desc = desc.replace(/Pix (recebido de|enviado para)\s*[-:]?\s*/gi, '');

        // Remove agência e conta
        desc = desc.replace(/Agência:\s*\d+/gi, '');
        desc = desc.replace(/Conta:\s*\d+/gi, '');

        // Remove espaços duplicados e hifens extras
        desc = desc.replace(/-+/g, '-');
        desc = desc.replace(/\s{2,}/g, ' ').trim();

        // Se ainda sobrar hífen no final ou início, remove
        desc = desc.replace(/^-+|-+$/g, '').trim();

        return desc;
    }

    groupByDescription(transactions: any[]): any[] {
        const map = new Map<string, any[]>();

        for (const tx of transactions) {
            const category = this.extractCategoryName(tx.description);

            if (!map.has(category)) {
                map.set(category, []);
            }

            map.get(category)!.push(tx);
        }

        // Agora convertemos para o formato [{ category, transactions }]
        return Array.from(map.entries()).map(([category, transactions]) => ({
            category,
            transactions,
        }));
    }

    extractCategoryName(description: string): string {
        if (description.includes('NuInvest')) return 'NuInvest';
        if (description.includes('Pix - VANESSA')) return 'Pix - VANESSA';
        if (description.includes('Rendimento')) return 'Rendimentos';
        return description;
    }

    boraArrumar(data: any) {
        console.log("aaaaaaaaaaaaaaaaaaa");
        // console.log(data);

        console.log(data);

        for (let item of data) {

        }

    }



    accounts: any = [];
    expenseCategories: any = [];
    incomeCategories: any = [];
    findAllAccountsAndCreditCards () {
        let success = (accountsCreditCards: any) => {
            this.accounts = accountsCreditCards;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.accountsService.findAllAccountsAndCreditCards()
            .subscribe(this.extractDataService.extract(success, err));
    }

    findIncomeCategory() {
        let success = (categories: any) => {
            this.incomeCategories = categories;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.categoriesService.findByType("receita")
            .subscribe(this.extractDataService.extract(success, err));
    }

    findExpensesCategory() {
        let success = (categories: any) => {
            this.expenseCategories = categories;
        }

        let err = (error: any) => {
            console.log(error);
        }

        this.categoriesService.findByType("despesa")
            .subscribe(this.extractDataService.extract(success, err));
    }




    onCategoryAction(item: any): void {
        console.log('Cliquei na categoria:');


        const dialogRef = this.dialog.open(TesteComponent, {
            width: '600px',
            data: {
                groupedList: item,
                accounts: this.accounts,
                expenseCategories: this.expenseCategories,
                incomeCategories: this.incomeCategories
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Usuário confirmou:', result);

                let success = (data: any) => {}
        
                let err = (error: any) => {}
        
                let data = {
                    accountId: result.account.id,
                    categoryId: result.category.id,
                    transactions: result.transactions.transactions
                }

                console.log(data);

                this.releasesService.teste(data)
                    .subscribe(this.extractDataService.extract(success, err));

            } else {
                console.log('Usuário cancelou');
            }
        });

        // this.groupedList = this.groupedList.filter(group => group !== item);

    }
}