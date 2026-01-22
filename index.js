const faders = document.querySelectorAll('.fade');
const toggle = document.querySelector('.toggle');
const nav = document.querySelector('.navbar');

toggle.addEventListener('click',()=> {
   console.log('toggle cliked')
    toggle.classList.toggle('active');
    nav.classList.toggle('show');
})

window.addEventListener('scroll',(e)=> {
  let clientY = ~~window.scrollY
  if(clientY > 80){
    nav.classList.add('scrolling')
  } else {
    nav.classList.remove('scrolling')
  }
})


//smoth show scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show'); // Tambahkan animasi
      // observer.unobserve(entry.target); // kalau mau sekali muncul saja
    } else {
      entry.target.classList.remove('show'); // kalau mau hilang lagi saat discroll keluar
    }
  });
}, { threshold: 0.2 }); // aktif saat 20% elemen kelihatan

faders.forEach(fade => observer.observe(fade));

const gallery = document.querySelector('.memories-galery');
const galeryReverse = document.querySelector('.memories-galery-reverse')
const itemsReverse = [...galeryReverse.children]
const items = [...gallery.children];

itemsReverse.forEach(item => {
    let clone = item.cloneNode(true)
    galeryReverse.appendChild(clone)
  })
  // Gandakan item biar looping mulus
items.forEach(item => {
    let clone = item.cloneNode(true);
    gallery.appendChild(clone);
});

  // function buat ubah arah / speed
  // function setSlider(direction = "normal", duration = "25s") {
  //   gallery.style.animationDirection = direction;
  //   gallery.style.animationDuration = duration;
  // }

let songs = [
  {
    name: "Tenshi ni fureta",
    artist: "K-on",
    img: "album",
    audio: "Tenshi-ni-fureta"
  },
  {
    name: "Watashi no Koi wa Hotch Kiss ",
    artist: "K-on",
    img: "album-2",
    audio: "watashi-no-koi"
  },
  {
    name: "Fuwa Fuwa Time",
    artist: "K-on",
    img: "album-3",
    audio: "fuwa-fuwa-time"
  },
  {
    name: "Pich Daisuki",
    artist: "K-on",
    img: "album-4",
    audio: "kon-pich-daisuki"
  }
  
]

const musicPlayer = document.querySelector('.music-player'),
Playimg = musicPlayer.querySelector('.music-image img'),
musicName = musicPlayer.querySelector('.music-titles .name'),
musicArtist = musicPlayer.querySelector('.music-titles .artist'),
Audio = document.querySelector('.main-songs'),
playBtn = musicPlayer.querySelector('.play-pause'),
playBtnIcon = musicPlayer.querySelector(".play-pause span"),
prevBtn = musicPlayer.querySelector("#prev"),
nextBtn = musicPlayer.querySelector("#next"),
progressBar = musicPlayer.querySelector('.progress-bar'),
progressDetails =  musicPlayer.querySelector(".progress-details"),
repeatBtn = musicPlayer.querySelector("#repeat")





let index = 1

window.addEventListener('load',()=>{
  loadData(index)
  // Audio.play()
})

function loadData(indexValue){
  musicName.innerHTML = songs[indexValue - 1].name;
  musicArtist.innerHTML = songs[indexValue - 1].artist 
  Playimg.src = "images/"+ songs[indexValue - 1].img+".jpeg"
  Audio.src = "songs/"+songs[indexValue - 1].audio+".mp3"
}


playBtn.addEventListener("click",()=>{
  const isMusicPaused = musicPlayer.classList.contains("paused");
  if(isMusicPaused){
    pauseSong()
  }
  else {
    playSong()
  }
})


function playSong() {
  Playimg.style.animationPlayState = "running"
  musicPlayer.classList.add("paused");
  playBtnIcon.innerHTML = "pause"
  Audio.play()
}

function pauseSong(){
  Playimg.style.animationPlayState = "paused"
  musicPlayer.classList.remove("paused");
  playBtnIcon.innerHTML = "play_arrow";
  Audio.pause();
}

nextBtn.addEventListener("click",()=>{
  nextSong()
})

