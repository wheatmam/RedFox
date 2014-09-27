$(document).ready(function() {

  function newBoard() {
    $('#bnLabel').css('color', 'inherit', 'font-weight', 'normal');
    var message = "";
    var firstname = $('#fn')[0].value;
    var lastname = $('#ln')[0].value;
    var boardname = $('#bn')[0].value;
    if (firstname == "") {
      message = message + "Please include a first name.<br/>";
    };

    if (lastname == "") {
      message = message + "Please include a last name.<br/>";
    };

    if (boardname == "") {
      message = message + "Please include a board name.<br/>";
    };

    var data = {
      firstname: firstname,
      lastname: lastname,
      boardname: boardname
    };
    var canSubmit = false;
    if (message == "") {
      canSubmit = true
    } else {
      $('#message')[0].innerHTML = message;
      $('#message').fadeIn()
    }

    if (canSubmit) {
      $.ajax({
        type: 'POST',
        url: '/uploadNewBoard',
        dataType: 'application/json',
        data: JSON.stringify(data),
        201: function() {
          window.location.replace("/" + data['boardname'])
        },
        302: function() {
          $('#message')[0].innerHTML = "Board name already in use. <br/>";
          $('#bn').css('color', 'red');
          $('#message').fadeIn()
        },
        error: function() {
          $('#message')[0].innerHTML = "Board name already in use. <br/>";
          $('#message').fadeIn();
          $('#bnLabel').css('color', 'red', 'font-weight', 'bold');
        }
      });
    }
    return false;
  }

  var fakeNames = ["alpha", "beta", "gamma", "episilon", "omega"];

  function submitSearch(value, kind) {
    $('#searchResults').innerHTML = "";
    $('.resultsDiv').fadeIn();
    // var data = {field:kind,query:value};
    // .ajax(
    //     {url:'/uploadSearch',
    //     data:data,
    //   201:function() {
    //       window.location.replace("/"+data['boardname'])},
    //     302:function() {
    //       $('#message').fadeIn()},
    //     error:function() {
    //       console.log("error");
    //     }
    //   });
    results = fakeNames;
    return results;
  }


  function searchBoard() {
    window.location.replace("/search");
  }

  function firstSearch(value) {
    $('#searchResults')[0].innerHTML = "";
    makeDisplay(submitSearch(value, "first"));
  }

  function lastSearch(value) {
    $('#searchResults')[0].innerHTML = "";
    makeDisplay(submitSearch(value, "last"));
  }

  function boardSearch(value) {
    $('#searchResults')[0].innerHTML = "";
    makeDisplay(submitSearch(value, "board"));
  }

  function makeDisplay(names) {
    $.each(names, function(index, value) {
      var a = document.createElement('a');
      a.innerHTML = '<p class="nameList">' + value + '</p>';
      a.title = value;
      a.href = "/" + value;
      $('#searchResults')[0].appendChild(a);
    });
  }
});