// Store object
var storeObject = {
    selectedEpisodeNo : 0,
    selectedEpisodeTitle : ''
};

$(document).on('pagebeforeshow', '#table_of_contents', function(){       
    $(document).on('click', '.next-page-button', function(){
        storeObject.selectedEpisodeNo
            = this.innerText.substring(0, this.innerText.indexOf('.'));
        storeObject.selectedEpisodeTitle = this.innerText;
        $.mobile.changePage('./voca.html');
    });    
});

$(document).on('pagebeforeshow', '#vocabulary', function(){
    $('#episode-name').text(storeObject.selectedEpisodeTitle);     
});
