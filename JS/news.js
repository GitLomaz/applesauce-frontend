var news;
var newsIndex = 1;
var maxNews
$(document).ready(function() {
	getNews();
});
function getNews(){
	$.ajax({
		type: "POST",
		dataType: "json",
		data: {call:"getNews"},
		url: "https://applesauce-838900413941.us-west1.run.app/AJAX.php",
		success: populateNews
	});
}
function populateNews(newsJSON){
	counter = 0;
	string = '';

	$.each(newsJSON, function( index, news ) {
		string += '<table style="width:90%; margin: 15px auto 50px; color: aliceblue;"><tr><td style="width:50px;">'
		string += '<div class="newsImageContainer" style="background-position:0 ' + news['imageOffset'] + 'px; background-image: '
		string += 'url(../images/' + news['image'] + ')"></div></td>'
		string += '<td><div style="height:48px; line-height:48px; display:inline-block;font-size:20px;">'+news['title']+ '</div></td><td><div style="float:right;font-size:12px;">'
		string += news['date'] + '</div></td></tr>'
		string += '<tr><td colspan=3><div style="width:100%; font-size:16px;">' + news['update'] + '</div></td></tr></table>'
	});

	$('#newsDiv').html(string);
}
