import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Cinema } from 'src/app/models/cinema.model';
import { Movie } from 'src/app/models/movie.model';
import { Session } from 'src/app/models/session.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-book-session',
  templateUrl: './book-session.component.html',
  styleUrls: ['./book-session.component.css'],
})
export class BookSessionComponent implements OnInit, OnDestroy {
  @ViewChild('emailForm') emailForm: NgForm;
  currentSession: Session;
  currentCinema: Cinema;
  currentMovie: Movie;
  noSession: boolean = false;
  bookPressed: boolean = false;
  totalSeats: number[] = [];
  isLoading: boolean = false;
  error: string = null;
  success: string = null;
  reservedSeats;

  seatConfig: any = null;
  seatmap = [];
  seatChartConfig = {
    showRowsLabel: false,
    showRowWisePricing: false,
    newSeatNoForRow: false,
  };
  cart = {
    selectedSeats: [],
    seatstoStore: [],
    totalamount: 0,
    cartId: '',
    eventId: 0,
  };

  title = 'seat-chart-generator';

  constructor(
    private sessionService: SessionService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.initializeSessionData();

    if (!this.currentSession) {
      this.noSession = true;
      return;
    }

    //Process a simple bus layout
    this.seatConfig = [
      {
        seat_price: 250,
        seat_map: [
          {
            seat_label: '1',
            layout: 'gggggggggggggggg',
          },
          {
            seat_label: '2',
            layout: 'gggggggggggggggg',
          },
          {
            seat_label: '3',
            layout: 'gggggggggggggggg',
          },
          {
            seat_label: '4',
            layout: 'gggggggggggggggg',
          },
          {
            seat_label: '5',
            layout: 'gggggggggggggggg',
          },
        ],
      },
    ];
  }

