import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js";
import displayGlobalNotification from '../displayGlobalNotification.js';
import loadProfileImage from './loadProfileImage.js';
import globalLoading from '../displayOrHideGlobalLoading.js';
import checkIfUserIsLogged from './loadFriendsList.js';
import restoreDefault from "../restoreDefault.js";
const MyProfileOptions = document.querySelector('#MyProfileOptions');
const changeProfileImage = MyProfileOptions.querySelector('#change-profile-image');
const submitButton = changeProfileImage.querySelector('#submit-button');
const imagePreviewElement = changeProfileImage.querySelector('#image-preview');
const imagePreview = changeProfileImage.querySelector('#image-preview img');
const inputTypeFile = submitButton.querySelector('input');
const backButton = MyProfileOptions.querySelector('#upside #back-button');
const language = localStorage.getItem('language');

backButton.addEventListener('click', () => {
    imagePreview.src = '';

});

inputTypeFile.addEventListener('click', (event) => {
    event.stopPropagation()
});

const uploadImage = (file) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            const storage = getStorage();
            const userProfileFiles = ref(storage, `${uid}/profile_image.jpg`);
            uploadBytes(userProfileFiles, file).then((snapshot) => {
                displayGlobalNotification('New profile image has been uploaded', 'success');
                if (language === '_pl')
                    displayGlobalNotification('Nowe zdjęcie poriflowe zostało zaaktualizowane', 'success');
                loadProfileImage();
                checkIfUserIsLogged();
                globalLoading('hide');
            });

        } else {
            restoreDefault('force');
        }
    });
}

const setImageInPreview = (input) => {
    if (input.files.length > 0) {
        const fr = new FileReader();
        fr.onload = function() {
            imagePreview.src = fr.result;
        }
        fr.readAsDataURL(input.files[0]);
        globalLoading('hide');
    } else {
        globalLoading('hide');
    }
}

const imageValidation = async(input) => {
    if (input.files.length === 1) {
        const lastDot = input.files[0].name.lastIndexOf('.');
        const fileExtension = input.files[0].name.substring(lastDot + 1);
        if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
            const reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = function(e) {
                const image = new Image();
                image.src = e.target.result;
                image.onload = function() {
                    const height = this.height;
                    const width = this.width;
                    if (height / width === 1 || height > width) {
                        uploadImage(input.files[0]);
                    } else {
                        displayGlobalNotification('Selected image must be a square or hegiht must be higher then width');
                        if (language === '_pl')
                            displayGlobalNotification('Wybrane zdjęcie musi być kwadratem lub wysokość musi być większa niż szerokość');
                        globalLoading('hide');
                    }
                };
            };
        } else {
            displayGlobalNotification('Selected file is not alowed');
            if (language === '_pl')
                displayGlobalNotification('Wybrany plik nie jest dozwolony');
            globalLoading('hide');
        }
    } else {
        displayGlobalNotification('First select an Image');
        if (language === '_pl')
            displayGlobalNotification('Najpierw wybierz zdjęcie');
        globalLoading('hide');
    }
}

imagePreviewElement.addEventListener('click', () => {
    const inputTypeFile = submitButton.querySelector('input');
    inputTypeFile.click();
    const getImage = () => {
        globalLoading('show');
        setTimeout(() => {
            setImageInPreview(inputTypeFile);
        }, 100);
        window.removeEventListener('focus', getImage);
    }
    window.addEventListener('focus', getImage);

});


submitButton.addEventListener('click', () => {
    const inputTypeFile = submitButton.querySelector('input');
    globalLoading('show');
    imageValidation(inputTypeFile);
});