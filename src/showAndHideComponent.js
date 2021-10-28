const showAndHideComponent = (showComponent, hideComponent, display = 'block') => {
    showComponent.style.display = display;
    hideComponent.style.display = 'none';
    showComponent.animate([
        { opacity: '0' },
        { opacity: '1' }
    ], {
        duration: 500,
        easing: 'ease-in-out'
    });
}

export default showAndHideComponent;