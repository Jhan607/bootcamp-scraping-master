let btnscrap = document.getElementById('btnscrap')

btnscrap.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if(tab !== null){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapingProfile,
        });
    }
})

const scrapingProfile = ()=>{
    const wait = function(milliseconds){
        return new Promise(function(resolve){
            setTimeout(function() {
                resolve();
            }, milliseconds);
        });
    };

    const profile = {
        personalInformation:{},
        education:[],
        workExperience:[]
    };

    //Información personal

    const elementNameProfile = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 ul li")
    profile.personalInformation.name = elementNameProfile? elementNameProfile.innerText:'';

    const elementNameTitle = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 h2")
    profile.personalInformation.title = elementNameTitle? elementNameTitle.innerText:'';

    const elementLocation = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 ul.mt1 > li.t-16")
    profile.personalInformation.location = elementLocation? elementLocation.innerText:'';

    const elementMoreResume = document.getElementById('line-clamp-show-more-button')
    if(elementMoreResume) elementMoreResume.click();

    const elementResume = document.querySelector('section.pv-about-section > p')
    profile.personalInformation.resume = elementResume? elementResume.innerText:'';

    document.querySelector(".global-footer.global-footer--static.ember-view").scrollIntoView();


    //Informacion de educacion

    const education = document.querySelector('#education-section').getElementsByTagName('li');

    if(education)
    {
        for(let i = 0; i<education.length; i++){
            const institution = education[i].querySelector('a > .pv-entity__summary-info  h3').innerText;
            const level = education[i].querySelector('a > .pv-entity__summary-info  p span.pv-entity__comma-item').innerText;
            const period  = education[i].querySelectorAll('div p.pv-entity__dates span')[1]?.innerText||"";
            profile.education.push({institution,level,period})
        }
    }

    wait(2000).then(() => {

    //Experiencia laboral

    const experience = document.querySelector('section.pv-profile-section.experience-section.ember-view ul');
    if(experience)
    {
        for (let i = 0; i < experience.childElementCount; i++) {

            const expCompany =  experience.children[i].querySelector('p.pv-entity__secondary-title');
            const company = expCompany ? expCompany.innerText : '';

            const expPosition =  experience.children[i].querySelector('h3.t-16.t-black.t-bold');
            const position = expPosition ? expPosition.innerText : '';

            const expPeriod =  experience.children[i].querySelector('h4.pv-entity__date-range.t-14 > span:not(.visually-hidden)');
            const period = expPeriod ? expPeriod.innerText : '';

            const expFunctions  = experience.children[i].querySelector('p.pv-entity__description');
            const functions  = expFunctions ? expFunctions.innerText : '';

            profile.workExperience.push({company,position,period,functions});
        }
    }

        console.log({profile})
    });
}