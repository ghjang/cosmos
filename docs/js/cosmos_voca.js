// store obj
var g_storeObj = {
    selectedEpisodeNo : 0,
    selectedEpisodeTitle : ''
};

var g_tableOfContentsPageInit = false;
var g_vocabularyPageInit = false;


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
                $.ajax({
                    url: "./txt/1.NOUN.txt",
                    dataType: "text",
                    success: function(data, status, jqXHR) {
                        $(ui.newPanel.selector).html(data);
                    },
                    error: function(jqXHR, status, error) {
                        alert("error");
                    }
                });
            } 
        });
        g_vocabularyPageInit = true;
    }
    $('#tabs').tabs('option', 'active', 0);     // select the noun tab.
    $('#noun-tab').addClass('ui-btn-active');   // NOTE: the noun tab is not highlighted. --;
    $.ajax({
        url: "/txt/1.NOUN.txt",
        dataType: "text",
        success: function(result) {
            $("#noun-body").html(result);
        }
    });
});
