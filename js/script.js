document.addEventListener('DOMContentLoaded', ()=>{
    //tabs
    const tabs = document.querySelectorAll('.tabheader__item');
    const tabcontent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');


    function HideAllContent()
    {
        tabcontent.forEach(tab =>{
            tab.classList.add('hide');
            tab.classList.remove('show');
            tab.classList.remove('fade');
        });

        tabs.forEach(tab =>{
            tab.classList.remove('tabheader__item_active');
        });
    }

    function ShowTabsContent(i = 0)
    {
        tabcontent[i].classList.add('show');
        tabcontent[i].classList.add('fade');
        tabcontent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    HideAllContent();
    ShowTabsContent();

    tabsParent.addEventListener('click',e =>{
        const target = e.target;
        if(target && target.classList.contains('tabheader__item'))
        {
            tabs.forEach((tab,i) =>
            {
                if(target == tab)
                {
                    HideAllContent();
                    ShowTabsContent(i);
                }
            });
        }
    });
    //tabs
    //timer
    const deadline = '2021-01-30';
    function getTimeRemaining(endtime)
    {
        const t = Date.parse(endtime) - Date.parse(new Date());
        const days = Math.floor(t/(1000*60*60*24));
        const hours = Math.floor((t/(1000*60*60)) % 24);
        const minutes = Math.floor((t/(1000*60)) % 60);
        const seconds = Math.floor((t/1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function setClock(parentBlock,endtime){
        const timer = document.querySelector(parentBlock);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        const timeInterval = setInterval(updateClock,1000);
        
        updateClock();
        
        function updateClock(){
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZeroPlace(t.days);
            hours.innerHTML = getZeroPlace(t.hours);
            minutes.innerHTML = getZeroPlace(t.minutes);
            seconds.innerHTML = getZeroPlace(t.seconds);

            if(t.total <= 0)
                clearInterval(timeInterval);
        }
    }

    function getZeroPlace(num)
    {   
        return (num >= 0 && num < 10) ? `${0}${num}` : `${num}`
    }
    setClock('.timer',deadline);
    //timer

    //Modal
    const modalTrigger = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector('.modal');
    const modalCloseBtn = document.querySelector('[data-close]');

    function CloseModal(){
        modal.classList.toggle('show');
        modal.classList.toggle('fade-modal');
        document.body.style.overflow = '';
    }

    function OpenModal(){
        modal.classList.toggle('show');
        modal.classList.toggle('fade-modal');
        document.body.style.overflow = 'hidden'; //Disables scrolling while in modal tab
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach(item =>{
        item.addEventListener('click',()=>{
           OpenModal();
        });
    })
    modalCloseBtn.addEventListener('click',()=>{
        CloseModal();
    });

    modal.addEventListener('click',(e)=>{
        if(e.target === modal)
            CloseModal();
    })

    document.addEventListener('keydown',(e)=>{
        if(e.code == 'Escape' && modal.classList.contains('show'))
            CloseModal();
    });

    const modalTimerId = setTimeout(OpenModal,15000);

    function ShowModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight)
        {
            OpenModal();
            window.removeEventListener('scroll',ShowModalByScroll);
        }
    }

    window.addEventListener('scroll',ShowModalByScroll);
    //modal

    //menu items
    class MenuItem
    {
        constructor(name,desc,price,imgurl,alt,parentSelector, ...classes)
        {
            this.name = name;
            this.desc = desc;
            this.price = price;
            this.img = imgurl;
            this.alt = alt;
            this.transfer = 27;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.changeToUAH();
        }

        changeToUAH(){
            this.price *= this.transfer;
        }

        render(){
            const element = document.createElement('div');
            if(!this.classes.length)
            {
                this.classes = 'menu__item'
                element.classList.add(this.classes);
            }
            else
                this.classes.forEach(className => element.classList.add(className));
            element.innerHTML = `
            <img src="${this.img}" alt="${this.alt}">
            <h3 class="menu__item-subtitle">Меню "${this.name}"</h3>
            <div class="menu__item-descr">${this.desc}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>`;
            this.parent.append(element);
        }
    }

    new MenuItem(
        'FIT',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        229,
        'img/tabs/vegy.jpg',
        'vegy',
        '.menu .container',
    ).render();
    new MenuItem(
        'Премиум',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        550,
        'img/tabs/elite.jpg',
        'elite',
        '.menu .container',
    ).render();
    new MenuItem(
        'Постное',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков. ',
        430,
        'img/tabs/post.jpg',
        'post',
        '.menu .container',
    ).render();
    //menu items

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.appendChild(statusMessage);
        
            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    statusMessage.textContent = message.failure;
                }
            });
        });
    }
});