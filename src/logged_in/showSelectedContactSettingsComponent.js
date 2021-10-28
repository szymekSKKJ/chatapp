const SelectedContactComponent = document.querySelector('#SelectedContact');
const upside = SelectedContactComponent.querySelector('#upside');
const showSelectedContactComponentSettingsButton = SelectedContactComponent.querySelector('#upside #contact-options #settings');
const SelectedContactSettingsComponent = document.querySelector('#SelectedContactSettings');
const profileImageElement = SelectedContactSettingsComponent.querySelector('#wrapper #contact-image');
const contactNameElement = SelectedContactSettingsComponent.querySelector('#wrapper #contact-name p');
const closeButton = SelectedContactSettingsComponent.querySelector('#upside #close-button');

const openFullImage = (event) => {
    window.open(event.target.src);
}

const writeFullContactName = (firstName, lastName) => {
    contactNameElement.innerHTML = `${firstName} ${lastName}`;
}

showSelectedContactComponentSettingsButton.addEventListener('click', () => {
    const profileImage = SelectedContactComponent.querySelector('#upside #contact-image img');
    SelectedContactSettingsComponent.style.display = 'block';
    profileImageElement.innerHTML = `<img src="${profileImage.src}">`;
    profileImageElement.addEventListener('click', openFullImage);
    setTimeout(() => {
        upside.style.top = '-70px'
        profileImageElement.style.transform = 'translateY(0px)';
        SelectedContactSettingsComponent.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        SelectedContactSettingsComponent.style.opacity = '1';
    }, 100);
});

closeButton.addEventListener('click', () => {
    profileImageElement.removeEventListener('click', openFullImage);
    setTimeout(() => {
        profileImageElement.style.transform = 'translateY(-200px)';
        SelectedContactSettingsComponent.style.backgroundColor = 'transparent';
        SelectedContactSettingsComponent.style.opacity = '0';
        upside.style.top = '0px';
        setTimeout(() => {
            SelectedContactSettingsComponent.style.display = 'none';
        }, 500);
    }, 100);
});

export { writeFullContactName };