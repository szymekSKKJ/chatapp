import showAndHideComponent from '../showAndHideComponent.js';
const LoginFormComponent = document.querySelector('#LoginForm');
const SignupFormComponent = document.querySelector('#SignupForm');
const signUp = LoginFormComponent.querySelector('#sign-up');

signUp.addEventListener('click', () => {
    showAndHideComponent(SignupFormComponent, LoginFormComponent, 'flex');
});

const RememberPassowrdForm = document.querySelector('#RememberPassowrdForm');
const backButton = RememberPassowrdForm.querySelector('#back-button');
const signIn = SignupFormComponent.querySelector('#sign-in');

signIn.addEventListener('click', () => {
    showAndHideComponent(LoginFormComponent, SignupFormComponent, 'flex');
});

backButton.addEventListener('click', () => {
    showAndHideComponent(LoginFormComponent, RememberPassowrdForm, 'flex');
});

const forgotPasswordButton = LoginFormComponent.querySelector('#forgot-password-button');
const RememberPassowrdFormComponent = document.querySelector('#RememberPassowrdForm');

forgotPasswordButton.addEventListener('click', () => {
    showAndHideComponent(RememberPassowrdFormComponent, LoginFormComponent, 'flex')
});