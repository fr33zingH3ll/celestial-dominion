import { register } from "../../api.js";

class AuthRegister {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            const register = document.getElementById('register');
            register.addEventListener('submit', this.handleRegisterSubmit.bind(this));
        });
    }

    async handleRegisterSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const confirm_password = formData.get('confirm_password');

        try {
            await register(username, password, confirm_password);
            console.log('Register successful');
            window.location.replace("/");
        } catch (error) {
            console.error('Register failed:', error.message);
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.textContent = `Register failed: ${error.message}`;
                errorMessage.style.display = 'block';
            }
        }
    }
}

const auth = new AuthRegister();
