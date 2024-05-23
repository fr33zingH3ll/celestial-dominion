import { login } from "./api.js";

class AuthLogin {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            const login = document.getElementById('login');
            login.addEventListener('submit', this.handleLoginSubmit.bind(this));
        });
    }

    async handleLoginSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            await login(username, password);
            console.log('Login successful');
            window.location.replace("/");
        } catch (error) {
            console.error('Login failed:', error.message);
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.textContent = `Login failed: ${error.message}`;
                errorMessage.style.display = 'block';
            }
        }
    }
}

const auth = new AuthLogin();
