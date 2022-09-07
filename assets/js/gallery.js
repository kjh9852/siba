const reset = document.querySelector(".reset_btn > button");

var section = document.querySelector(".gallery > div");

const galleryLoader = $(".loader-wrapper");
let start = 0;
let end = 99;

function loader(show = true) {
	if (show) {
		galleryLoader.removeClass("hide");
		return;
	}
	galleryLoader.addClass("hide");
}

loader();
var metaData = [];
var filterData = [];
var reachedBottom = false;
var stopScroll = false;
var isFilter = false;

fetch(`https://kjh9852.github.io/siba/siba.json`)
	.then(function (response) {
		return response.json();
	})
	.then(function (json) {
		loader(false);
		metaData = json;
		filter(metaData);
	})
	.catch(function (error) {
		console.log(error);
	});

function filter() {
	var meta = isFilter ? filterData : metaData;
	meta = meta.slice(start, end);
	console.log(meta, "here");

	// if (!meta.length) {
	// 	$(".gallery .data").html("<h5>No results found</h5>");
	// 	loader(false);
	// 	return;
	// }

	for (let i = 0; i < meta.length; i++) {
		var div = document.createElement("div");
		var a = document.createElement("a");
		a.setAttribute("href", meta[i].hash);
		a.setAttribute("onclick","return false;");
		var myPara1 = document.createElement("p");
		// console.log(meta[i].attributes)
		var img = document.createElement("img");
		img.dataset.src;
		img.src = meta[i].image;
		img.loading = "lazy";

		myPara1.textContent = `CAT #${meta[i].name}`;
		a.appendChild(img);
		div.appendChild(a);
		div.classList.add("item");
		div.setAttribute("data-num", meta[i].name);

		if (meta[i].attributes.Background) {
			div.setAttribute("data-background", meta[i].attributes.Background);
		}
		if (meta[i].attributes.Eyes) {
			div.setAttribute("data-mouth", meta[i].attributes.Eyes);
		}
		if (meta[i].attributes.Fur) {
			div.setAttribute("data-fur", meta[i].attributes.Fur);
		}
		if (meta[i].attributes.item) {
			div.setAttribute("data-clothes", meta[i].attributes.Item);
		}
		div.appendChild(myPara1);
		section.appendChild(div);

		const options = { threhold: 0.1 };
		const io = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					var image = entry.target;
					image.src = image.dataset.src;
					entry.target.classList.add("visible");
					io.unobserve(image);
				} else {
					entry.target.classList.remove("visible");
				}
			});
		}, options);

		document.querySelectorAll(".item").forEach((item) => io.observe(item));
		reachedBottom = false;
	}

	loader(false);

	$(window).on("scroll", function () {
		if (
			$(this).scrollTop() + $(this).innerHeight() >=
				$(".gallery")[0].scrollHeight &&
			!stopScroll
		) {
			if (!reachedBottom) {
				loader();
				reachedBottom = true;
				setTimeout(function () {
					start = end;
					end = end + 99;
					filter();
				}, 1000);
			}
		}
	});
}

function initFilter() {
	let background = $(".filter-background").val();
	let fur = $(".filter-fur").val();
	let eyes = $(".filter-eyes").val();
	let items = $(".filter-item").val();
	let id = $(".search_form input").val();

	filterData = metaData
		.filter(function (item) {
			if (background && item.attributes.Background !== background) {
				return false;
			}
			if (fur && item.attributes.Fur !== fur) {
				return false;
			}
			if (eyes && item.attributes.Eyes !== eyes) {
				return false;
			}
			if (items && item.attributes.Item !== items) {
				return false;
			}
			if (id && item.name !== id) {
				return false;
			}
			return true;
		})
		.sort(function (a, b) {
			a = +a.name;
			b = +b.name;
			return a - b;
		});

	isFilter = true;
	start = 0;
	end = 99;
	$(".gallery .data").html("");
	filter();
}

$(".form_control").on("input", function () {
	initFilter();
});

$(".filter").on("change", function () {
	initFilter();
});

$(".search_form").on("submit", function (e) {
	e.preventDefault();
});

$(".reset_btn button").on("click", function (e) {
	$(".gallery .data").html("");
	isFilter = false;
	start = 0;
	end = 99;
	$(".search_form input").val("");
	$(".filter").val("");
	filter();
});