const authorizationSwitchError = (errorMessage) => {
    console.log(errorMessage)
    const language = localStorage.getItem('language');
    let returnedMessage;
    if (language === '_pl') {
        switch (errorMessage) {
            case 'auth/invalid-email':
                returnedMessage = 'Podany email jest nieprawidłowy';
                break;
            case 'auth/user-not-found':
                returnedMessage = 'Użytkownik z podanym emailem nie istnieje';
                break;
            case 'auth/weak-password':
                returnedMessage = 'Podane hasło jest za słabe';
                break;
            case 'auth/wrong-password':
                returnedMessage = 'Podane hasło jest nieprawidłowe';
                break;
            default:
                returnedMessage = 'Coś poszło nietak';
        }
    } else {
        switch (errorMessage) {
            case 'auth/invalid-email':
                returnedMessage = 'Given email is incorrect';
                break;
            case 'auth/user-not-found':
                returnedMessage = 'User with given email does not exist';
                break;
            case 'auth/weak-password':
                returnedMessage = 'Given password is too weak';
                break;
            case 'auth/wrong-password':
                returnedMessage = 'Given password is incorect';
                break;
            default:
                returnedMessage = 'Something went wrong';
        }
    }
    return returnedMessage;
}

export default authorizationSwitchError;