function setNotifDisplay(text = "", switchClass1 = "", switchClass2 = "") {
  notificationMsg.textContent = text;
  notificationMsg.classList.remove(switchClass1);
  notificationMsg.classList.add(switchClass2);
}

function createNotification(message = "") {
  setNotifDisplay(message, "hidden", "shown");

  setTimeout(() => {
    setNotifDisplay("", "shown", "hidden");
  }, 6000);
}
