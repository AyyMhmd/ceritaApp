import CONFIG from '../config';

const NotificationHelper = {
    async requestPermission() {
        if (!this.isSupportedByBrowser()) {
            console.error('Notification not supported in this browser');
            return false;
        }

        if (this.isGranted()) {
            return true;
        }

        const permission = await Notification.requestPermission();

        if (permission === 'denied') {
            alert('Please allow notification permission to receive updates');
            return false;
        }

        if (permission === 'default') {
            alert('Notification permission closed or ignored');
            return false;
        }

        return true;
    },

    isSupportedByBrowser() {
        return 'Notification' in window;
    },

    isGranted() {
        return Notification.permission === 'granted';
    },

    async getSubscription() {
        const registration = await navigator.serviceWorker.ready;
        return registration.pushManager.getSubscription();
    },

    async isCurrentlySubscribed() {
        const subscription = await this.getSubscription();
        return !!subscription;
    },

    async subscribe() {
        try {
            const permissionGranted = await this.requestPermission();
            if (!permissionGranted) {
                return false;
            }

            const isSubscribed = await this.isCurrentlySubscribed();
            if (isSubscribed) {
                console.log('Already subscribed to push notifications');
                return true;
            }

            console.log('Subscribing to push notifications...');
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this._urlBase64ToUint8Array(CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY),
            });

            await this._sendSubscriptionToServer(subscription);
            console.log('Successfully subscribed to push notifications');
            return true;
        } catch (err) {
            console.error('Failed to subscribe to push notifications:', err);
            return false;
        }
    },

    async unsubscribe() {
        try {
            const subscription = await this.getSubscription();
            if (!subscription) {
                console.log('No existing push notification subscription');
                return true;
            }

            try {
                await this._removeSubscriptionFromServer(subscription);
            } catch (serverError) {
                console.warn('Failed to remove subscription from server:', serverError);
            }

            await subscription.unsubscribe();
            console.log('Successfully unsubscribed from push notifications');
            return true;
        } catch (err) {
            console.error('Failed to unsubscribe from push notifications:', err);
            return false;
        }
    },

    async _sendSubscriptionToServer(subscription) {
        const subscriptionJSON = subscription.toJSON();
        const accessToken = localStorage.getItem('token');
        const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                endpoint: subscriptionJSON.endpoint,
                keys: {
                    p256dh: subscriptionJSON.keys.p256dh,
                    auth: subscriptionJSON.keys.auth
                }
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to send subscription to server');
        }
        return response.json();
    },

    async _removeSubscriptionFromServer(subscription) {
        const subscriptionJSON = subscription.toJSON();
        const accessToken = localStorage.getItem('token');
        const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                endpoint: subscriptionJSON.endpoint,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Failed to remove subscription from server');
        }
        return response.json();
    },

    _urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    },
};

export default NotificationHelper;
