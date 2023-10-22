const menu = document.getElementById("menu");

Array.from(document.getElementsByClassName("menu-item"))
  .forEach((item, index) => {
    item.onmouseover = () => {
      menu.dataset.activeIndex = index;
    }
  });

  $(document).ready(function(){
  $('form input').change(function () {
    $('form p').text(this.files.length + " file(s) selected");
  });
});

var audio = document.getElementById("audio-player");

$(document).ready(function(){
  $("#play_button").click(function(){
    if($(this).hasClass("play")){
      
      $(this)
        .empty()
        .append("<i class='material-icons'>pause</i>")
        .removeClass("play")
        .addClass("pause");
      $("#audio").addClass("selected");
      $("#play_button-list")
        .empty()
        .append("<i class='material-icons'>volume_up</i>");
      audio.play();
      audio.currentTime = 0;
    }else{
      $(this)
        .empty()
        .append("<i class='material-icons'>play_arrow</i>")
        .removeClass("pause")
        .addClass("play");
      $("#audio").removeClass("selected");
      $("#play_button-list")
        .empty()
        .append("<i class='material-icons'>play_arrow</i>");
      audio.pause();
      audio.currentTime = 0;
    }
  });
});

audio.addEventListener("timeupdate", function(){
  var current_time = document.getElementById('current_time');
  var s = parseInt(audio.currentTime % 60);
  var m = parseInt((audio.currentTime / 60) % 60);
  if( s < 10){
    current_time.innerHTML = "0" + m + ":0" + s;
  }else if( m < 10 ){
    current_time.innerHTML = "0" + m + ":" + s;
  }else{
    current_time.innerHTML = m + ":" + s;
  }
  
}, false);

audio.addEventListener("timeupdate", function(){
  var duration = document.getElementById("duration");
  var s = parseInt(audio.duration % 60);
  var m = parseInt((audio.duration / 60) % 60);
  if( s < 10 ){
    duration.innerHTML = "0" + m + ":0" + s;
  }else if( m < 10 ){
    duration.innerHTML = "0" + m + ":" + s;
  }else{
    duration.innerHTML = m + ":" + s;
  }
  var seekbar = document.getElementById("audioSeekBar");
  var rangeProgress = document.getElementById("range-progress");
  var valueSeekbar = audio.duration;
  var currentProgress = audio.currentTime;
  var percentageProgress = Math.floor((currentProgress * 100) / valueSeekbar) + 0.5 + "%" ;
  document.getElementById("range-progress").style.width = percentageProgress;
  
}, false);

function CreateSeekBar() {
  var seekbar = document.getElementById("audioSeekBar");
  seekbar.min = 0;
  seekbar.max = audio.duration;
  seekbar.value = 0;
}

function EndofAudio() {
  document.getElementById("audioSeekBar").value = 0;
}

function audioSeekBar() {
  var seekbar = document.getElementById("audioSeekBar");
  audio.currentTime = seekbar.value;
}

function SeekBar() {
  var seekbar = document.getElementById("audioSeekBar");
  seekbar.value = audio.currentTime;
}
