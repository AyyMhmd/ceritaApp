class AuthModel {
    static setAuthData({ token, userId, name }) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('name', name);
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getUserId() {
        return localStorage.getItem('userId');
    }

    static getName() {
        return localStorage.getItem('name');
    }

    static clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
    }
}

export default AuthModel; 