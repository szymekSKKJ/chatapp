const globalLoadingElement = document.querySelector('#global-loading');

const globalLoading = (status) => {
    status === 'show' ? globalLoadingElement.style.display = 'flex' : null;
    status === 'hide' ? globalLoadingElement.style.display = 'none' : null;
}

export default globalLoading;