prevBtn.addEventListener("click",()=>{
  prevSong()
})


function nextSong(){
  index++;
  if(index > songs.length){
    index = 1;
  } else {
    index = index
  }
  loadData(index);
  playSong()
}

function prevSong(){
  index--;
  if(index <= 0 ){
    index = songs.length
  } else {
    index = index
  }
  loadData(index);
  playSong()
}

Audio.addEventListener('timeupdate',(e)=>{
  const initialTime = e.target.currentTime;
  const finalTime = e.target.duration;
  let BarWidth = (initialTime / finalTime ) * 100 
  progressBar.style.width = BarWidth+"%"

  progressDetails.addEventListener("click",(e)=>{
    let progressValue = progressDetails.clientWidth;
    let clickedOffsetX = e.offsetX;
    let MusicDuration = Audio.duration 

    Audio.currentTime = (clickedOffsetX / progressValue) * MusicDuration
  })

  Audio.addEventListener("loadeddata",()=>{
    let finalTimeData = musicPlayer.querySelector(".final");

    //
    let AudioDuration = Audio.duration 
    finalTimeData.innerText = AudioDuration
    let finalMinutes = Math.floor(AudioDuration / 60 );
    let finalSeconds = Math.floor(AudioDuration % 60 );
    if(finalSeconds < 10 ){
      finalSeconds = "0"+finalSeconds
    }
    finalTimeData.innerText = finalMinutes+":"+finalSeconds
  })

  let currentTimeData = musicPlayer.querySelector(".current")
  let currentTime = Audio.currentTime
  let currentTimeMinutes = Math.floor(currentTime / 60 );
  let currentSeconds = Math.floor(currentTime % 60 )
  if(currentSeconds < 10 ){
    currentSeconds = "0"+currentSeconds
  }
  currentTimeData.innerText = currentTimeMinutes+":"+currentSeconds


  repeatBtn.addEventListener("click",()=>{
    Audio.currentTime = 0
  })
})


document.addEventListener("DOMContentLoaded", () => {
  const album = document.querySelector(".list-album");
  const modal = document.querySelector(".music-container");
  const closeBtn = document.querySelector(".close-modal");

  // buka modal saat klik album
  album.addEventListener("click", (e) => {
    if(e.target.classList.contains('album-1')){
      loadData(1)
      modal.classList.add("show");
      playSong()
    } else if (e.target.classList.contains('album-2')){
      loadData(2)
      modal.classList.add("show")
      playSong()
    } else if (e.target.classList.contains("album-3")){
      loadData(3)
      modal.classList.add("show")
      playSong()
    } else if (e.target.classList.contains("album-4")){
      loadData(4)
      modal.classList.add("show")
      playSong()
    }
  });

  // tutup modal saat klik tombol X
  closeBtn.addEventListener("click", (e) => {
    console.log(e.target)
    pauseSong()
    modal.classList.remove("show");
  });
});


// Bubble lighting follow mouse
const bubble = document.querySelector(".light-bubble");

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  bubble.style.backgroundPosition = `${x - 100}px ${y - 100}px`;
});




// Particles generator
const particlesContainer = document.getElementById("particles");

function createParticle() {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  // random posisi
  particle.style.left = Math.random() * 100 + "vw";
  particle.style.bottom = "-10px";

  // random ukuran
  const size = Math.random() * 6 + 4;
  particle.style.width = size + "px";
  particle.style.height = size + "px";

  // random durasi
  const duration = Math.random() * 5 + 5;
  particle.style.animationDuration = duration + "s";

  // random warna glow
  const colors = [
    "rgba(124, 240, 61, 0.9)",   // hijau neon
    "rgba(65, 154, 255, 0.9)",   // biru
    "rgba(140, 0, 210, 0.9)",    // ungu
    "rgba(255, 200, 0, 0.9)"     // kuning
  ];
  particle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random()*colors.length)]}, transparent)`;

  particlesContainer.appendChild(particle);

  // hapus setelah animasi selesai
  setTimeout(() => {
    particle.remove();
  }, duration * 1000);
}

// generate partikel tiap 300ms
setInterval(createParticle, 300);

