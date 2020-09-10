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

  disable() {
    this.numerator.prop('disabled', true);
    this.denominator.prop('disabled', true);
    this.delButton.prop('disabled', true);
  }

  enable() {
    this.numerator.prop('disabled', false);
    this.denominator.prop('disabled', false);
    this.delButton.prop('disabled', false);
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
    return true;
  } else {
    $("#n").val(n);
    return false;
  }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function saveProgram() {
  var filename = prompt("Enter a filename: ", "fractran-program.frac");
  var saveN = $("#saveN").prop("checked");
  var prog = "";
  if (saveN) {
    prog += $("#n").val();
  }
  prog += "; "
  for (var i of activeHandlers) {
    prog += fracHandlers[i].getFrac()[0];
    prog += "/";
    prog += fracHandlers[i].getFrac()[1];
    prog += ", ";
  }
  download(filename, prog.substring(0, prog.length - 2));
}

class fracUtil {
  static runUntil(detect) {
    function end() {
      for (var i of activeHandlers) {
        fracHandlers[i].enable();
      }
      $("#running").val("0");
      $("#run").text("Run");
      $("#run").off("click");
    }
    for (var i of activeHandlers) {
      fracHandlers[i].disable();
    }
    $("#running").val("1");
    $("#run").text("Stop");
    $("#run").on("click", function() {
      $("#running").val("0");
    });
    while ($("#running").val() == "1") {
      if (detect($("#n").val())) {
        break;
      }
      var a = fracStep();
      if (a) {
        break;
      }
    }
    end();
  }

  static sieve(n, primes) {
    while (true) {
      if (n == 1) {
        return true
      }
      if (primes.length == 0) {
        return false;
      }
      if (n % primes[0] == 0) {
        n = n / primes[0];
      } else {
        primes.splice(0, 1);
      }
    }
  }

  
}