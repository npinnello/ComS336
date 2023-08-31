
function logText()
{
  let text = document.getElementById("theTextBox").value;
  console.log("You typed " + text);
}

function startHere()
{
  let textBox = document.getElementById("theTextBox");
  textBox.onchange = logText;
}
