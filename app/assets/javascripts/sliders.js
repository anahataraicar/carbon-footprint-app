// MEAT

d3.select("#nValueMeat").on("input", function () {
  updateMeat(+this.value);
});

updateMeat(1);

function updateMeat(nValueMeat) {
  d3.select("#text-slider-meat").text(nValueMeat);
  d3.select("#nValueMeat").property("value", nValueMeat);
}

// DAIRY

d3.select("#nValueDairy").on("input", function () {
  updateDairy(+this.value);
});

updateDairy(1);

function updateDairy(nValueDairy) {
  d3.select("#text-slider-dairy").text(nValueDairy);
  d3.select("#nValueDairy").property("value", nValueDairy);
}

// GRAINS

d3.select("#nValueGrains").on("input", function () {
  updateGrains(+this.value);
});

updateGrains(1);

function updateGrains(nValueGrains) {
  d3.select("#text-slider-grains").text(nValueGrains);
  d3.select("#nValueGrains").property("value", nValueGrains);
}

// FRUIT

d3.select("#nValueFruit").on("input", function () {
  updateFruit(+this.value);
});

updateFruit(1);

function updateFruit(nValuefruit) {
  d3.select("#text-slider-fruit").text(nValuefruit);
  d3.select("#nValueFruit").property("value", nValuefruit);
}


// OTHER

d3.select("#nValueOther").on("input", function () {
  updateOther(+this.value);
});

updateOther(1);

function updateOther(nValueOther) {
  d3.select("#text-slider-Other").text(nValueOther);
  d3.select("#nValueOther").property("value", nValueOther);
}




