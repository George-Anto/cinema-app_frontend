import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

import { Session } from 'src/app/models/session.model';
import { Movie } from 'src/app/models/movie.model';
import { SessionService } from 'src/app/services/session.service';
import { MovieService } from 'src/app/services/movie.service';
//import { CalendarService } from 'src/app/services/calendar.service';
import { parseISO } from 'date-fns/fp';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  @Input() sessions: Session[] = [];
  constructor(
    public sessionService: SessionService,
    private modal: NgbModal,
    private router: Router
  ) {}

  events: CalendarEvent[] = [];

  ngOnInit() {
    this.loadCalendarSessions();
    // alert('Warning');
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-ticket-alt"></i>',
      a11yLabel: 'Ticket Booking',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('View', event);
      },
    },
  ];

  refresh = new Subject<void>();

  loadCalendarSessions() {
    this.sessionService.getSessions().subscribe(
      (responseSessionData) => {
        for (let i = 0; i < responseSessionData.data.data.length; i++) {
          this.events.push({
            start: startOfDay(
              parseISO(responseSessionData.data.data[i].startDate)
            ),
            //end: addDays(new Date(), 1),
            title: responseSessionData.data.data[i].name,
            actions: this.actions,
            id: responseSessionData.data.data[i]._id,
            movieName: responseSessionData.data.data[i].movie.title,
            cinemaName: responseSessionData.data.data[i].cinema.name,
            seatsAvailable: responseSessionData.data.data[i].seatsAvailable,
            session: responseSessionData.data.data[i],
            startTime: responseSessionData.data.data[i].startTime,
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
    // console.log('----------222-----------');
    console.log(this.events);
  }

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  // activeDayIsOpen: boolean = false;

  // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  //   if (isSameMonth(date, this.viewDate)) {
  //     if (
  //       (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
  //       events.length === 0
  //     ) {
  //       this.activeDayIsOpen = false;
  //     } else {
  //       this.activeDayIsOpen = true;
  //       this.viewDate = date;
  //     }
  //   }
  // }

  // eventTimesChanged({
  //   event,
  //   newStart,
  //   newEnd,
  // }: CalendarEventTimesChangedEvent): void {
  //   this.events = this.events.map((iEvent) => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd,
  //       };
  //     }
  //     return iEvent;
  //   });
  //   this.handleEvent('Dropped or resized', event);
  // }

  onBook(session: Session) {
    localStorage.setItem('sessionToBookData', JSON.stringify(session));
    this.router.navigate(['/main-menu/book-session']);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
