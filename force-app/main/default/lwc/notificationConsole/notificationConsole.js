import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

export default class NotificationConsole extends LightningElement {
    @track
    notifications = [];
        async connectedCallback(){
            // Configure default error handler for the EMP API
                onError((error) => {
                    this.dispatchEvent(
                    new ShowToastEvent({
                        variant: "error",
                        title: "EMP API Error",
                        message: "Check your browser's developer console for more details."
                    })
                    );
                    console.log("EMP API error reported by server: ", JSON.stringify(error));
                });
                // Subscribe to our notification platform event with the EMP API
                // listen to all new events
                // and handle them with handleNotificationEvent
                this.subscription = await subscribe(
                    "/event/Notification__e",
                    -1,
                    (event) => this.handleNotificationEvent(event)
                );
                // Display a toast to inform the user that we're ready to receive notifications
                /* this.dispatchEvent(
                        new ShowToastEvent({
                            variant: 'success',
                            title: 'Ready to receive notifications'
                        })
                    );

                    this.notifications = [
                        { id: "id1", time: "00:01", message: "Greetings Trailblazer!" },
                        { id: "id2", time: "00:02", message: "Congratulations on building this first version of the app." },
                        { id: "id3", time: "00:03", message: "Beware of the bears." }
                    ];*/
            
        }
        
        handleClearClick() {
            this.notification = [];
        }

        get notificationCount() {
            return this.notifications.length;
        }

        handleNotificationEvent(event){
            console.dir(event);
            //parse event data
            const id  = event.data.event.replayId;
            const message = event.data.payload.Message__c;
            const utcDate = new Date(event.data.payload.CreatedDate);
            const time = `${utcDate.getMinutes()}:${utcDate.getSeconds()}`; //template literals or use +

            //add notification to view
            const notification = {
                id,
                message,
                time
            };

            this.notifications.push(notification);

            //show notification
            this.dispatchEvent(
                new ShowToastEvent({
                    variant: 'info',
                    title: message
                })
            );
        }

        disconnectedCallback() {
            // Unsubscribe from EMP API
            unsubscribe(this.subscription);
        }
    
}
/*

event.data.payload.CreatedDate is a string like "2025-04-28T12:34:56Z" (ISO 8601 format — in UTC).

new Date(...) parses that timestamp into a JavaScript Date object.

Then  extract minutes and seconds to show a friendly time like 12:34.
*/