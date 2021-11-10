const SelectedContactComponent = document.querySelector('#SelectedContact');
const upside = SelectedContactComponent.querySelector('#upside');
const showSelectedContactComponentSettingsButton = SelectedContactComponent.querySelector('#upside #contact-options #settings');
const SelectedContactOptionsComponent = document.querySelector('#SelectedContactOptions');
const profileImageElement = SelectedContactOptionsComponent.querySelector('#wrapper #contact-image');
const contactNameElement = SelectedContactOptionsComponent.querySelector('#wrapper #contact-name p');
const closeButton = SelectedContactOptionsComponent.querySelector('#upside #close-button');

const openFullImage = (event) => {
    window.open(event.target.src);
}

const writeFullContactName = (firstName, lastName) => {
    contactNameElement.innerHTML = `${firstName} ${lastName}`;
}

showSelectedContactComponentSettingsButton.addEventListener('click', () => {
    const profileImage = SelectedContactComponent.querySelector('#upside #contact-image img');
    SelectedContactOptionsComponent.style.display = 'block';
    profileImageElement.innerHTML = `<img src="${profileImage.src}">`;
    profileImageElement.addEventListener('click', openFullImage);
    setTimeout(() => {
        upside.style.top = '-70px'
        profileImageElement.style.transform = 'translateY(0px)';
        SelectedContactOptionsComponent.style.opacity = '1';
    }, 50);
});

closeButton.addEventListener('click', () => {
    profileImageElement.removeEventListener('click', openFullImage);
    setTimeout(() => {
        profileImageElement.style.transform = 'translateY(-200px)';
        SelectedContactOptionsComponent.style.opacity = '0';
        upside.style.top = '0px';
        setTimeout(() => {
            SelectedContactOptionsComponent.style.display = 'none';
        }, 500);
    }, 50);
});

export { writeFullContactName };