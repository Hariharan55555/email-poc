import { Component, Injectable, Type } from '@angular/core';
import { CommandBarDialogComponent } from './dialogs/command-bar-dialog/command-bar-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComposeDialogComponent } from './dialogs/compose-dialog/compose-dialog.component';
import { AiResponseDialogComponent } from './dialogs/ai-response-dialog/ai-response-dialog.component';
import { Router } from '@angular/router';
import { COMMON } from './constant';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public starredChange: Subject<void> = new Subject();
  public sideNavChange: Subject<string> = new Subject();
  public currentEmail: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // public dialogRef!: MatDialogRef<CommandBarDialogComponent> | null;
  // constructor(private dialog: MatDialog) { }

  // public openDialog(component: Type<any>, data: any): void {
  //   if (this.dialogRef) {
  //     console.log('Dialog is already open');
  //     return;
  //   }

  //   this.dialogRef = this.dialog.open(CommandBarDialogComponent, {
  //     height: data?.height || '80%',
  //     width: data?.width || '50%',
  //     panelClass: data?.panelClass || '',
  //     autoFocus: true,
  //   });

  //   this.dialogRef.afterClosed().subscribe(() => {
  //     this.dialogRef = null;
  //   });
  // }

  // public closeDialog(): void {
  //   this.dialogRef?.close();
  // }

  // Store references of the currently open dialogs by their names
  public dialogRefs: Map<string, MatDialogRef<any>> = new Map();

  constructor(
    private dialog: MatDialog,
    private routes: Router,
    private http: HttpClient
  ) {
    this.initEmails();
  }

  public openDialog(dialogName: string, component: Type<any>, data: any): void {
    // Check if the dialog is already open
    if (this.dialogRefs.has(dialogName)) {
      console.log(`${dialogName} dialog is already open`);
      return; // Don't open the same dialog again
    }

    // Close any other open dialog and open the new one
    // will comment this to use like gmail feature in future
    //  if (this.dialogRefs.size > 0) {
    //    this.dialogRefs.forEach((dialogRef: MatDialogRef<any>, name: string) => {
    //      dialogRef?.close();
    //      this.dialogRefs.delete(name);  // Remove it from the map
    //      console.log(`${name} dialog closed to open ${dialogName}`);
    //    });
    //  }

    const position =
      dialogName === COMMON.COMPOSE
        ? {
            bottom: '20px', // Distance from the bottom
            right: '20px', // Distance from the right
          }
        : {};
    // Open the new dialog
    const dialogRef = this.dialog.open(component, {
      height: data?.height,
      width: data?.width,
      panelClass: data?.panelClass || '',
      autoFocus: dialogName === COMMON.COMMAND_BAR,
      position,
      data,
      //  hasBackdrop: false,
    });

    // Store the dialog reference in the map
    this.dialogRefs.set(dialogName, dialogRef);

    // After the dialog is closed, remove it from the map
    dialogRef.afterClosed().subscribe(() => {
      this.dialogRefs.delete(dialogName);
      // console.log(`${dialogName} dialog closed`);
    });
  }

  public openComponentByName(dialogName: string, data?: any): void {
    switch (dialogName) {
      case 'commandBar':
        this.openDialog(COMMON.COMMAND_BAR, CommandBarDialogComponent, {
          height: '80%',
          width: '50%',
          panelClass: 'command-bar-dialog',
        });
        break;
      case 'compose':
        this.openDialog(COMMON.COMPOSE, ComposeDialogComponent, {
          width: '50%',
          panelClass: 'compose-dialog',
        });
        break;
      case 'aiResponse':
        this.openDialog(COMMON.AI_RESPONSE, AiResponseDialogComponent, {
          width: '50%',
          panelClass: 'ai-response-dialog',
          data,
        });
        break;
      default:
        break;
    }
  }

  public closeDialog(dialogName: string): void {
    if (this.dialogRefs.has(dialogName)) {
      const dialogRef = this.dialogRefs.get(dialogName);
      if (dialogRef) {
        dialogRef.close(); // Close the dialog
        this.dialogRefs.delete(dialogName); // Remove it from the map
        // console.log(`${dialogName} dialog closed manually.`);
      }
    } else {
      // console.log(`${dialogName} dialog is not open.`);
    }
  }

  public getAiResponse(emailContent: string): Observable<any> {
    return this.http.post(
      `https://vivantai.softsuavetestandpocs.in/api/v1/ai-response/`,
      { mail_content: emailContent }
    );
  }

  public initEmails(): void {
    const emailList = JSON.parse(localStorage.getItem('emailList') || '[]');
    if (!emailList.length) {
      localStorage.setItem(
        'emailList',
        JSON.stringify([
          {
            id: 1,
            sender: 'LinkedIn',
            subject: 'Connection Request from John Doe',
            date: '11/22/2024',
            body: "Hi, I came across your profile and would love to connect with you. I’m working in a similar industry and think we could have some interesting conversations. Let me know if you're open to networking or collaborating on projects. Looking forward to hearing from you!",
            isFavorite: false,
          },
          {
            id: 2,
            sender: 'Amazon',
            subject: 'Your Order Has Shipped!',
            date: '11/21/2024',
            body: "Hello, your recent order of 'Wireless Headphones' has shipped! The expected delivery date is 11/25/2024. You can track your package using the tracking number below. We appreciate your business and hope you enjoy your purchase. Thank you for shopping with Amazon!",
            isFavorite: false,
          },
          {
            id: 3,
            sender: 'Spotify',
            subject: 'Your 2024 Wrapped is Ready!',
            date: '11/20/2024',
            body: 'It’s that time of year! Your Spotify Wrapped is ready, and we’ve compiled all your top songs, artists, and podcasts of 2024. Relive your most-listened-to tracks and discover new favorites based on your habits. Check it out and share with your friends!',
            isFavorite: false,
          },
          {
            id: 4,
            sender: 'Netflix',
            subject: 'New Episodes of Your Favorite Show',
            date: '11/19/2024',
            body: "Good news! New episodes of 'The Crown' are now available on Netflix. Dive back into the royal drama with the latest season. We hope you're excited for more captivating storytelling. Stream now!",
            isFavorite: false,
          },
          {
            id: 5,
            sender: 'Apple',
            subject: 'Your Monthly Apple Subscription Invoice',
            date: '11/18/2024',
            body: 'Dear Customer, your subscription to Apple Music has been renewed for another month. The amount of $9.99 has been charged to your account. If you have any questions about your subscription or payment, please visit the Apple Support website.',
            isFavorite: false,
          },
          {
            id: 6,
            sender: 'Airbnb',
            subject: 'Your Upcoming Stay in Paris',
            date: '11/17/2024',
            body: "Hi there! We wanted to remind you that your stay in Paris at 'Charming Apartment with Eiffel View' is coming up on 12/01/2024. If you have any questions or need to make changes to your booking, feel free to contact your host. Safe travels!",
            isFavorite: false,
          },
          {
            id: 7,
            sender: 'Facebook',
            subject: 'Someone Tagged You in a Photo',
            date: '11/16/2024',
            body: "Hey, it looks like your friend Sarah tagged you in a new photo! Head over to Facebook to see what they’ve posted. You can adjust your privacy settings if you'd like to manage who can see these tags. Check it out now!",
            isFavorite: false,
          },
          {
            id: 8,
            sender: 'PayPal',
            subject: "You've Received a Payment",
            date: '11/15/2024',
            body: "Dear Customer, you've received a payment of $200.00 from John Smith. The funds are now available in your PayPal account and can be transferred to your bank at any time. If you have any questions, please contact our customer service team.",
            isFavorite: false,
          },
          {
            id: 9,
            sender: 'Udemy',
            subject: 'New Course Recommendations Based on Your Interests',
            date: '11/14/2024',
            body: "Hi there! Based on your recent course completion, we’ve curated a list of new courses we think you’ll love. Explore topics like 'Advanced Python Programming' or 'Digital Marketing Mastery.' Expand your skills today with special discounts!",
            isFavorite: false,
          },
          {
            id: 10,
            sender: 'Grammarly',
            subject: 'Writing Tips: How to Improve Your Email Etiquette',
            date: '11/13/2024',
            body: "Want to improve your professional emails? In this week's Grammarly tip, we focus on email etiquette: how to format, tone, and write clear and concise messages that get results. Read more to sharpen your writing skills today!",
            isFavorite: false,
          },
          {
            id: 11,
            sender: 'Slack',
            subject: 'You Have 3 Unread Messages',
            date: '11/12/2024',
            body: "You have 3 unread messages in your project channel. Don't miss out on important updates from your team. Log in to Slack to catch up and join the conversation. Need help managing notifications? Check out our notification settings guide.",
            isFavorite: false,
          },
          {
            id: 12,
            sender: 'YouTube',
            subject: 'New Video from Your Subscription',
            date: '11/11/2024',
            body: "Your subscribed channel 'Tech Innovations' has just uploaded a new video: 'Top 10 Gadgets of 2024.' Watch it now and stay ahead of the latest tech trends. Don’t forget to like and share if you enjoyed the content!",
            isFavorite: false,
          },
          {
            id: 13,
            sender: 'Delta Airlines',
            subject: 'Your Flight to New York is Confirmed',
            date: '11/10/2024',
            body: 'Dear Customer, your flight from Los Angeles to New York on 12/02/2024 has been confirmed. Your flight details are as follows: Flight DL456, departing at 8:30 AM. Please check in 24 hours before your flight. Safe travels!',
            isFavorite: false,
          },
          {
            id: 14,
            sender: 'Zoom',
            subject: 'Meeting Reminder: Team Sync at 3:00 PM',
            date: '11/09/2024',
            body: 'Just a reminder that you have a Zoom meeting scheduled for today at 3:00 PM. The meeting link is attached below. If you need to reschedule or cancel, please notify the attendees as soon as possible. Looking forward to seeing you there!',
            isFavorite: false,
          },
          {
            id: 15,
            sender: 'GitHub',
            subject: 'New Pull Request in Your Repository',
            date: '11/08/2024',
            body: "A new pull request has been submitted to your repository 'awesome-project.' Please review the changes and merge if everything looks good. Don’t forget to add comments if any revisions are needed. Happy coding!",
            isFavorite: false,
          },
        ])
      );
    }
  }
}
