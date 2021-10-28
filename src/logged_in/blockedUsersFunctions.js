import displayGlobalPopoutMessage from '../displayGlobalPopoutMessage.js';
const MyProfileOptionsComponent = document.querySelector('#MyProfileOptions');
const blockedUsersList = MyProfileOptionsComponent.querySelector('#blocked-users #blocked-users-list');
const blockedUsers = MyProfileOptionsComponent.querySelectorAll('.blocked-user');

const addShowPopoutMessageOnClick = (user, functionToExecute) => {
    const [userName, userSurname] = user.querySelectorAll('.name p');
    user.addEventListener('click', () => {
        displayGlobalPopoutMessage(`Are you sure to unblock ${userName.innerHTML} ${userSurname.innerHTML}`, functionToExecute);
    });
}

export default addShowPopoutMessageOnClick;