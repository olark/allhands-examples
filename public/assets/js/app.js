
$(function() {

  /* Handle the login */
  $('a[href="#login"]').click(function(event) {
    event.preventDefault();

    $('.panel.login').toggleClass('active');

  });

  $('a[href="#login-submit"').click(function(event) {
    event.preventDefault();

    /* Pretend to login */
    login(function(user) {

      $('.panel.login').removeClass('active');

      /* Get the visitor details */
      olark('api.visitor.getDetails', function(details) {

        /* Set the details in Olark */

        if (!details.fullName) {
          olark('api.visitor.updateFullName', {
            fullName: user.firstName + ' ' + user.lastName
          });
        }

        if (!details.emailAddress) {
          olark('api.visitor.updateEmailAddress', {
            emailAddress: user.email
          });
        }
      });

    });
  });

  /* Handle Contact Button */
  $('a.chat-status').click(function(event) {
    event.preventDefault();

    /* Launch Prechat */
    olark('api.visitor.getDetails', function(details) {

      if (!details.isConversing) {
        var $panel = $('.panel.prechat');

        $panel.toggleClass('active');
        $panel.find('input[name="fullName"]').val(details.fullName);
        $panel.find('input[name="emailAddress"]').val(details.emailAddress);
      }

    });
  });


  $('a[href="#prechat-submit"]').click(function(event) {
    event.preventDefault();

    var $panel = $('.panel.prechat');
    $panel.removeClass('active');

    var fullName = $panel.find('input[name="fullName"]').val();
    var emailAddress = $panel.find('input[name="emailAddress"]').val();
    var favoriteAnimal = $panel.find('select[name="favoriteAnimal"]').val();

    olark('api.visitor.updateFullName', {
      fullName: fullName
    });

    olark('api.visitor.updateEmailAddress', {
      emailAddress: emailAddress
    });

    olark('api.chat.updateVisitorStatus', {
      snippet: 'Favorite animal: ' + (favoriteAnimal || 'None')
    });

    olark('api.box.expand');

  });


  /* Olark Notification Button */
  olark('api.chat.onOperatorsAway', function() {

    var $btns = $('a.chat-status');

    $btns.each(function(idx, btn) {
      var $btn = $(btn);
      $btn.removeClass('btn-success');
      $btn.addClass('btn-default');
      $btn.html($btn.attr('data-away'));
    });

  });

  olark('api.chat.onOperatorsAvailable', function() {

    var $btns = $('a.chat-status');

    $btns.each(function(idx, btn) {
      var $btn = $(btn);
      $btn.removeClass('btn-default');
      $btn.addClass('btn-success');
      $btn.html($btn.attr('data-available'));
    });

  });

  /* Basic Custom Command Definition */
  olark('api.chat.onCommandFromOperator', function(data) {

    /* Send some important debug information */
    if (data.command.name == 'debug') {

      var debugData = {
        userAgent: window.navigator.userAgent,
        cookies: document.cookie.split(';')
      };

      olark('api.chat.sendNotificationToOperator', {
        body: formatDebugData(debugData)
      });

    }

    /* Clear the cookies and refresh */
    if (data.command.name == 'refresh') {
      window.location.reload();
    }

  });

});

var formatDebugData = function(obj) {

  var msg = '';

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      msg += key + ': '+ obj[key] + '\r\n';
    }
  }

  return msg;

};

var login = function(cb) {

  /* Mock login data */
  cb({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com'
  });

};