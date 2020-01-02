'use strict';

//on menu click open or close nav bar for mobile
$(function mobileClick() {
  $('#menu').hide();
  $('#hamburger').on('click', () => {
    //show or hide header with transition
    console.log('clicked');

    $('#menu').slideToggle();
  });
})
// mobileClick();

// $.ajax({
//   type: 'POST',
//   dataType: 'json',
// }).then(results => {
//   console.log(results.body);
// })

// $(main).click(
//     alert('bla')
// )

// function radio_toolbar_click(ev) {
//     let checked = document.querySelector('input[name="hunger"]:checked');
//     if (checked) {
//         checked.checked = false;
//     }
//     ev.target.previousElementSibling.checked = true;
// }

function radioButtons() {
  //on clicking a radio button
  $('label').click(function () {
    //set that labels input to checked
    console.log('got it');
  })
}
radioButtons();

function foodOptions() {

  let currentFood = 1;
  $('#food-section section').toggle();
  $(`#food-section section:nth-of-type(${currentFood})`).toggle();


  $('.seeNextFood').on('click', () => {
    currentFood += 1;
    $(`#food-section section:nth-of-type(${currentFood})`).slideDown();
  })

}
foodOptions();

function musicOptions() {

  let currentmusic = 1;
  $('#music-section section').toggle();
  $(`#music-section section:nth-of-type(${currentmusic})`).toggle();


  $('.seeNextMusic').on('click', () => {
    currentmusic += 1;
    $(`#music-section section:nth-of-type(${currentmusic})`).slideDown();
  })

}
musicOptions();


function eventOptions() {

  let currentevent = 1;
  $('#event-section section').toggle();
  $(`#event-section section:nth-of-type(${currentevent})`).toggle();


  $('.seeNextEvent').on('click', () => {
    currentevent += 1;
    $(`#event-section section:nth-of-type(${currentevent})`).slideDown();
  })

}
eventOptions();

function newsOptions() {

  let currentnews = 1;
  $('#news-section section').toggle();
  $(`#news-section section:nth-of-type(${currentnews})`).toggle();


  $('.seeNextNews').on('click', () => {
    currentnews += 1;
    $(`#news-section section:nth-of-type(${currentnews})`).slideDown();
  })

}
newsOptions();



// randomizing order of trivia questions
$(function shuffle() {
  $('div.trivia-answers').each(function () {
    let answers = $(this).find('p');
    for (let i = 0; i < answers.length; i++) $(answers[i]).remove();
    // 'fisher yates algorithm' http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
    let i = answers.length;
    while (--i) {
      let j = Math.floor(Math.random() * (i + 1));
      let tempi = answers[i];
      let tempj = answers[j];
      answers[i] = tempj;
      answers[j] = tempi;
    }
    for (i = 0; i < answers.length; i++) $(answers[i]).appendTo(this);
  });

  // changing colors of selected trivia answers
  $('[data-correct=true]').click(function () {
    $(this).toggleClass('correct');
  });
  $('[data-correct=false]').click(function () {
    $(this).toggleClass('incorrect');
  });
});

// changing button content to show added to favorites
$('.add-to-fav').on('click', function () {
  var favBtn = $(this);
  if (favBtn.text('Add To My Favorites')) {
    favBtn.text('Added To Favorites!');
  }
});

// hiding and showing one question at a time
function hideAndShowQuiz() {
  $('#locationform').hide();
  $('#yelpform').hide();
  $('#trivia').hide();
  $('#eventfulform').hide();
  $('#tastediveform').hide();
  $('#finalsubmit').hide();

  const showLocation = () => {
    $('#locationform').show();
    clearInterval(id);
  };
  let id = setInterval(showLocation, 1500);

  $('#showyelpbutton').on('click', function () {
    $('#locationform').hide();
    $('#yelpform').show();
  });

  $('#yelpform').on('change', function () {
    $('#yelpform').hide();
    $('#trivia').show();
  });

  $('#trivia').on('change', function () {
    $('#trivia').hide();
    $('#eventfulform').show();
  });

  $('#eventfulform').on('change', function () {
    $('#eventfulform').hide();
    $('#tastediveform').show();
    $('#finalsubmit').show();
  });
}
$(document).ready(hideAndShowQuiz);
