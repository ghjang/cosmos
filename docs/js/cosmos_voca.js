// store obj
var g_storeObj = {
    selectedEpisodeNo: 0,
    selectedEpisodeTitle: ''
};
var g_tableOfContentsPageInit = false;
var g_vocabularyPageInit = false;
var VocaLoader = (function () {
    function VocaLoader() {
    }
    VocaLoader.loadWords = function (episodeNo, panelSelector) {
        var wordClass = panelSelector.substring(1, panelSelector.indexOf("-"));
        var fileName = episodeNo + "." + wordClass.toUpperCase() + ".txt";
        $.ajax({
            url: "https://ghjang.github.io/cosmos/txt/" + fileName,
            dataType: "text",
            success: function (data, status, jqXHR) {
                var listHtml = '<div data-role="collapsibleset" data-theme="a" data-content-theme="a"'
                    + ' data-filter="true" data-inset="true" data-input="#searchForCollapsibleSet">';
                var words = data.split('\n');
                words.forEach(function (item, index) {
                    listHtml += '<div data-role="collapsible" data-filtertext="' + item + '">';
                    listHtml += '<h3>' + item + '</h3>';
                    listHtml += '<p>' + index + '</p>';
                    listHtml += '</div>';
                });
                listHtml += '</div>';
                $(listHtml).appendTo(panelSelector);
                $('#tabs').enhanceWithin();
            }
        });
    };
    return VocaLoader;
}()); // class VocaLoader
var PageView = (function () {
    function PageView() {
    }
    PageView.init = function () {
        // table of contents page, the front page.
        $(document).on('pagebeforeshow', '#table-of-contents', function () {
            if (g_tableOfContentsPageInit) {
                return;
            }
            $(document).on('click', '.next-page-button', function () {
                g_storeObj.selectedEpisodeNo
                    = this.innerText.substring(0, this.innerText.indexOf('.'));
                g_storeObj.selectedEpisodeTitle = this.innerText;
                $.mobile.changePage('#vocabulary');
            });
            g_tableOfContentsPageInit = true;
        });
        // vocabulary page, the second page.
        $(document).on('pagebeforeshow', '#vocabulary', function () {
            if (g_storeObj.selectedEpisodeTitle == '') {
                $.mobile.changePage('#table-of-contents');
                return;
            }
            $('#episode-name').text(g_storeObj.selectedEpisodeTitle);
            if (!g_vocabularyPageInit) {
                $('#tabs').tabs({
                    activate: function (e, ui) {
                        VocaLoader.loadWords(g_storeObj.selectedEpisodeNo, ui.newPanel.selector);
                    }
                });
                g_vocabularyPageInit = true;
            }
            $('#tabs').tabs('option', 'active', 0); // select the noun tab.
            $('#noun-tab').addClass('ui-btn-active'); // NOTE: the noun tab is not highlighted. --;
            VocaLoader.loadWords(g_storeObj.selectedEpisodeNo, '#noun-body');
        });
    };
    return PageView;
}()); // class PageView
// init the page views.
PageView.init();
//# sourceMappingURL=cosmos_voca.js.map