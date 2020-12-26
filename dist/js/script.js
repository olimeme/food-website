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
        document.body.style.overflow = '';
    }

    function OpenModal(){
        modal.classList.toggle('show');
        document.body.style.overflow = 'hidden'; //Disables scrolling while in modal tab
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
    //modal
});