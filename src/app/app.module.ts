import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainComponent } from './main/main.component';
import { ColumnComponent } from './column/column.component';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { EditTaskModalComponent } from './edit-task-modal/edit-task-modal.component';
import { TaskModalFrameComponent } from './shared/task-modal-frame/task-modal-frame.component';
import { CreateTaskModalComponent } from './create-task-modal/create-task-modal.component';
import { ConfirmDeleteBoardComponent } from './confirm-delete-board/confirm-delete-board.component';
import { ConfirmDeleteTaskComponent } from './confirm-delete-task/confirm-delete-task.component';
import { BoardModalFrameComponent } from './shared/board-modal-frame/board-modal-frame.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from  '@angular/common/http';
import { environment } from 'src/environments/environment.prod'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { Kanban365Component } from './kanban365/kanban365.component';
import { LoginComponent } from './login/login.component'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating'
import { CheckboxModule } from 'primeng/checkbox';
import { AuthInterceptor } from '../app/services/auth.interceptor';
import { ProfileModalFrameComponent } from './shared/profile-modal-frame/profile-modal-frame.component';
import { ProfileUserModalFrameComponent } from './shared/profile-user-modal-frame/profile-user-modal-frame.component';
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    ColumnComponent,
    TaskModalComponent,
    EditTaskModalComponent,
    TaskModalFrameComponent,
    CreateTaskModalComponent,
    ConfirmDeleteBoardComponent,
    ConfirmDeleteTaskComponent,
    BoardModalFrameComponent,
    Kanban365Component,
    LoginComponent,
    ProfileModalFrameComponent,
    ProfileUserModalFrameComponent,
    PhoneMaskDirective
  ],
  imports: [
    BrowserModule,
    TooltipModule,
    NgSelectModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    SplitButtonModule,
    ToastModule,
    RatingModule,
    CheckboxModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
