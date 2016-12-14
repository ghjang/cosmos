class SingletonHolder {
    constructor() {
    }
    static getInstance(t) {
        if (undefined == this.className2InstanceMap_[t.name]) {
            this.className2InstanceMap_[t.name] = new t();
        }
        return this.className2InstanceMap_[t.name];
    }
}
SingletonHolder.className2InstanceMap_ = {};
/// <reference path="singleton_holder.ts" />
// for global state
class GlobalState {
    constructor() {
        this.selectedEpisodeNo_ = 0;
        this.selectedEpisodeTitle_ = '';
        this.tableOfContentsPageInit_ = false;
        this.vocabularyPageInit_ = false;
    }
    get selectedEpisodeNo() { return this.selectedEpisodeNo_; }
    set selectedEpisodeNo(no) { this.selectedEpisodeNo_ = no; }
    get selectedEpisodeTitle() { return this.selectedEpisodeTitle_; }
    set selectedEpisodeTitle(title) { this.selectedEpisodeTitle_ = title; }
    get tocPageInitState() { return this.tableOfContentsPageInit_; }
    set tocPageInitState(state) { this.tableOfContentsPageInit_ = state; }
    get vocaPageInitState() { return this.vocabularyPageInit_; }
    set vocaPageInitState(state) { this.vocabularyPageInit_ = state; }
}
 // class GlobalState
const g_state = SingletonHolder.getInstance(GlobalState);
class Dictionary {
    static loadDefinition(elem, word, wordClass) {
        if ($(elem).text().length > 0) {
            return;
        }
        if ('adj' == wordClass) {
            wordClass = 'adjective';
        }
        else if ('adv' == wordClass) {
            wordClass = 'adverb';
        }
        $.ajax({
            url: `http://api.pearson.com/v2/dictionaries/ldoce5/entries?headword=${word}&part_of_speech=${wordClass}&limit=1&apikey=pF2UC6GfDAjsuVwmX6yQ7V6LOM26fGo6`,
            dataType: "json",
            success: (data, status, jqXHR) => {
                try {
                    $(elem).text(data.results[0].senses[0].definition[0]);
                }
                catch (err) {
                    $(elem).text('No definitions were found.');
                }
            }
        });
    }
}
 // class Dictionary
class VocaLoader {
    static loadWords(episodeNo, panelSelector) {
        if ($(panelSelector).children().length > 0) {
            return;
        }
        let wordClass = panelSelector.substring(1, panelSelector.indexOf("-"));
        let fileName = episodeNo + "." + wordClass.toUpperCase() + ".txt";
        $.ajax({
            url: "https://ghjang.github.io/cosmos/txt/" + fileName,
            dataType: "text",
            success: (data, status, jqXHR) => {
                let listHtml = `<div data-role="collapsibleset" data-theme="a" data-content-theme="a"
                                     data-filter="true" data-inset="true" data-input="#searchForCollapsibleSet">`;
                let words = data.split('\n');
                words.forEach((item, index) => {
                    listHtml += `<div data-role="collapsible" data-filtertext="${item}" class="wordCollapsible">
                                    <h3>${item}</h3>
                                    <p class="wordDef"></p>
                                 </div>`;
                });
                listHtml += '</div>';
                $(listHtml).appendTo(panelSelector);
                $('.wordCollapsible').on("collapsibleexpand", (e, ui) => {
                    Dictionary.loadDefinition($(e.target).find('.wordDef')[0], $(e.target).attr('data-filtertext'), wordClass);
                });
                $('#tabs').enhanceWithin();
            }
        });
    }
}
 // class VocaLoader
class PageView {
    static init() {
        // table of contents page, the front page.
        $(document).on('pagebeforeshow', '#table-of-contents', () => {
            if (g_state.tocPageInitState) {
                return;
            }
            $(document).on('click', '.next-page-button', function () {
                g_state.selectedEpisodeNo
                    = this.innerText.substring(0, this.innerText.indexOf('.'));
                g_state.selectedEpisodeTitle = this.innerText;
                $.mobile.changePage('#vocabulary');
            });
            g_state.tocPageInitState = true;
        });
        // vocabulary page, the second page.
        $(document).on('pagebeforeshow', '#vocabulary', () => {
            if (g_state.selectedEpisodeTitle == '') {
                $.mobile.changePage('#table-of-contents');
                return;
            }
            $('#episode-name').text(g_state.selectedEpisodeTitle);
            if (!g_state.vocaPageInitState) {
                $('#tabs').tabs({
                    activate: (e, ui) => {
                        VocaLoader.loadWords(g_state.selectedEpisodeNo, ui.newPanel.selector);
                    }
                });
                g_state.vocaPageInitState = true;
            }
            $('#tabs').tabs('option', 'active', 0); // select the noun tab.
            $('#noun-tab').addClass('ui-btn-active'); // NOTE: the noun tab is not highlighted. --;
            VocaLoader.loadWords(g_state.selectedEpisodeNo, '#noun-body');
        });
        // vocabulary page, the second page.
        $(document).on('pagehide', '#vocabulary', () => {
            $('#noun-body').empty();
            $('#verb-body').empty();
            $('#adj-body').empty();
            $('#adv-body').empty();
        });
    }
}
 // class PageView
// init the page views.
PageView.init();
//# sourceMappingURL=cosmos_voca.js.map