import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { RoomComponent } from '../components/room/room.component';
import { BookComponent } from '../components/book/book.component';
import { EventService } from '../components/services/event-service.service';
import { RoomStatusService } from '../components/services/room-status.service';
import { HomeComponent } from '../components/home/home.component';

@NgModule({
  declarations: [
    MyApp,
    HomeComponent,
    RoomComponent,
    BookComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RoomComponent,
    HomeComponent,
    BookComponent
  ],
  providers: [RoomStatusService, EventService]
})
export class AppModule {}
