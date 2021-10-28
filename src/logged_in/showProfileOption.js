import showAndHideComponent from '../showAndHideComponent.js';
const ContactsComponent = document.querySelector('#Contacts');
const MyProfileComponent = document.querySelector('#MyProfile');
const MyProfileOptions = MyProfileComponent.querySelectorAll('.new-window');
const MyProfileOptionsComponent = document.querySelector('#MyProfileOptions');
const MyProfileOptionsOptions = MyProfileOptionsComponent.querySelectorAll('.option');
const backButton = MyProfileOptionsComponent.querySelector('#back-button');
let lastClickedOptionIndex = 0;

MyProfileOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
        if (option.className.includes('new-window')) {
            MyProfileOptionsOptions[lastClickedOptionIndex].style.display = 'none';
            showAndHideComponent(MyProfileOptionsComponent, Contacts);
            showAndHideComponent(MyProfileOptionsComponent, MyProfileComponent);
            MyProfileOptionsOptions[index].style.display = 'flex';
            //close component
            MyProfileComponent.click();
            backButton.addEventListener('click', () => {
                MyProfileOptionsOptions[index].style.display = 'none';
            });
        }
        lastClickedOptionIndex = index;
    });
});