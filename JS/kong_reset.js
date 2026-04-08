var kongregate = parent.kongregate;
var sessionToken;
var selectClass;
var diff;

window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
    var text = 'Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber +
        ' Column: ' + column + ' URL: ' + window.location.href + ' PATH: ' + window.location.pathname + ' StackTrace: ' + errorObj;

    console.log("Logging error..");
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {
            call: "logError",
            text: text
        },
		url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
    });
}

$(document).ready(function() {
	sessionToken = localStorage.cookie;
	localStorage.removeItem("cookie");
	$(".unselected").on("click", function(){
		$(".classSelect:not(.locked)").removeClass("selected").addClass("unselected");
		$(this).addClass("selected").removeClass("unselected");
	});
	$(".diff").on("click", function(){
		$(".diff").removeClass("filtersClicked");
		$(this).addClass("filtersClicked");
		diff = $(this).attr("data-mod");
	});
	$(".core:not(.filtersLocked)").on("click", function(){
		$(".core").removeClass("filtersClicked");
		$(this).addClass("filtersClicked");
	});
	$(".mouseover").mouseenter(function(){
		$("#script").html($(this).attr("data-script"));
	})
	$(".mouseover").mouseleave(function(){
		$("#script").html("");
	})
	$(".resetFilters, .classSelect").on("click", function(){
		if($("#diffCasual").hasClass("filtersClicked")){
			$("#runBonus").html("<table style='width:100%; text-transform: capitalize;'><tr><th style='width:33%'>Level 25 Reset</th><th style='width:34%'>Level 50 Reset</th><th style='width:33%'>Level 75 Reset</th></tr>"
                + "<tr><td valign='top'><ul><li>No Reward.</li></ul></td>"
                + "<td valign='top'><ul><li>No Reward.</li></ul></td>"
                + "<td valign='top'><ul><li>No Reward.</li></ul></td>"
                + "</tr></table>");
			return;
		}
		stat = "";
		selectClass = "";
		id = $(".classSelect.selected").attr("id");
		if (id == "pala"){
			stat = "strength";
			selectClass = "Paladin";
		}
		if (id == "sin"){
			stat = "dexterity";
			selectClass = "Assassin";
		}
		if (id == "warlock"){
			stat = "spirit";
			selectClass = "Warlock";
		}

        script = "<table style='width:100%; text-transform: capitalize;'><tr><th style='width:33%'>Level 25 Reset</th><th style='width:34%'>Level 50 Reset</th><th style='width:33%'>Level 75 Reset</th></tr>"
            + "<tr><td valign='top'><ul>" + $(".diff.filtersClicked").attr("data-bonus2") + "</ul></td>"
            + "<td valign='top'><ul>" + $(".diff.filtersClicked").attr("data-bonus") + $(".classSelect.selected").attr("data-bonus") + "</ul></td>"
            + "<td valign='top'><ul>" + $(".diff.filtersClicked").attr("data-bonus3") + $(".classSelect.selected").attr("data-bonus3") + "</ul></td>"
            + "</tr></table>"
		script = script.replace("[stat]", stat);
		script = script.replace("[stat]", stat);
        script = script.replace("[stat]", stat);
		script = script.replace("[class]", selectClass);
        script = script.replace("[class]", selectClass);
		$("#runBonus").html(script);
	});
	$("#finishReset").on("click", function(){
		rebirth();
	});
	$(".classSelect:not(.locked)").addClass("unselected");
	$("#pala").addClass("selected").removeClass("unselected");
	$("#diffNorm").trigger("click");
});
function rebirth(){
	$.ajax({
		type: "POST",
		dataType: "text",
		data: {call:"rebirth", token:sessionToken, param1:selectClass, param2:diff, param3:"0", param4:$("#runBonus").html()},
		url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
		success: refresh
	});
}
function refresh(result){
	console.log(result);
	if(result == 1){
		window.location.replace('kong_main.html');
	}
}
function saveCookie(){
	localStorage.setItem("cookie", sessionToken);
}
