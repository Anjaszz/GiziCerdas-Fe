import {
    Component,
    ContentChild,
    TemplateRef,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    AfterViewInit,
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  
  interface Tab {
    id: string;
    label: string;
  }
  
  type TabVariant = 'underline' | 'pills' | 'bordered';
  
  @Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tabs.component.html',
    styles: [`
      .tabs-scroll-container {
        width: 100%;
        position: relative;
      }
  
      @media (max-width: 1024px) {
      
      }
    `]
  })
  export class TabsComponent implements AfterViewInit {
    @Input() variant: TabVariant = 'underline';
    @Input() initialTab?: string;
    @Input() tabItems: Tab[] = [];
  
    @Output() tabChanged = new EventEmitter<string>();
  
    @ContentChild('leftIconTemplate') leftIconTemplate?: TemplateRef<any>;
    @ContentChild('rightIconTemplate') rightIconTemplate?: TemplateRef<any>;
    @ContentChild('textTemplate') textTemplate!: TemplateRef<any>;
    
    @ViewChild('tabsContainer') tabsContainer?: ElementRef;
  
    activeTabId: string = 'tab1';
  
    ngOnInit() {
      if (this.initialTab) {
        this.activeTabId = this.initialTab;
      }
    }
  
    ngAfterViewInit() {
      this.scrollToActiveTab();
    }
  
    setActiveTab(tabId: string) {
      if (this.activeTabId !== tabId) {
        this.activeTabId = tabId;
        this.tabChanged.emit(tabId);
        setTimeout(() => {
          this.scrollToActiveTab();
        }, 0);
      }
    }
  
    private scrollToActiveTab() {
        if (window.innerWidth <= 1024 && this.tabsContainer) {
          const container = this.tabsContainer.nativeElement;
          const activeTab = container.querySelector(`[data-tab-id="${this.activeTabId}"]`);
          
          if (activeTab) {
            const tabRect = activeTab.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            const targetScrollLeft = activeTab.offsetLeft - (containerRect.width / 2) + (tabRect.width / 2);
            
            container.scrollTo({
              left: targetScrollLeft,
              behavior: 'smooth'
            });
          }
        }
      }
  
    getContainerClasses(): string {
      if (this.variant === 'pills') {
        return 'flex space-x-1 gap-2';
      } else if (this.variant === 'bordered') {
        return 'flex border-2 border-line-default w-fit rounded-lg pl-1';
      } else {
        return 'flex lg:border-b-2 lg:border-line-default';
      }
    }
  
    getTabClasses(tabId: string): string {
      const baseClasses = 'flex items-center gap-2 lg:px-6 px-4 py-3 cursor-pointer relative font-semibold text-xs sm:text-base whitespace-nowrap';
      
      if (this.variant === 'pills') {
        const borderClasses = 'flex items-center gap-2 px-4 py-1.5 cursor-pointer relative font-medium text-base text-text-bolder';
        const activeState = this.activeTabId === tabId
          ? 'bg-tint-brand-default text-text-primary rounded-lg'
          : '';
        return `${borderClasses} ${activeState}`;
      }
      
      if (this.variant === 'bordered') {
        const borderClasses = 'flex items-center gap-2 px-14 py-5 cursor-pointer relative font-medium text-base text-text-bolder border-r-2 justify-center';
        const activeState = this.activeTabId === tabId
          ? 'bg-surface-default text-text-primary'
          : '';
        return `${borderClasses} ${activeState}`;
      }
  
      // For underline variant, we now use border-bottom instead of absolute indicator
      return `${baseClasses} ${
        this.activeTabId === tabId 
          ? 'text-text-primary after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-bold-yellow-default after:w-full' 
          : 'text-text-subtle hover:text-text-primary'
      }`;
    }
  
    getIconClasses(tabId: string): string {
      return this.activeTabId === tabId 
        ? 'text-text-primary' 
        : 'text-icon-subtler';
    }
  
    // Since we're using border-bottom now, we don't need the indicator
    getIndicatorClasses(tabId: string): string {
      return 'hidden';
    }
  }