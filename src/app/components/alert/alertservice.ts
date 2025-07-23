import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertVariant = 'simple' | 'withlist' | 'withaction' | 'detail' | 'accentborder' | 'closeicon' | 'completed' | 'completedborder';
export type AlertPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
export type AlertColor = 'error' | 'info' | 'success' | 'brand' | 'discovery' | 'green' | 'warning' | 'custom' | undefined;

interface BaseAlert {
  id: number;
  variant: AlertVariant;
  title: string;
  position: AlertPosition;
  duration?: number;
  color?: AlertColor;
  timerId?: any;
  remainingTime?: number;
  startTime?: number;
  showIcon?: boolean; 
}

export interface SimpleAlert extends BaseAlert {
  variant: 'simple';
  message: string;
}

export interface WithListAlert extends BaseAlert {
  variant: 'withlist';
  items: string[];
}

export interface ActionAlert extends BaseAlert {
  variant: 'withaction';
  message: string;
  statusUrl?: string;
}

export interface DetailAlert extends BaseAlert {
  variant: 'detail'| 'accentborder' | 'closeicon';
  message: string;
  detailText: string;
}

export interface CompletedAlert extends BaseAlert {
  variant: 'completed';
  message: string;
  detailText: string;
  primaryAction: string;
  secondaryAction: string;
}

export interface CompletedBorderAlert extends BaseAlert {
  variant: 'completedborder';
  message: string;
  detailText: string;
}

export type Alert = SimpleAlert | WithListAlert | ActionAlert | DetailAlert | CompletedAlert | CompletedBorderAlert;

export type CreateSimpleAlertParams = Omit<SimpleAlert, 'id' | 'position'> & { position?: AlertPosition };
export type CreateWithListAlertParams = Omit<WithListAlert, 'id' | 'position'> & { position?: AlertPosition };
export type CreateActionAlertParams = Omit<ActionAlert, 'id' | 'position'> & { position?: AlertPosition };
export type CreateDetailAlertParams = Omit<DetailAlert, 'id' | 'position'> & { position?: AlertPosition };
export type CreateCompletedAlertParams = Omit<CompletedAlert, 'id' | 'position'> & { position?: AlertPosition };
export type CreateCompletedBorderAlertParams = Omit<CompletedBorderAlert, 'id' | 'position'> & { position?: AlertPosition };
export type CreateAlertParams = CreateSimpleAlertParams | CreateWithListAlertParams | CreateActionAlertParams | 
  CreateDetailAlertParams | CreateCompletedAlertParams | CreateCompletedBorderAlertParams;

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private toasts: Alert[] = [];
  private toastsSubject = new BehaviorSubject<Alert[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(params: CreateAlertParams & { color?: AlertColor }) {
    const id = Date.now();
    const newAlert: Alert = {
      ...params,
      id,
      position: params.position || 'top-right',
      color: params.color
    } as Alert;

    this.toasts = [...this.toasts, newAlert];
    this.toastsSubject.next(this.toasts);

    if (params.duration !== 0) {
      this.startTimer(id, params.duration || 5000);
    }
  }

  private startTimer(id: number, duration: number) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.remainingTime = duration;
      toast.startTime = Date.now();
      toast.timerId = setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  pauseTimer(id: number) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast?.timerId) {
      clearTimeout(toast.timerId);
      const elapsedTime = Date.now() - (toast.startTime || Date.now());
      toast.remainingTime = (toast.remainingTime || 0) - elapsedTime;
      toast.timerId = undefined;
    }
  }

  resumeTimer(id: number) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast?.remainingTime && toast.remainingTime > 0) {
      toast.startTime = Date.now();
      toast.timerId = setTimeout(() => {
        this.dismiss(id);
      }, toast.remainingTime);
    }
  }

  dismiss(id: number) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast?.timerId) {
      clearTimeout(toast.timerId);
    }
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastsSubject.next(this.toasts);
  }
  
  clearAll(): void {
    // Clear all timeouts for existing toasts
    this.toasts.forEach(toast => {
      if (toast.timerId) {
        clearTimeout(toast.timerId);
      }
    });
    
    // Clear the toasts array
    this.toasts = [];
    
    // Update the subscribers
    this.toastsSubject.next(this.toasts);
  }
}