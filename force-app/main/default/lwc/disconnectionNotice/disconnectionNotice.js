import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe } from 'lightning/empApi';



export default class DisconnectionNotice extends LightningElement {
    subscription = {};
    status;
    identifier;
    channelName = '/event/Asset_Disconnection__e';

    connectedCallback() {
        this.handleSubscribe();
    }

    renderedCallback(){
        
    }

    handleSubscribe() {
        //Implement your subscribing solution here 
        const messageCallback = function(response){
            console.log(JSON.stringify(reponse));
            const assetId = message.data.payload.Asset_Identifier__c;
            const isDisconnected = message.data.payload.Disconnected__c;

            if (isDisconnected) {
                this.showSuccessToast(assetId);
            } else {
                this.showErrorToast();
            }
        }
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            console.log(
                'Subscription sent to: ',
                JSON.stringify(response.channel)
            );
        });

        subscribe(this.channelName, -1, this.messageCallback)
            .then(response => {
                this.subscription = response;
                console.log('Subscribed channel:', this.channelName);
            })
            .catch(error => {
                console.error('error:', error);
            });

    }

    disconnectedCallback() {
        //Implement your unsubscribing solution here
        if (this.subscription) {
            unsubscribe(this.subscription)
                .then(() => {
                    console.log('Unsubscribed ');
                    this.subscription = null;
                })
                .catch(error => {
                    console.error('Unsubscribe error:', error);
                });
        }
    }

    showSuccessToast(assetId) {
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Asset Id '+assetId+' is now disconnected',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    showErrorToast() {
        const event = new ShowToastEvent({
            title: 'Error',
            message: 'Asset was not disconnected. Try Again.',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

}