export interface SelectSearchModel {
  displayLabel: string;
  controlName: string;
  filterControlName?: string;
  keyPath: string | string[];
  searchKey: string;
  trigger?: boolean;
  triggerKeyPath?: string;
  searchPlaceholderLabel: string;
  selectPlaceholderLabel: string;
  isRequired?: boolean;
  validationMsg?: string;
  selectMulti?: boolean;
  selectedValueCompairId?: string;
  isDisabled?: boolean;
  isClearRequired?: boolean;
}
