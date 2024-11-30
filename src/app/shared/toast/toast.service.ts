import { Injectable } from '@angular/core';
import {ToastInfo} from "./toast-info.model";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: ToastInfo[] = [];

  show(body: string, type: "SUCCESS" | "DANGER") {
    let className;

    if (type === "DANGER") {
      className = "bg-danger text-light";
    } else {
      className = "bg-success text-light";
    }

    const toastInfo: ToastInfo = {body, className};
    this.toasts.push(toastInfo);
  }

  remove(toastToRemove: ToastInfo) {
    this.toasts = this.toasts.filter(toast => toast != toastToRemove);
  }
}
