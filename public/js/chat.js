
const socket = io()

const $messageForm =  document.querySelector('#message-form');
const $sendLocation = document.querySelector('#sendLocation');
const $messageInput = document.querySelector('#message');

const $messageBox = document.querySelector('#message-box');
const $sidebarBox = document.querySelector('#sidebar-box');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll = () => {

    const $newMessage = $messageBox.lastElementChild;

    const newMessageStyle = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    
    const visibleHeight = $messageBox.offsetHeight;

    const containerHeight = $messageBox.scrollHeight;

    const scrollOffset = $messageBox.scrollTop+visibleHeight;
    if(containerHeight-newMessageHeight<=scrollOffset){
        $messageBox.scrollTop = $messageBox.scrollHeight;
    }
}

    socket.on('renderLocation',(location)=>{
       // console.log(location);
        const html = Mustache.render(locationTemplate,{
            username:location.username,
            location:location.text,
            createdAt:moment(location.createdAt).format('hh:mm a')
        });
        $messageBox.insertAdjacentHTML('beforeend',html);
        autoscroll()
        
    });
    socket.on('message',(message)=>{
       // console.log(message);
        const html = Mustache.render(messageTemplate,{
            username:message.username,
            message:message.text,
            createdAt:moment(message.createdAt).format('hh:mm a')
        });
        $messageBox.insertAdjacentHTML('beforeend',html);
        autoscroll();
        
    });

    $messageForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        let message = $messageInput.value;
       // console.log("Sending text:"+message);
        socket.emit('sendText',message,(error)=>{
            $messageInput.value = '';
            $messageInput.focus();
        });
    });

    document.querySelector('#sendLocation').addEventListener('click',(e)=>{

        if(!navigator.geolocation){
            return alert("Geo Location is not supported!!!")
        }
        navigator.geolocation.getCurrentPosition((position)=>{
            console.log(position);
            let location = {
                longitude : position.coords.longitude,
                latitute : position.coords.latitude
            }
            socket.emit('send-location',location);
        });
    });

    socket.emit('join',{username, room},(error)=>{
        if(error){
            alert(error);
            location.href='/'
        }
    });

    socket.on('roomData',({room, users})=>{

        const html = Mustache.render(sidebarTemplate,{
            room:room,
            users:users
        });
        $sidebarBox.innerHTML=html;
    })