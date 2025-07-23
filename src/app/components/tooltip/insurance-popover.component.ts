import { Component, Input, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
   <div 
      class="tooltip-container" 
      [class.show]="isVisible"
      [class.top]="placement === 'top'"
      [class.bottom]="placement === 'bottom'"
      [class.left]="placement === 'left'"
      [class.right]="placement === 'right'"
      [style.left]="position.x + 'px'"
      [style.top]="position.y + 'px'">
      <div class="tooltip-content text-center">
        <div class="tooltip-arrow"></div>
        <div class="tooltip-text">{{ text }}</div>
        <div class="tooltip-text" *ngIf="desc">{{ desc }}</div>
      </div>
    </div>
  `,
  styles: [`
    .tooltip-container {
      position: absolute;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .tooltip-container.show {
      opacity: 1;
    }

    .tooltip-content {
      position: relative;
      background-color: #1a2b4b;
      color: white;
      padding: 8px 8px;
      border-radius: 4px;
      font-size: 14px;
      white-space: nowrap;
    }

    /* Bottom placement */
    .tooltip-container.bottom .tooltip-content {
      transform: translateX(-50%);
      margin-top: 8px;
    }

    .tooltip-container.bottom .tooltip-arrow {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #1a2b4b;
    }

    /* Top placement */
    .tooltip-container.top .tooltip-content {
      transform: translateX(-50%) translateY(-100%);
      margin-top: -8px;
    }

    .tooltip-container.top .tooltip-arrow {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #1a2b4b;
    }

    /* Right placement */
    .tooltip-container.right .tooltip-content {
      transform: translateY(-50%);
      margin-left: 8px;
    }

    .tooltip-container.right .tooltip-arrow {
      position: absolute;
      left: -7px;
      top: 50%;
      transform: translateY(-50%);
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right: 8px solid #1a2b4b;
    }

    /* Left placement */
    .tooltip-container.left .tooltip-content {
      transform: translateY(-50%) translateX(-100%);
      margin-left: -8px;
    }

    .tooltip-container.left .tooltip-arrow {
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid #1a2b4b;
    }

    .tooltip-arrow {
      width: 6px;
      height: 4px;
    }
  `]
})
export class TooltipComponent implements OnDestroy {
  @Input() text: string = '';
  @Input() desc?: string = '';
  @Input() isVisible: boolean = false;
  @Input() position = { x: 0, y: 0 };
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() parentContainer?: HTMLElement;

  private scrollHandler: any;
  private resizeHandler: any;
  private initialOffset = { x: 0, y: 0 };

  constructor(private elementRef: ElementRef) {
    this.scrollHandler = this.updatePositionOnScroll.bind(this);
    this.resizeHandler = this.updatePositionOnScroll.bind(this);
  }

  ngOnChanges() {
    if (this.isVisible) {
      if (this.parentContainer) {
        // Calculate initial offset from parent container
        const parentRect = this.parentContainer.getBoundingClientRect();
        this.initialOffset = {
          x: this.position.x - parentRect.left,
          y: this.position.y - parentRect.top
        };
      }
      
      // Add scroll listener when tooltip becomes visible
      window.addEventListener('scroll', this.scrollHandler, true);
      window.addEventListener('resize', this.resizeHandler);
    } else {
      // Remove listeners when tooltip is hidden
      this.removeEventListeners();
    }
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  private removeEventListeners() {
    window.removeEventListener('scroll', this.scrollHandler, true);
    window.removeEventListener('resize', this.resizeHandler);
  }

  updatePositionOnScroll() {
    if (!this.isVisible || !this.parentContainer) return;
    
    // Get current parent container position
    const parentRect = this.parentContainer.getBoundingClientRect();
    
    // Update position based on parent container's position and initial offset
    this.position = {
      x: parentRect.left + this.initialOffset.x,
      y: parentRect.top + this.initialOffset.y
    };
  }
}