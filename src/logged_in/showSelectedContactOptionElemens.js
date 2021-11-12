const SelectedContactOptionElementsComponent = document.querySelector('#SelectedContactOptionElements');
const SelectedContactOptionsComponent = document.querySelector('#SelectedContactOptions');
const selectedContactOptions = SelectedContactOptionsComponent.querySelectorAll('.option');
const SelectedContactOptionElements = SelectedContactOptionElementsComponent.querySelectorAll('.option');
const closeButton = SelectedContactOptionsComponent.querySelector('#close-button');

const animatePickableOption = (option, direction = 'normal') => {
    option.animate([
        { 
            left: '0px' ,
            transform: 'translateX(0) scale(1)'
        },
        { 
            left: '50%' ,
            transform: 'translateX(-50%) scale(1.33)'
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
                animatePickableOption(option, 'reverse');
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
                setTimeout(() => {
                    option.style.transform = 'translateX(0px)';
                }, index * 100);
            }
    });
});

const showOptionsOfThisOption = (optionCurrent, indexCurrent) => {
    selectedContactOptions.forEach((option, index) => {
        if (indexCurrent !== index) {
            setTimeout(() => {
                option.style.transform = 'translateX(-100vw)';
            }, index * 100);
        }
        else {
            optionCurrent.classList.add('current');
            optionCurrent.style.transform = `translateY(${(indexCurrent) * -50}px)`;
            animatePickableOption(optionCurrent);
            SelectedContactOptionElementsComponent.style.display = 'block';
            SelectedContactOptionElements[indexCurrent].style.display = 'block' ;
            setTimeout(() => {
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