window.fbAsyncInit = function() {
  FB.init({
    appId      : '1476643879330794',
    xfbml      : true,
    version    : 'v2.8'
  });

  // ADD ADDITIONAL FACEBOOK CODE HERE
  // Place following code after FB.init call.

  function onLogin(response) {
    if (response.status == 'connected') {
      FB.api('/me','GET',{"fields":"id,name,devices,security_settings,timezone,location"},function(response) {
          // Insert your code here
        var welcomeBlock = document.getElementById('fb-welcome');
        welcomeBlock.innerHTML = 'Greetings ' + response.fields.name + '!';
        var locationBlock = document.getElementById('fb-location');
        welcomeBlock.innerHTML = 'You are in ' + response.fields.location;
      });
    }
  }

  FB.getLoginStatus(function(response) {
    // Check login status on load, and if the user is
    // already logged in, go directly to the welcome message.
    if (response.status == 'connected') {
      onLogin(response);
    } else {
      // Otherwise, show Login dialog first.
      FB.login(function(response) {
        onLogin(response);
      }, {scope: 'user_friends'});
    }
  });

};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=1476643879330794";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
