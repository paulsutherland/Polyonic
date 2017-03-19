window.addEventListener('load', function() {
  var event; // The custom event that will be created

  if (document.createEvent) {
    event = document.createEvent("HTMLEvents");
    event.initEvent("deviceready", true, true);
  } else {
    event = document.createEventObject();
    event.eventType = "deviceready";
  }

  event.eventName = "deviceready";

  if (document.createEvent) {
    document.dispatchEvent(event);
  } else {
    document.fireEvent("on" + event.eventType, event);
  }
});