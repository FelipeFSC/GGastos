
export class Utils {
    static getMoneyValue(moneyValue: string|undefined|null): number {
        let numberValue = 0;
        if (moneyValue) {
            let value: string = moneyValue.replace("R$", "");
            value = value.replace(".", "");
            value = value.replace(",", ".");
            numberValue = Number(value);
        }
        return numberValue;
    }
}