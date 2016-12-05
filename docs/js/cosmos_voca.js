// Store object
var storeObject = {
    selectedEpisodeNo : 0,
    selectedEpisodeTitle : ''
};

$(document).on('pagebeforeshow', '#table-of-contents', function(){       
    $(document).on('click', '.next-page-button', function(){
        storeObject.selectedEpisodeNo
            = this.innerText.substring(0, this.innerText.indexOf('.'));
        storeObject.selectedEpisodeTitle = this.innerText;
        $.mobile.changePage('#vocabulary');
    });    
});

$(document).on('pagebeforeshow', '#vocabulary', function(){
    if (storeObject.selectedEpisodeTitle == '') {
        $.mobile.changePage('#table-of-contents');
        return;
    }
    $('#episode-name').text(storeObject.selectedEpisodeTitle);     
});
