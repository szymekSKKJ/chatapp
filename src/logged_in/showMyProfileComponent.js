const MyProfileComponent = document.querySelector('#MyProfile');
const ContactsComponent = document.querySelector('#Contacts');
const profileButton = ContactsComponent.querySelector('#profile');
const MyProfileContent = MyProfileComponent.querySelector('#content');
let isOpen = false;

const showMyProfileComponent = () => {
    if (isOpen === false) {
        MyProfileComponent.style.display = 'block';
        setTimeout(() => {
            MyProfileComponent.style.opacity = '1';
            setTimeout(() => {
                MyProfileContent.style.transform = 'translateX(0px)';
                isOpen = true;
            }, 250);
        }, 100);
    } else {
        MyProfileContent.style.transform = 'translateX(-100vw)';
        setTimeout(() => {
            MyProfileComponent.style.opacity = '0';
            setTimeout(() => {
                MyProfileComponent.style.display = 'none';
                isOpen = false;
            }, 250);
        }, 250);
    }
}

MyProfileContent.addEventListener('click', (event) => {
    event.stopPropagation();
});

MyProfileComponent.addEventListener('click', () => {
    showMyProfileComponent();
});

profileButton.addEventListener('click', () => {
    showMyProfileComponent();
});