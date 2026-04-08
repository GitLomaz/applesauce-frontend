$( document ).ready(function() {
//  --------------------------------------------------------------------------------------------------
//               Page init function holding action handlers
//  --------------------------------------------------------------------------------------------------	
	// Kongregate MTX removed - using local sessions only
	$('.storeItem').click(function(){
		var item = $(this).attr("data-index");
		// Local purchase handling
		if(typeof parent.addItems === 'function'){
			parent.addItems(item);
		}
	});	
});
