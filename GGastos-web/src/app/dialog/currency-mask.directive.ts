import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[appCurrencyMask]'
})
export class CurrencyMaskDirective {

	private previousValue: string = '';

	constructor(private el: ElementRef) { }

	@HostListener('input', ['$event'])
	onInput(event: Event) {
		const input = event.target as HTMLInputElement;
		let value = input.value;

		// Remove caracteres não numéricos
		value = value.replace(/\D/g, '');

		// Se o valor não mudou, não atualize
		if (value === this.previousValue) {
			return;
		}

		// Atualiza a formatação
		value = this.formatCurrency(value);

		// Atualiza o campo apenas se o valor mudou
		if (input.value !== `R$ ${value}`) {
			this.previousValue = value;
			input.value = value ? `R$ ${value}` : '';
			// Dispara o evento de entrada manualmente
			this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}

	private formatCurrency(value: string): string {
		// Se o valor tiver mais de 2 dígitos, divide-o em parte inteira e decimal
		const length = value.length;

		// Parte decimal (últimos 2 dígitos)
		const decimalPart = value.slice(-2);
		// Parte inteira (restante dos dígitos)
		const integerPart = value.slice(0, -2);

		// Adiciona separadores de milhar
		const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

		// Retorna a parte formatada
		return `${formattedIntegerPart},${decimalPart}`;
	}

}
