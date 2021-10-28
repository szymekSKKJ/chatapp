const submitByEnterKey = (submitButton, inputs) => {
    const addEnterListener = (event) => {
        if (event.key === '13' || event.which === '13' || event.code === 'Enter') {
            submitButton.click();
        }
    }
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keyup', addEnterListener);
    }
}

export default submitByEnterKey;

