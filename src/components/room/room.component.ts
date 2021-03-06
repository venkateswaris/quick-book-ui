  import { ModalController } from 'ionic-angular';
import { BookComponent } from '../book/book.component';
import { Component } from '@angular/core';
import { RoomStatusService } from '../services/room-status.service';
import { EventService } from '../services/event-service.service';
import * as moment from 'moment/moment';
import * as schedule from 'node-schedule';
import { Observable } from 'rxjs';
import { NavParams } from 'ionic-angular/index';

@Component({
  templateUrl: './room.component.html'
})
export class RoomComponent {

  public room = '';
  roomStatus: any;
  timer: string;

  constructor(private roomStatusService: RoomStatusService, public navParams: NavParams,
              public modalCtrl: ModalController, private eventService: EventService) {
    var getRoomStatus = function () {
      roomStatusService.getRoomStatus(this.room).subscribe((status) => {
        this.roomStatus = status;
        Observable.interval(1000).map(() => {
        }).subscribe(() => {
          this.setTimer();
        });
      });
    };

    this.room = navParams.get('room');;
    getRoomStatus.call(this);

    eventService.onRoomStatusChanged.subscribe((status) => {
      this.roomStatus = status;
    });

    var job = schedule.scheduleJob('*/1 * * * *', () => {
      getRoomStatus.call(this);
    });
    var getRoomStatus = function () {
      roomStatusService.getRoomStatus(this.room).subscribe((status) => {
        this.roomStatus = status;
        Observable.interval(1000).map(() => {
        }).subscribe(() => {
          this.setTimer();
        });
      });
    };

    this.room = navParams.get('room');;
    getRoomStatus.call(this);

    eventService.onRoomStatusChanged.subscribe((status) => {
      this.roomStatus = status;
    });

    schedule.scheduleJob('*/1 * * * *', () => {
      getRoomStatus.call(this);
    });
  }

  public book() {
    console.log("book button clicked");
    let profileModal = this.modalCtrl.create(BookComponent, {roomName: this.room});
    profileModal.present();
  }


  endMeeting() {
    // var endMeetingDialog = this.modal.confirm()
    //   .size('lg')
    //   .isBlocking(true)
    //   .showClose(true)
    //   .keyboard(27)
    //   .title('End Meeting')
    //   .body('Do you want to end this meeting?')
    //   .okBtn('Yes')
    //   .cancelBtn('No')
    //   .open();
    //
    // endMeetingDialog.then((dialogRef) => {
    //   dialogRef.result.then(() => this.endCurrentMeeting(), () => {});
    // })
    this.endCurrentMeeting();
  }

  private endCurrentMeeting() {
    this.roomStatusService.endMeeting(this.roomStatus.eventId).subscribe(() => {
        this.roomStatusService.getRoomStatus(this.room).subscribe((status) => {
          this.roomStatus = status;
        });
      }, () => console.log("Something went wrong!")
    );
  }

  private getEndTime() {
    if (this.isBooked())
      return moment(this.roomStatus['end']);
    else if (this.isAvailable())
      return moment(this.roomStatus['start']);
  }

  private setTimer() {
    let startTime = moment();
    let endTime = this.getEndTime();

    var duration = moment.duration(endTime.diff(startTime));
    var hours = parseInt(String(duration.asHours()));
    var minutes = parseInt(String(duration.asMinutes())) - hours * 60;
    var seconds = parseInt(String(duration.asSeconds())) - minutes * 60 - hours * 60 * 60;

    this.timer = `${hours}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  public isBooked() {
    return this.roomStatus && this.roomStatus.status === 'booked';
  }

  public isQuickBookMeeting() {
    return this.roomStatus && this.roomStatus.creator.indexOf("QuickBook Instant Meeting") !== -1;
  }

  public isAvailable() {
    return this.roomStatus && this.roomStatus.status === 'available';
  };

  private padZero(number) {
    // restricted to 1 - 2 digits only
    return ('0' + number).slice(-2);
  }
}
