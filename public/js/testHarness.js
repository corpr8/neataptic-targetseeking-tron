var successes = 0
var failures = 0
var convergenceCounts = []

$().ready(function(){
  $('#testFrame').height($(window).height() - $('.hud').height() -10)
  $('#testFrame').attr('src',location.href.substring(0, location.href.lastIndexOf("/")+1)+ 'index.html')
  setInterval(function(){
  	var v = $('#testFrame').contents().find('#firstConvergence').html()
  	if(v != ''){
  		console.log('experiment succeeded')
  		successes += 1
  		updateConvergenceCounts(v)
  		$('#testFrame').attr('src',location.href.substring(0, location.href.lastIndexOf("/")+1)+ 'index.html?' + new Date().getTime())
  		$('#successes').html(successes)
  		updatePerformance()
  	} else if(parseInt($('#testFrame').contents().find('#firstConvergence').html()) > 300){
  		failures += 1
  		updatePerformance()
  	}
  },60000)
})

function updatePerformance(){
	if(failures == 0){
		$('#successRate').html('100%')
	} else {
		$('#successRate').html(Math.floor(successes/failures * 10000)/100 + '%')	
	}
}

function updateConvergenceCounts(newValue){
	convergenceCounts.push(newValue)
	if(convergenceCounts.length > 10){
		convergenceCounts.shift()
	}
	var totalConvergence = 0
	for(i = 0; i < convergenceCounts.length;i++){
		totalConvergence += parseInt(convergenceCounts[i])
	}
	$('#aveSucGen').html(totalConvergence / convergenceCounts.length )

	
	return
}