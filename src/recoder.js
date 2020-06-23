//buttons and video screen
const videoScreen = document.querySelector('video');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const btnSelectSource = document.getElementById('btnSelectSource');

//add event handler
btnSelectSource.onclick = getAvailabeVideoScourse;

const {
    desktopCapturer,
    remote
} = require('electron')
const {
    Menu,
    dialog
} = remote;

const {
    writeFile
} = require('fs');

//fetch the available video screen sources
async function getAvailabeVideoScourse() {
    //get the windows and screens
    const availableInputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    //create a menu from the fetched list
    const inputVideoOptionList = Menu.buildFromTemplate(
        availableInputSources.map(source => {
            return {
                label: source.name,
                click: () => selectVideoSource(source)
            }
        })
    );

    inputVideoOptionList.popup();
}

//for capture the screen
let screenRecorder;
const recordedFootages = [];



btnStart.onclick = e => {
    screenRecorder.start();
    btnStart.classList.add('uk-button-primary');
    btnStart.innerText = 'Recording';
};

btnStop.onclick = e => {
    screenRecorder.stop();
    btnStart.classList.remove('uk-button-primary');
    btnStart.innerText = 'Start';
};

//input video source to record 
async function selectVideoSource(source) {
    btnSelectSource.innerText = source.name;

    const options = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    }

    //video record strem
    const videoStream = await navigator.mediaDevices.getUserMedia(options);

    //play the stream on the video canvas
    videoScreen.srcObject = videoStream;
    videoScreen.play()

    //create the video recorder
    const recordOptions = {
        mimeType: 'video/webm; codecs=vp9'
    };

    screenRecorder = new MediaRecorder(videoStream, recordOptions);

    //trigger the event handler
    screenRecorder.ondataavailable = availableDataHandle;
    screenRecorder.onstop = stopHandler;

}

//capture the all recorded footages
function availableDataHandle(e) {
    console.log('video data available');
    recordedFootages.push(e.data)
}

//save the record file
async function stopHandler(e) {
    const vidBlob = new Blob(recordedFootages, {
        type: 'video/webm; codecs=vp9'
    });

    //create the buffer
    const vidBuffer = Buffer.from(await vidBlob.arrayBuffer());

    //create the file path
    const {
        filePath
    } = await dialog.showSaveDialog({
        buttonLabel: 'Save Record',
        defaultPath: `rec-${Date.now()}.webm`
    });

    console.log(filePath);
    //save the file on the disk
    writeFile(filePath, vidBuffer, () => console.log('recording saved'))
}