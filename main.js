var fractions = 0;
var fracHandlers = [];
var activeHandlers = [];

class fracHandler {
  constructor(n) {
    this.n = n;
    this.element = $(`<span class="fracbox">
      <table>
        <tr><td><input class="num" type="number" id="numerator-` + n + `"></td></tr>
        <tr><td><input type="number" id="denominator-` + n + `"></td></tr>
      </table><button class="fancy-button" id="delete-` + n + `">&times;</button>
    </span>`);
    $("#box").append(this.element);
    this.active = true;
    window.activeHandlers.push(n);
    window.fractions++;
    this.numerator = $("#numerator-" + n);
    this.denominator = $("#denominator-" + n);
    this.delButton = $("#delete-" + n);
    this.delButton.on("click", this.delete.bind(this));
  }

  delete() {
    var loc = window.activeHandlers.findIndex(function(item) {return item == this.n}, this);
    window.activeHandlers.splice(loc, 1);
    this.active = false;
    this.element.remove();
  }

  getFrac() {
    return [this.numerator.val(), this.denominator.val()];
  }

  setFrac(frac) {
    this.numerator.val(frac[0]);
    this.denominator.val(frac[1]);
  }
}

function reset() {
  window.fractions = 0;
  var i;
  while (window.activeHandlers.length) {
    i = window.activeHandlers[0];
    window.fracHandlers[i].delete.bind(window.fracHandlers[i])();
  }
  window.fracHandlers = [];
}

//#region program loading
function loadProgram(prog) {
  var parsed = parse(prog);
  console.log(parsed);
  if (!isNaN(parsed[0])) {
    $("#n").val(parsed[0]);
  }
  setFractions(parsed.slice(1));
}

function setFractions(fracs) {
  reset();
  for (var i of fracs) {
    var a = new fracHandler(fractions);
    fracHandlers.push(a);
    a.setFrac(i);
  }
}
//#endregion

$("#load").on("click", function() {
  var file = document.getElementById("program").files[0];
  var contentPromise = file.text();
  contentPromise.then(text => loadProgram(text), e => alert("Something went wrong"));
});

$("#add-fraction").on("click", function() {
  window.fracHandlers.push(new fracHandler(window.fractions));
})

//#region accordion
var acc = $(".accordion");
acc.on("click", function() {
  this.classList.toggle("active");
  var panel = $(this.nextElementSibling);
  if (panel.css("display") === "block") {
    panel.css("display", "none");
  } else {
    panel.css("display", "block");
  }
});
//#endregion

function fracStep() {
  var prog = [];
  for (var i of window.activeHandlers) {
    prog.push(window.fracHandlers[i].getFrac());
  }
  var n = step($("#n").val(), prog);
  if (isNaN(n)) {
    alert("Program has terminated");
  } else {
    $("#n").val(n);
  }
}