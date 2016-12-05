// store obj
var g_storeObj = {
    selectedEpisodeNo : 0,
    selectedEpisodeTitle : ''
};

var g_tableOfContentsPageInit = false;
var g_vocabularyPageInit = false;

function loadWords(episodeNo, panelSelector)
{
    var wordClass = panelSelector.substring(1, panelSelector.indexOf("-"));
    var fileName = episodeNo + "." + wordClass.toUpperCase() + ".txt";
    $.ajax({
        url: "https://ghjang.github.io/cosmos/txt/" + fileName,
        dataType: "text",
        success: function(data, status, jqXHR) {
            $(panelSelector).html(data);
        }
    });
}

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
    if (!g_vocabularyPageInit) {
        $('#tabs').tabs({
            activate: function(e, ui) {
                loadWords(g_storeObj.selectedEpisodeNo, ui.newPanel.selector);
            } 
        });
        g_vocabularyPageInit = true;
    }
    $('#tabs').tabs('option', 'active', 0);     // select the noun tab.
    $('#noun-tab').addClass('ui-btn-active');   // NOTE: the noun tab is not highlighted. --;
    loadWords(g_storeObj.selectedEpisodeNo, '#noun-body');
});
