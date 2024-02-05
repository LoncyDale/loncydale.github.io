const sounds =
[
	"fart1",
	"fart2",
	"fart3",
	"fart4"
];

for (let i = 0; i < sounds.length; i++)
{
	element = document.createElement("button");
	element.setAttribute("class", "btn");
	element.setAttribute("id", sounds[i]);

	buttons.appendChild(element);

	document.getElementById(sounds[i]).textContent = '💩'; // sounds[i];
	document.getElementById(sounds[i]).addEventListener("click", function()
	{
		new Audio(sounds[i] + ".mp3").play();
	});
}

// document.getElementById(sounds[i]).addEventListener("click", (e) => {new Audio(sounds[i] + ".mp3").play();});