const ContactsComponent = document.querySelector('#Contacts');
const secondWrapper = ContactsComponent.querySelector('#second-wrapper');
const searcher = secondWrapper.querySelector('input');
let timeout = false;
const isEmpty = str => !str.trim().length;

searcher.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        if (isEmpty(searcher.value)) {
            const friendsListItems = ContactsComponent.querySelectorAll('.friends-list-item');
            friendsListItems.forEach((friend) => {
                const firstName = friend.querySelector('.name p:first-child');
                const lastName = friend.querySelector('.name p:nth-child(2)');
                firstName.classList.remove('found-friend');
                lastName.classList.remove('found-friend');
                friend.style.display = 'flex';
                setTimeout(() => {
                    friend.style.opacity = '1';
                }, 100);
            });
        }
        if (!isEmpty(searcher.value)) {
            const friendsListItems = ContactsComponent.querySelectorAll('.friends-list-item');
            const searchValue = searcher.value.toLowerCase().trim();
            friendsListItems.forEach((friend, index) => {
                const firstName = friend.querySelector('.name p:first-child');
                const lastName = friend.querySelector('.name p:nth-child(2)');
                const fullName = `${firstName.innerHTML.toLowerCase()} ${lastName.innerHTML.toLowerCase()}`.trim();
                const removeClass = () => {
                    firstName.classList.remove('found-friend');
                    lastName.classList.remove('found-friend');
                    friend.style.opacity = '1';
                    setTimeout(() => {
                        friend.style.display = 'flex';
                    }, 500);
                }
                if (firstName.innerHTML.toLowerCase() === searchValue) {
                    removeClass();
                    firstName.classList.add('found-friend');
                } else if (lastName.innerHTML.toLowerCase() === searchValue) {
                    removeClass();
                    lastName.classList.add('found-friend');
                } else if (firstName.innerHTML.toLowerCase().includes(searchValue)) {
                    removeClass();
                    firstName.classList.add('found-friend');
                } else if (lastName.innerHTML.toLowerCase().includes(searchValue)) {
                    removeClass();
                    lastName.classList.add('found-friend');
                } else if (fullName.includes(searchValue)) {
                    removeClass();
                    firstName.classList.add('found-friend');
                    lastName.classList.add('found-friend');
                } else {
                    removeClass();
                    // friend.style.display = 'none';
                    friend.style.opacity = '0';
                    setTimeout(() => {
                        friend.style.display = 'none';
                    }, 500);
                }
            });
        }
    }, 250);
});