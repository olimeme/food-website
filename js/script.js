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

    function CloseModal(){
        modal.classList.remove('show');
        modal.classList.remove('fade-modal');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    function OpenModal(){
        modal.classList.add('show');
        modal.classList.add('fade-modal');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; //Disables scrolling while in modal tab
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach(item =>{
        item.addEventListener('click',()=>{
           OpenModal();
        });
    });

    modal.addEventListener('click',(e)=>{
        if(e.target === modal || e.target.getAttribute('data-close') === '')
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
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.img = src;
            this.alt = alt;
            this.name = title;
            this.desc = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH(){
            this.price *= this.transfer;
        }

        render(){
            const element = document.createElement('div');
            if(!this.classes.length){
                this.classes = 'menu__item'
                element.classList.add(this.classes);
            }
            else{
                this.classes.forEach(className => element.classList.add(className));
            }
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
    
    getResources('http://localhost:3000/menu')
    .then(data =>{
        data.forEach(({img,altimg,title,descr,price}) => {
            new MenuItem(img,altimg,title,descr,price,'.menu .container').render();
        });
    });
    //menu items

    //Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url,data) =>{
        const res = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    async function getResources(url) {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }



    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 15px auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests',json)
            .then(data=>{
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(()=>{
                showThanksModal(message.failure);
            }).finally(()=>{
                form.reset();
            });
        });
    }
    
    function showThanksModal(message)
    {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        OpenModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            CloseModal();
        },4000);
    }

    //forms

    //slider
    const slides = document.querySelectorAll('.offer__slide');
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    const current = document.querySelector('#current');
    const total = document.querySelector('#total');

    let slideIndex = 1;

    showSlides(slideIndex);

    function showSlides(n){
        if(n > slides.length)
            slideIndex = 1;

        if(n < 1)
            slideIndex = slides.length;

        slides.forEach(item => item.style.display = 'none');

        slides[slideIndex - 1].style.display = 'block';

        total.textContent = `0${slides.length}`;

        if(slideIndex >= 10)
            current.textContent = slideIndex;
        else
            current.textContent = `0${slideIndex}`;
    }

    function plusSlides(n){
        showSlides(slideIndex+=n);
    }

    prev.addEventListener('click',()=>{
        plusSlides(-1);
    });
    next.addEventListener('click',()=>{
        plusSlides(1);
    });
});