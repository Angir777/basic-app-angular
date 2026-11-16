import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { SidebarMenuService, SidebarService } from '../../../shared/services';
import { SafeHtmlPipe } from '../../../shared/pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavItem } from '../../../shared/interfaces';
import { TranslatePipe } from '@ngx-translate/core';
import { navItems, othersItems } from '../../../shared/constants';
import { CredentialsService } from '../../../core/services';
import { ZardSidebarImports } from '@/zardui/components/sidebar/sidebar.imports';
import { ZardCollapsibleImports } from '@/zardui/components/collapsible/collapsible.imports';
import { ZardDropdownImports } from '@/zardui/components/dropdown/dropdown.imports';
import { ZardSidebarService } from '@/zardui/components/sidebar/sidebar.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import {
  Sidebar07TeamSwitcherComponent,
  type Sidebar07Team,
} from '@/zardui/blocks/sidebar-07/sidebar-07-team-switcher.component';
import {
  Sidebar07NavUserComponent,
  Sidebar07User,
} from '@/zardui/blocks/sidebar-07/sidebar-07-nav-user.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    TranslatePipe,
    RouterModule,
    SafeHtmlPipe,
    FontAwesomeModule,
    NgIcon,
    ...ZardSidebarImports,
    ...ZardCollapsibleImports,
    ...ZardDropdownImports,
    Sidebar07TeamSwitcherComponent,
    Sidebar07NavUserComponent,
    RouterLink,
  ],
  viewProviders: [provideIcons({ lucideChevronRight })],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  // State
  navItems = navItems;
  othersItems = othersItems;

  readonly teams: readonly Sidebar07Team[] = [
    { name: 'DAILO', logo: 'lucideGalleryVerticalEnd', plan: 'Workspace' },
    { name: 'Personal', logo: 'lucideCommand', plan: 'Workspace' },
  ];

  openSubmenu: string | null | number = null;
  subMenuHeights: Record<string, number> = {};
  @ViewChildren('subMenu') subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  // DI
  public readonly sidebarService = inject(SidebarService);
  private readonly sidebarMenuService = inject(SidebarMenuService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly credentialsService = inject(CredentialsService);

  protected readonly credentials = this.credentialsService.credentialsSignal;

  private readonly zardSidebar = inject(ZardSidebarService);

  /** Desktop icon-only mode: grouped items are shown as a dropdown instead of a collapsible. */
  protected readonly isCollapsed = computed(
    () => this.zardSidebar.state() === 'collapsed' && !this.zardSidebar.isMobile(),
  );

  constructor() {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
  }

  ngOnInit() {
    // Verify permissions for menu items
    this.navItems = this.sidebarMenuService.prepareMenu(this.navItems);
    this.othersItems = this.sidebarMenuService.prepareMenu(this.othersItems);

    // Subscribe to router events
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      }),
    );

    // Subscribe to combined observables to close submenus when all are false
    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(
        ([isExpanded, isMobileOpen, isHovered]) => {
          if (!isExpanded && !isMobileOpen && !isHovered) {
            // this.openSubmenu = null;
            // this.savedSubMenuHeights = { ...this.subMenuHeights };
            // this.subMenuHeights = {};
            this.cdr.detectChanges();
          } else {
            // Restore saved heights when reopening
            // this.subMenuHeights = { ...this.savedSubMenuHeights };
            // this.cdr.detectChanges();
          }
        },
      ),
    );

    // Initial load
    this.setActiveMenuFromRoute(this.router.url);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges(); // Ensure UI updates
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.isExpanded$
      .subscribe((expanded) => {
        if (!expanded) {
          this.sidebarService.setHovered(true);
        }
      })
      .unsubscribe();
  }

  onSubmenuClick() {
    this.isMobileOpen$
      .subscribe((isMobile) => {
        if (isMobile) {
          this.sidebarService.setMobileOpen(false);
        }
      })
      .unsubscribe();
  }

  get userInitials(): Sidebar07User | null {
    const credentials = this.credentials();

    if (!credentials) {
      return null;
    }

    return {
      name: `${credentials.firstName} ${credentials.lastName}`.trim(),
      email: credentials.email,
      avatar: credentials.avatarUrl ?? '',
    };
  }

  isActive(path: string): boolean {
    if (path === '/') {
      return this.router.url === '/';
    }

    return this.router.url.startsWith(path);
  }

  isMenuActive(nav: NavItem): boolean {
    if (!nav.subItems?.length) {
      if (!nav.path) {
        return false;
      }

      return this.isActive(nav.path);
    }

    return nav.subItems.some((subItem) => this.isActive(subItem.path));
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    const menuGroups = [
      { items: this.navItems, prefix: 'main' },
      { items: this.othersItems, prefix: 'others' },
    ];

    menuGroups.forEach((group) => {
      group.items.forEach((nav, i) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (currentUrl === subItem.path) {
              const key = `${group.prefix}-${i}`;
              this.openSubmenu = key;

              setTimeout(() => {
                const el = document.getElementById(key);
                if (el) {
                  this.subMenuHeights[key] = el.scrollHeight;
                  this.cdr.detectChanges(); // Ensure UI updates
                }
              });
            }
          });
        }
      });
    });
  }
}
