const displayGlobalErrorFullspace = (backButton, errorComponent, errorCode = '') => {
    const globalErrorFullspace = document.querySelector('#global-error-fullspace');
    const backButtonElement = globalErrorFullspace.querySelector('#back-button');
    const errorCodeElement = globalErrorFullspace.querySelector('#error-code p');
    globalErrorFullspace.style.display = 'flex';
    errorComponent.style.pointerEvents = 'none';
    errorComponent.style.opacity = '0';
    errorCodeElement.innerHTML = errorCode;

    backButtonElement.addEventListener('click', () => {
        globalErrorFullspace.style.display = 'none';
        errorCodeElement.innerHTML = '';
        errorComponent.style.pointerEvents = 'all';
        errorComponent.style.opacity = '1';
        backButton.click();
    });

}
export default displayGlobalErrorFullspace;