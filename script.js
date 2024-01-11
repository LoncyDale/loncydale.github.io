const sounds =
[
	"fart1",
	"fart2",
	"fart3",
	"fart4"
];

const buttons_block = document.getElementById("buttons");

for (let i = 0; i < sounds.length; i++)
{
	element = document.createElement("button");
	element.setAttribute("class", "button");
	element.setAttribute("id", sounds[i]);

	buttons_block.appendChild(element);

	document.getElementById(sounds[i]).textContent = sounds[i];
	document.getElementById(sounds[i]).addEventListener("click", (e) => {new Audio(sounds[i] + ".mp3").play();});
}