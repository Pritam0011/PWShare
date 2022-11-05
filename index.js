const drop=document.querySelector('.drop-area');

const host=`https://pwshare-api.herokuapp.com`;
const upurl=`${host}/pwshare/files`
const emailurl=`${host}/pwshare/files/link-send`

drop.addEventListener("dragover",(e)=>{
    e.preventDefault()
    if(!drop.classList.contains('dragged')){
        drop.classList.add('dragged')
    }
})

drop.addEventListener('dragleave', ()=>{
    if(drop.classList.contains('dragged')){
        drop.classList.remove('dragged')
    }
})

const fileIpt=document.querySelector('#fileIpt')
drop.addEventListener('drop', (e)=>{
    e.preventDefault()
    drop.classList.remove('dragged')
    const files=e.dataTransfer.files;
    if(files.length){
        fileIpt.files=files;
        upload(fileIpt.files[0]);
    }
    
})

fileIpt.addEventListener('change', ()=>{
    upload(fileIpt.files[0]);
})
const browseBtn=document.querySelector('.browseBtn')
browseBtn.addEventListener('click', ()=>{
    fileIpt.click();
})

const ale=document.querySelector('.ale')
let aleTimer;
const showAle=(msg)=>{
    ale.innerHTML=`<b>${msg}</b>`
    ale.style.transform='translate(-50%,0)';
    clearTimeout(aleTimer)
    aleTimer=setTimeout(()=>{
    ale.style.transform='translate(-50%,-3.75rem)'
    },2000)
}

const progCon=document.querySelector('.prog-con')
const upload=(file)=>{
    progCon.style.display='block';
    const formData=new FormData();
    formData.append('myfile', file);

    const xhr=new XMLHttpRequest();
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            getLink(JSON.parse(xhr.response))
        showAle(`Upload Done`)
        }
    }
    xhr.upload.onprogress=upProg;
    xhr.upload.onerror=(e)=>{
    
        fileIpt.value="";
        showAle(`Check your network Connection and try again!`)
        // showAle(`Error: ${xhr.statusText}`)
    }
    xhr.open('POST', upurl);
    xhr.send(formData)
}

const fileUrl=document.querySelector('#fileUrl');
const afileUrl=document.querySelector('#afileUrl');
const linkCon=document.querySelector('.link-shareing-con')
const copyBtn=document.querySelector('#copyBtn')
const visitBtn=document.querySelector('#visitBtn')
const emailForm=document.getElementById('emailForm')
copyBtn.addEventListener('click', ()=>{
    fileUrl.select()
    fileUrl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(fileUrl.value);
    showAle('Link Copied')
})
visitBtn.addEventListener('click', ()=>{
    afileUrl.click()
})
const proBar=document.querySelector('.prog-bar')
const perS=document.querySelector('#per')
const upProg=(e)=>{
    const per=Math.round((e.loaded/e.total)*100);
    perS.innerText=per;
    proBar.style.transform=`scaleX(${per/100})`
}
const getLink=({file})=>{
    fileIpt.value="";
    progCon.style.display="none";
    linkCon.style.display='block'
    fileUrl.value=file;
    afileUrl.href=file;
    perS.innerText=0;
    proBar.style.transform=`scaleX(0)`
}
const mailspan=document.getElementById('mailspan')
const sendveCon=document.querySelector('.sendve-con')
const sendvem=document.getElementById('sendvem')
const bbtn=document.querySelector('.bbtn')
sendvem.addEventListener('click', ()=>{
    mailspan.style.display='block';
    bbtn.style.display='none'
    sendvem.style.display='none';
})
emailForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const url=fileUrl.value;
    const formData={
        uuid:url.split("/").splice(-1,1)[0],
        emailTo:emailForm.elements["emailTo"].value,
        emailFrom:emailForm.elements["emailFrom"].value
    }
    fetch(emailurl,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    }).then(res=>res.json()).then(({success})=>{
        if(success){
            mailspan.style.display='none';
            bbtn.style.display='block'
            sendvem.style.display='block';
            // sendveCon.style.float='right';
            showAle('Email Send Successfully')
        }else{
            showAle(`Can't Send Twice!`)
        }
    }).catch(err=>{
        
        showAle(`Check your network Connection and try again!`)
    })
})




