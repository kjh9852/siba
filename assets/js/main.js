const navBtn = document.querySelectorAll('.nav-icon > ul > li');
const section = document.querySelectorAll('section');

function scrollAnimation(){
    for(let i = 0; i < 2; i++){
        navBtn[i].addEventListener('click', (e) => {
            e.preventDefault();
            let offsetTop = section[i].offsetTop;
            scrollTo({
                top: offsetTop,
                left: 0,
                behavior: 'smooth'
            });
        });
    }
}
scrollAnimation();

// add plaay audio
var myAudio = document.getElementById("player");
var isPlaying = false;

function togglePlay() {
  isPlaying ? myAudio.pause() : myAudio.play();
};