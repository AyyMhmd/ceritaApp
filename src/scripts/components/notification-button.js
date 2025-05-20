import NotificationHelper from '../utils/notification-helper';

class NotificationButton extends HTMLElement {
    constructor() {
        super();
        this._isSubscribed = false;
    }

    connectedCallback() {
        this._render();
        this._initButton();
    }

    async _initButton() {
        if (!NotificationHelper.isSupportedByBrowser()) {
            console.error('Notification not supported in this browser');
            this.style.display = 'none';
            return;
        }

        this._isSubscribed = await NotificationHelper.isCurrentlySubscribed();
        this._updateButton();

        this.querySelector('button').addEventListener('click', async () => {
            if (this._isSubscribed) {
                await this._unsubscribeNotification();
            } else {
                await this._subscribeNotification();
            }
        });
    }

    async _subscribeNotification() {
        try {
            const success = await NotificationHelper.subscribe();
            if (success) {
                this._isSubscribed = true;
                this._updateButton();
                // Show notification or alert
                if (window.Notification && Notification.permission === 'granted') {
                    new Notification('Berhasil subscribe notifikasi!');
                } else if (window.Notification && Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('Berhasil subscribe notifikasi!');
                        } else {
                            alert('Silakan izinkan notifikasi di browser Anda untuk mendapatkan pop-up notifikasi.');
                        }
                    });
                } else {
                    alert('Silakan izinkan notifikasi di browser Anda untuk mendapatkan pop-up notifikasi.');
                }
            }
        } catch (err) {
            console.error('Failed to subscribe push notification:', err);
            alert('Failed to subscribe to notifications. Please try again.');
        }
    }

    async _unsubscribeNotification() {
        try {
            const success = await NotificationHelper.unsubscribe();
            if (success) {
                this._isSubscribed = false;
                this._updateButton();
                // Show notification or alert
                if (window.Notification && Notification.permission === 'granted') {
                    new Notification('Berhasil unsubscribe notifikasi!');
                } else if (window.Notification && Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('Berhasil unsubscribe notifikasi!');
                        } else {
                            alert('Silakan izinkan notifikasi di browser Anda untuk mendapatkan pop-up notifikasi.');
                        }
                    });
                } else {
                    alert('Silakan izinkan notifikasi di browser Anda untuk mendapatkan pop-up notifikasi.');
                }
            }
        } catch (err) {
            console.error('Failed to unsubscribe push notification:', err);
            alert('Failed to unsubscribe from notifications. Please try again.');
        }
    }

    _updateButton() {
        const button = this.querySelector('button');
        if (!button) return;

        const text = this._isSubscribed ? 'Unsubscribe Notification' : 'Subscribe Notification';
        const icon = this._isSubscribed ? 'bell-slash' : 'bell';

        button.innerHTML = `
            <i class="fas fa-${icon}"></i>
            ${text}
        `;
        button.classList.toggle('subscribed', this._isSubscribed);
    }

    _render() {
        this.innerHTML = `
            <button class="notification-button">
                <i class="fas fa-bell"></i>
                Subscribe Notification
            </button>
        `;
    }
}

customElements.define('notification-button', NotificationButton); 