  initializeSessionData() {
    this.currentSession = JSON.parse(localStorage.getItem('sessionToBookData'));
    this.sessionService.getOneCinema(this.currentSession.cinema._id).subscribe(
      (responseData) => {
        this.currentCinema = responseData.data.data;
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
    this.sessionService.getOneMovie(this.currentSession.movie._id).subscribe(
      (responseData) => {
        this.currentMovie = responseData.data.data;
        // console.log(this.currentMovie);
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
    this.sessionService.getOneSession(this.currentSession._id).subscribe(
      (responseData) => {
        const seatsLayout = responseData.data.data.seatsLayout;
        const blockSeatsArgument = this.calculateBlockedSeats(seatsLayout);
        this.processSeatChart(this.seatConfig);
        this.blockSeats(blockSeatsArgument);
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );

    // console.log(this.currentSession);
  }

  calculateBlockedSeats(seatsLayout): string {
    // const seatsLayout = this.currentCinema.seatsLayout;

    let argumentString: string = '';

    for (let i = 0; i < seatsLayout.length; i++) {
      for (let j = 0; j < seatsLayout[i].length; j++) {
        if (seatsLayout[i][j] === 1) {
          argumentString += `${i + 1}_${j + 1},`;
        }
      }
    }
    return argumentString;
  }

  public processSeatChart(map_data: any[]) {
    if (map_data.length > 0) {
      var seatNoCounter = 1;
      for (let __counter = 0; __counter < map_data.length; __counter++) {
        var row_label = '';
        var item_map = map_data[__counter].seat_map;

        //Get the label name and price
        row_label = 'Row ' + item_map[0].seat_label + ' - ';
        if (item_map[item_map.length - 1].seat_label != ' ') {
          row_label += item_map[item_map.length - 1].seat_label;
        } else {
          row_label += item_map[item_map.length - 2].seat_label;
        }
        row_label += ' : Rs. ' + map_data[__counter].seat_price;

        item_map.forEach((map_element) => {
          var mapObj = {
            seatRowLabel: map_element.seat_label,
            seats: [],
            seatPricingInformation: row_label,
          };
          row_label = '';
          var seatValArr = map_element.layout.split('');
          if (this.seatChartConfig.newSeatNoForRow) {
            seatNoCounter = 1; //Reset the seat label counter for new row
          }
          var totalItemCounter = 1;
          seatValArr.forEach((item) => {
            var seatObj = {
              key: map_element.seat_label + '_' + totalItemCounter,
              price: map_data[__counter]['seat_price'],
              status: 'available',
            };

            if (item != '_') {
              seatObj['seatLabel'] =
                map_element.seat_label + ' ' + seatNoCounter;
              if (seatNoCounter < 10) {
                seatObj['seatNo'] = '0' + seatNoCounter;
              } else {
                seatObj['seatNo'] = '' + seatNoCounter;
              }

              seatNoCounter++;
            } else {
              seatObj['seatLabel'] = '';
            }
            totalItemCounter++;
            mapObj['seats'].push(seatObj);
          });
          // console.log(' \n\n\n Seat Objects ', mapObj);
          this.seatmap.push(mapObj);
        });
      }
    }
  }

  public selectSeat(seatObject: any) {
    // console.log('Seat to block: ', seatObject);
    if (seatObject.status == 'available') {
      seatObject.status = 'booked';
      this.cart.selectedSeats.push(seatObject.seatLabel);
      this.cart.seatstoStore.push(seatObject.key);
      this.cart.totalamount += seatObject.price;
    } else if ((seatObject.status = 'booked')) {
      seatObject.status = 'available';
      var seatIndex = this.cart.selectedSeats.indexOf(seatObject.seatLabel);
      if (seatIndex > -1) {
        this.cart.selectedSeats.splice(seatIndex, 1);
        this.cart.seatstoStore.splice(seatIndex, 1);
        this.cart.totalamount -= seatObject.price;
      }
    }
  }

  public blockSeats(seatsToBlock: string) {
    if (seatsToBlock != '') {
      var seatsToBlockArr = seatsToBlock.split(',');
      for (let index = 0; index < seatsToBlockArr.length; index++) {
        var seat = seatsToBlockArr[index] + '';
        var seatSplitArr = seat.split('_');
        // console.log('Split seat: ', seatSplitArr);
        for (let index2 = 0; index2 < this.seatmap.length; index2++) {
          const element = this.seatmap[index2];
          if (element.seatRowLabel == seatSplitArr[0]) {
            var seatObj = element.seats[parseInt(seatSplitArr[1]) - 1];
            if (seatObj) {
              // console.log('\n\n\nFount Seat to block: ', seatObj);
              seatObj['status'] = 'unavailable';
              this.seatmap[index2]['seats'][parseInt(seatSplitArr[1]) - 1] =
                seatObj;
              // console.log('\n\n\nSeat Obj', seatObj);
              // console.log(
              //   this.seatmap[index2]['seats'][parseInt(seatSplitArr[1]) - 1]
              // );
              break;
            }
          }
        }
      }
    }
  }

  onBook() {
    const selectedSeats = this.cart.selectedSeats.length;
    const seatstoStore = this.cart.seatstoStore;
    let reservedSeatsLayout = Array.from(
      Array(selectedSeats),
      () => new Array(2)
    );

    for (let i = 0; i < selectedSeats; i++) {
      this.totalSeats.push(i);
      for (let j = 0; j < 2; j++) {
        if (j === 0) {
          reservedSeatsLayout[i][j] =
            parseInt(seatstoStore[i].substring(0, 1)) - 1;
        } else if (j === 1) {
          reservedSeatsLayout[i][j] =
            parseInt(seatstoStore[i].substring(4, 2)) - 1;
        }
      }
    }
    this.reservedSeats = reservedSeatsLayout;
    console.log(this.reservedSeats);
    this.bookPressed = true;
  }

  onSubmit() {
    if (!this.emailForm.valid) return;

    this.isLoading = true;

    const emailArray: string[] = [];

    for (let i = 0; i < this.totalSeats.length; i++) {
      emailArray.push(this.emailForm.value[`email${i}`]);
    }

    this.reservationService
      .createReservation(
        this.currentSession._id,
        this.totalSeats.length,
        this.reservedSeats,
        emailArray
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.error = null;
          this.success = `You have successfully booked your tickets for the movie!
           An email with your tickets will be sent to the provided emails.`;
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse?.error?.message) {
            this.showErrorMessage(errorResponse);
            console.log(errorResponse.error.message);
          } else {
            this.error = errorResponse.message;
          }
          this.success = null;
          console.log(errorResponse);
        }
      );
  }

  private showErrorMessage(errorResponse) {
    if (errorResponse.error.message.includes('Seats')) {
      this.error = 'Seats already reserved.';
    } else if (errorResponse.error.message.includes('emails')) {
      this.error = 'You have entered invalid emails.';
    } else {
      this.error = 'An error occured, please try again later.';
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('sessionToBookData');
  }
}
