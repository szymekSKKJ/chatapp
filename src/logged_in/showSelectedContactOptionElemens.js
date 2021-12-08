const SelectedContactOptionElementsComponent = document.querySelector('#SelectedContactOptionElements');
const SelectedContactOptionsComponent = document.querySelector('#SelectedContactOptions');
const selectedContactOptions = SelectedContactOptionsComponent.querySelectorAll('.option');
const SelectedContactOptionElements = SelectedContactOptionElementsComponent.querySelectorAll('.option');
const closeButton = SelectedContactOptionsComponent.querySelector('#close-button');

const animateNotChoosenOptions = (option, index, direction = 'normal') => {
    option.animate([
        { 
            transform: 'translateX(0)'
        },
        { 
            transform: 'translateX(-100vw)'
        }
      ], {
        duration: 500,
        fill: 'forwards',
        easing: 'ease-in-out',
        direction: direction,
        delay: index * 100
      });
}

const animatePickableOption = (option, indexCurrent, direction = 'normal') => {
    option.animate([
        { 
            left: '0px' ,
            transform: 'translateX(0) scale(1) translateY(0)'
        },
        { 
            left: '50%' ,
            transform: `translateX(-50%) scale(1.33) translateY(${(indexCurrent) * -50}px)`
        }
      ], {
        duration: 500,
        fill: 'forwards',
        easing: 'ease-in-out',
        direction: direction
      });
}

closeButton.addEventListener('click', () => {
    selectedContactOptions.forEach((option, index) => {
            if (option.className.includes('current')) {
                animatePickableOption(option, index, 'reverse');
                SelectedContactOptionElementsComponent.style.transform = 'translateX(-100vh)';
                setTimeout(() => {
                    option.classList.remove('current');
                }, 500);
                setTimeout(() => {
                    SelectedContactOptionElementsComponent.style.display = 'none';
                    SelectedContactOptionElements[index].style.display = 'none' ;
                }, 125);
            }
            else {
                //option.style.display = 'flex';
                animateNotChoosenOptions(option, index, 'reverse');
            }
    });
});

const setupCorrectTopOfSelectedContactOptionElementsComponent = () => {
    const { top, height } = selectedContactOptions[0].getBoundingClientRect();
    SelectedContactOptionElementsComponent.style.top = `${top + height}px`;
}

const showOptionsOfThisOption = (optionCurrent, indexCurrent) => {
    selectedContactOptions.forEach((option, index) => {
        if (indexCurrent !== index) {
            animateNotChoosenOptions(option, index);
        }
        else {
            optionCurrent.classList.add('current');
            optionCurrent.style.transform = `translateY(${(indexCurrent) * -50}px)`;
            animatePickableOption(optionCurrent, indexCurrent);
            SelectedContactOptionElementsComponent.style.display = 'block';
            SelectedContactOptionElements[indexCurrent].style.display = 'block' ;
            setTimeout(() => {
                setupCorrectTopOfSelectedContactOptionElementsComponent();
                SelectedContactOptionElementsComponent.style.transform = 'translateX(0px)';
            }, 125);
        }
    });
}

selectedContactOptions.forEach((option, index) => {
    if (option.className.includes('pickable')) {
        option.addEventListener('click', () => {
            showOptionsOfThisOption(option, index);
        });
    }
});