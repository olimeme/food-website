document.addEventListener('DOMContentLoaded', ()=>{
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
});