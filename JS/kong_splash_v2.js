var news;
$(document).ready(function() {
	getNews();
	getItems();
	getSkills();
	getSkillLevels();

	// Initialize local session
	initializeLocalSession();

	$('#splash-login').click(function(){
		if($("#splash-login").html() == "Start"){
			window.location.replace('main.html');
		}
	});
});

function populateNews(newsJSON){
	newsJSON = newsJSON[0];
	string = '';
	string += '<table style="width:90%; margin: 15px auto 50px; color: aliceblue;"><tr><td style="width:50px;">'
	string += '<div class="newsImageContainer" style="background-position:0 ' + newsJSON['imageOffset'] + 'px; background-image: '
	string += 'url(images/' + newsJSON['image'] + ')"></div></td>'
	string += '<td><div style="height:48px; line-height:48px; display:inline-block;font-size:20px;">'+newsJSON['title']+ '</div></td><td><div style="float:right;font-size:12px;">'
	string += newsJSON['date'] + '</div></td></tr>'
	string += '<tr><td colspan=3><div style="width:100%; font-size:16px;">' + newsJSON['update'] + '</div></td></tr></table>'
	$('#splash-newsC').html(string);
}
// <API CALLS>
function getNews(){
	$.ajax({
		type: "POST",
		dataType: "json",
		data: {call:"getNews"},
		url: "https://applesauce-838900413941.us-west1.run.app/AJAX.php",
		success: populateNews
	});
}

function completeLogin(info){
	$("#splash-login").removeClass("disabledButton")
	if(info.length == 16){
		try{
			localStorage.setItem("cookie", info)
		}catch(ex){}
		$("#splash-login").html("Start")
		$("#splash-login").addClass("upOne");
	}else{
	$("#splash-login").html("Log In")
		$('#loginError').html(info);
	}
}
function getItems(){
	$.ajax({
		type: "POST",
		dataType: "json",
		data: {call:"getItemList"},
		url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
		success: saveItems
	});
}
function getSkills(){
	$.ajax({
		type: "POST",
		dataType: "json",
		data: {call:"getSkillList"},
		url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
		success: saveSkills
	});
}
function getSkillLevels(){
	$.ajax({
		type: "POST",
		dataType: "json",
		data: {call:"getSkillLevels"},
		url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
		success: saveSkillLevels
	});
}
function getLogin(sessionId){
	$.ajax({
		type: "POST",
		dataType: "text",
		data: {call:"createLocalSession", sessionId: sessionId},
		url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
		success: completeLogin
	});
}
function saveItems(json){
	try{
		localStorage.setItem('itemInfo', JSON.stringify(json));
	}catch(ex){}
}
function saveSkills(json){
	try{
		localStorage.setItem('skillInfo', JSON.stringify(json));
	}catch(ex){}
}
function saveSkillLevels(json){
	try{
		localStorage.setItem('skillLevels', JSON.stringify(json));
	}catch(ex){}
}
function initializeLocalSession(){
	var sessionId;
	
	// Check if user already has a session
	if(localStorage.getItem("sessionId")){
		sessionId = localStorage.getItem("sessionId");
	}else{
		// Generate new session ID
		sessionId = generateSessionId();
		localStorage.setItem("sessionId", sessionId);
	}
	
	getLogin(sessionId);
}

function generateSessionId(){
	// Generate a unique session ID
	return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
