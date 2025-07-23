import { Routes } from '@angular/router';
import { authGuard } from '../app/guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [authGuard]
  },
  
  // Profile Routes
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'profile/edit',
    loadComponent: () => import('./pages/edit-profile/edit-profile.page').then(m => m.EditProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'profile/change-password',
    loadComponent: () => import('./pages/change-password/change-password.page').then(m => m.ChangePasswordPage),
    canActivate: [authGuard]
  },
  {
    path: 'children',
    loadComponent: () => import('./pages/children/children.page').then(m => m.ChildrenPage),
    canActivate: [authGuard]
  },
  {
    path: 'children/add',
    loadComponent: () => import('./pages/add-child/add-child.page').then(m => m.AddChildPage),
    canActivate: [authGuard]
  },
  {
    path: 'children/:id',
    loadComponent: () => import('./pages/child-detail/child-detail.page').then(m => m.ChildDetailPage),
    canActivate: [authGuard]
  },
  {
    path: 'children/:id/edit',
    loadComponent: () => import('./pages/edit-child/edit-child.page').then( m => m.EditChildPage)
  },
// Growth Routes (Complete)
{
  path: 'growth/:childId',
  loadComponent: () => import('./pages/growth-records/growth-records.page').then(m => m.GrowthRecordsPage),
  canActivate: [authGuard]
},
{
  path: 'growth/:childId/add',
  loadComponent: () => import('./pages/add-growth-record/add-growth-record.page').then(m => m.AddGrowthRecordPage),
  canActivate: [authGuard]
},
{
  path: 'growth/:childId/chart',
  loadComponent: () => import('./pages/growth-chart/growth-chart.page').then(m => m.GrowthChartPage),
  canActivate: [authGuard]
},
{
  path: 'growth/:childId/:recordId/edit',
  loadComponent: () => import('./pages/edit-growth-record/edit-growth-record.page').then(m => m.EditGrowthRecordPage),
  canActivate: [authGuard]
},
  {
    path: 'reminders/:childId',
    loadComponent: () => import('./pages/reminders/reminders.page').then( m => m.RemindersPage)
  },
  {
    path: 'reminders/:childId/add',
    loadComponent: () => import('./pages/add-reminder/add-reminder.page').then( m => m.AddReminderPage)
  },
  {
    path: 'reminders/:childId/:id/edit',
    loadComponent: () => import('./pages/edit-reminder/edit-reminder.page').then( m => m.EditReminderPage)
  },
  // {
  //   path: 'food-logs/:childId',
  //   loadComponent: () => import('./pages/food-logs/food-logs.page').then( m => m.FoodLogsPage)
  // },
  // {
  //   path: 'food-logs/:childId/add',
  //   loadComponent: () => import('./pages/add-food-log/add-food-log.page').then( m => m.AddFoodLogPage)
  // }

  // {
  //   path: '**',
  //   loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPage)
  // }
];
