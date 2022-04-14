var client;

function switchColor(col)
{
    var color;
    var square = document.getElementById("sqr");

    square.style.backgroundColor = col;
    
}

function processMessage(message)
{

    //Buttons processing
    if(message.destinationName == "sdi09/D5:2F:7E:30:10:5A/button")
        switchColor("rgb(139, 201, 255)");
    else if(message.destinationName == "sdi09/FD:17:0C:19:6A:F7/button")
        switchColor("rgb(235, 118, 113)");

    if(message.destinationName == "sdi09/FD:17:0C:19:6A:F7/button" && message.payloadString == "true")
        player.jump();

    if(message.payloadString == "false")
        switchColor('white');
}

function setClient(clt)
{
    client = clt;
}

function btnPressed()
{
    client.send('sdi09/D5:2F:7E:30:10:5A/led', JSON.stringify({
        red: 0,
        green: 0,
        blue: 255
    }));
}