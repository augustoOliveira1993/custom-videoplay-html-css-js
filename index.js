const container = document.querySelector('.container'),
    mainVideo = container.querySelector('video'),
    currentVidTime = container.querySelector('.current-time'),
    videoDuration = container.querySelector('.video-duration'),
    videoTimeline = container.querySelector('.video-timeline'),
    progressBar = container.querySelector('.progress-bar'),
    volumeBtn = container.querySelector('.volume i'),
    volumeSlider = container.querySelector('.left input'),
    skipBackward = container.querySelector('.skip-backward i'),
    playPauseBtn = container.querySelector('.play-pause i'),
    skipForkward = container.querySelector('.skip-forward i'),
    speedBtn = container.querySelector('.playback-speed span'),
    speedOptions = container.querySelector('.speed-options'),
    picInPicBtn = container.querySelector('.pic-in-pic span'),
    btnPauseBg = container.querySelector('.pause-btn'),
    bgPauseBtn = container.querySelector('.bg-pause-btn'),
    bgEnded = container.querySelector('.bg-ended'),
    fullScreenBtn = container.querySelector('.fullscreen i');

let time;

mainVideo.poster = 'assets/images/poster-img.jpeg'

const hiddenControls = () => {
    if (mainVideo.paused) return; // if video is paused return
    time = setTimeout(() => {
        container.classList.remove('show-controls')
    }, 2000)
}

hiddenControls()

// APLICA IMAGEM OU BACKGROUND QUANDO FINALIZA O VIDEO
mainVideo.addEventListener('ended', () => {
    bgEnded.removeAttribute('hidden')
    container.classList.remove('show-controls')
})

container.addEventListener('mousemove', () => {
    container.classList.add('show-controls') // add show-controls class on mousemove
    clearTimeout(time) // clear timer
    hiddenControls() // calling hiddenControls
})

const toggleBtnPause = () => {
    bgEnded.setAttribute('hidden', '')
    mainVideo.paused ? btnPauseBg.setAttribute('hidden', '') : btnPauseBg.removeAttribute('hidden')
    mainVideo.paused ? bgPauseBtn.setAttribute('hidden', '') : bgPauseBtn.removeAttribute('hidden')
}

const togglePlayPauseVideo = () => {
    bgEnded.setAttribute('hidden', '')
    mainVideo.paused ? mainVideo.play() : mainVideo.pause()
}

btnPauseBg.addEventListener('click', () => {
    toggleBtnPause()
    togglePlayPauseVideo()
})
const formatTime = time => {
    // Pega os segundos, minutos e horas
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600);

    // adiciona 0 antes do numero se o for menor que 10;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`

}

mainVideo.addEventListener('timeupdate', (e) => {
    let {currentTime, duration} = e.target; // pegar o time atual e a duração
    let percent = (currentTime / duration) * 100; // pega o percentual
    progressBar.style.width = `${percent}%` // passa a porcentagem para o WIDTH do progresso
    currentVidTime.innerText = formatTime(currentTime)

})

mainVideo.addEventListener('loadeddata', e => {
    videoDuration.innerText = formatTime(e.target.duration) // Passa a duração do video para videoDuration innerText
})

videoTimeline.addEventListener('click', e => {
    let timelineWidth = videoTimeline.clientWidth; // pega o videoTimeline width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // atualiza time atual do video
})

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth; // pega o videoTimeline width
    progressBar.style.width = `${e.offsetX}px`; // passing offsetX value as progressbar width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // atualiza time atual do video
    currentVidTime.innerText = formatTime(mainVideo.currentTime) // passing video current time as currentVidTime innerText
}

videoTimeline.addEventListener("mousedown", () => { // calling draggableProdress function on mousemove event
    videoTimeline.addEventListener('mousemove', draggableProgressBar)
})

container.addEventListener("mouseup", () => { // removing mousemove listener on mouse up event
    videoTimeline.removeEventListener('mousemove', draggableProgressBar)
})

videoTimeline.addEventListener('mousemove', e => {
    const progressTime = videoTimeline.querySelector('span')
    let offsetX = e.offsetX; // getting mouseX position
    progressTime.style.left = `${offsetX}px` // passing offsetX value as progressTime left value
    let timelineWidth = videoTimeline.clientWidth; // pega o videoTimeline width
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration; // atualiza time atual do video
    progressTime.innerText = formatTime(percent) // passing percent as progressTime innerText
})

skipBackward.addEventListener('click', (e) => {
    mainVideo.currentTime -= 5; // Subtrai 5 secundos do time atual do video
})

skipForkward.addEventListener('click', (e) => {
    mainVideo.currentTime += 5; // Adiciona 5 secundos do time atual do video
})

volumeSlider.addEventListener("input", (e) => {
    mainVideo.volume = e.target.value; // passa slider value ao volume do video
    if (e.target.value == 0) { // se o slider value é 0, troca o icone para mudo
        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark')
    } else {
        volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high')
    }
})

speedBtn.addEventListener('click', () => { // Oculta speed options do html ao clicar
    speedOptions.classList.toggle('show')
})

speedOptions.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', () => { // adicionar o evento de click para todos os speed options
        mainVideo.playbackRate = option.dataset.speed; // passa o valor dataset para o video playback value
        speedOptions.querySelector(".active").classList.remove("active")
        option.classList.add('active')
    })
})

document.addEventListener('click', e => {
    if (e.target.tagName === 'VIDEO') {
        toggleBtnPause()
        togglePlayPauseVideo()
    }
    if (e.target.tagName !== 'SPAN' || e.target.className !== 'material-symbols-rounded') {
        speedOptions.classList.remove('show')
    }
})

picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture(); // muda o video para o modo pincture a pincture
})

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen") // alterna o fullscrees class
    if (document.fullscreenElement) { // se o video estive em modo de fullscreen
        fullScreenBtn.classList.replace('fa-compress', 'fa-expand')
        return document.exitFullscreen(); // sai do modo fullscreen
    }
    fullScreenBtn.classList.replace('fa-expand', 'fa-compress')
    container.requestFullscreen();// vai para o modo fullscreen
})

volumeBtn.addEventListener('click', () => {
    if (!volumeBtn.classList.contains('fa-volume-high')) { // se o icone do volume não estiver em 'high'
        mainVideo.volume = 0.5; // passa 0.5 ao valor do volume do video
        volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high')
    } else {
        mainVideo.volume = 0.0; // passa 0.0 ao valor do volume do video
        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark')
    }
    volumeSlider.value = mainVideo.volume // Atualiza o valor de acordo com o volume do video
})


playPauseBtn.addEventListener('click', () => {
    toggleBtnPause()
    // se o video estiver em pause, play no video caso contratio pause no video
    togglePlayPauseVideo()
})

mainVideo.addEventListener('play', () => { // se o video estiver play, troca o icone para pause
    playPauseBtn.classList.replace("fa-play", "fa-pause")
})

mainVideo.addEventListener('pause', () => { // se o video estiver pause, troca o icone para play
    playPauseBtn.classList.replace("fa-pause", "fa-play")
})
