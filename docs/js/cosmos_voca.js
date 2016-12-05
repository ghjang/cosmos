// store obj
var g_storeObj = {
    selectedEpisodeNo : 0,
    selectedEpisodeTitle : ''
};

var g_tableOfContentsPageInit = false;


$(document).on('pagebeforeshow', '#table-of-contents', function(){
    if (g_tableOfContentsPageInit) {
        return;
    }       
    $(document).on('click', '.next-page-button', function(){
        g_storeObj.selectedEpisodeNo
            = this.innerText.substring(0, this.innerText.indexOf('.'));
        g_storeObj.selectedEpisodeTitle = this.innerText;
        $.mobile.changePage('#vocabulary');
    });
    g_tableOfContentsPageInit = true;
});

$(document).on('pagebeforeshow', '#vocabulary', function(){
    if (g_storeObj.selectedEpisodeTitle == '') {
        $.mobile.changePage('#table-of-contents');
        return;
    }
    $('#episode-name').text(g_storeObj.selectedEpisodeTitle);
    $('#noun-tab').addClass('ui-btn-active');
});
