//buttons and video screen
// const videoScreen = document.querySelector('video');
// const btnStart = document.getElementById('btnStart');
// const btnStop = document.getElementById('btnStop');

const btnSelectSource = document.getElementById('btnSelectSource');

//add event handler
btnSelectSource.onclick =getAvailabeVideoScourse;

const {
    desktopCapturer,
    remote
} = require('electron')
const {
    Menu
} = remote;

//fetch the available video screen sources
async function getAvailabeVideoScourse() {
    //get the windows and screens
    const availableInputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    const inputVideoOptionList = Menu.buildFromTemplate(
        availableInputSources.map(source => {
            return {
                label: source.name,
                click: () => selectVideoSource()
            }
        })
    );

    inputVideoOptionList.popup();

}