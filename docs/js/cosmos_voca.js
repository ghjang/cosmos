// singleton global state
var GlobalState = (function () {
    function GlobalState() {
        this.selectedEpisodeNo_ = 0;
        this.selectedEpisodeTitle_ = '';
        this.tableOfContentsPageInit_ = false;
        this.vocabularyPageInit_ = false;
    }
    GlobalState.getInstance = function () {
        if (!GlobalState.instance_) {
            GlobalState.instance_ = new GlobalState();
        }
        return GlobalState.instance_;
    };
    Object.defineProperty(GlobalState.prototype, "selectedEpisodeNo", {
        get: function () { return this.selectedEpisodeNo_; },
        set: function (no) { this.selectedEpisodeNo_ = no; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalState.prototype, "selectedEpisodeTitle", {
        get: function () { return this.selectedEpisodeTitle_; },
        set: function (title) { this.selectedEpisodeTitle_ = title; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalState.prototype, "tocPageInitState", {
        get: function () { return this.tableOfContentsPageInit_; },
        set: function (state) { this.tableOfContentsPageInit_ = state; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalState.prototype, "vocaPageInitState", {
        get: function () { return this.vocabularyPageInit_; },
        set: function (state) { this.vocabularyPageInit_ = state; },
        enumerable: true,
        configurable: true
    });
    return GlobalState;
}()); // class GlobalState
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
            if (GlobalState.getInstance().tocPageInitState) {
                return;
            }
            $(document).on('click', '.next-page-button', function () {
                var state = GlobalState.getInstance();
                state.selectedEpisodeNo
                    = this.innerText.substring(0, this.innerText.indexOf('.'));
                state.selectedEpisodeTitle = this.innerText;
                $.mobile.changePage('#vocabulary');
            });
            GlobalState.getInstance().tocPageInitState = true;
        });
        // vocabulary page, the second page.
        $(document).on('pagebeforeshow', '#vocabulary', function () {
            var state = GlobalState.getInstance();
            if (state.selectedEpisodeTitle == '') {
                $.mobile.changePage('#table-of-contents');
                return;
            }
            $('#episode-name').text(state.selectedEpisodeTitle);
            if (!state.vocaPageInitState) {
                $('#tabs').tabs({
                    activate: function (e, ui) {
                        VocaLoader.loadWords(GlobalState.getInstance().selectedEpisodeNo, ui.newPanel.selector);
                    }
                });
                state.vocaPageInitState = true;
            }
            $('#tabs').tabs('option', 'active', 0); // select the noun tab.
            $('#noun-tab').addClass('ui-btn-active'); // NOTE: the noun tab is not highlighted. --;
            VocaLoader.loadWords(state.selectedEpisodeNo, '#noun-body');
        });
    };
    return PageView;
}()); // class PageView
// init the page views.
PageView.init();
//# sourceMappingURL=cosmos_voca.js.map