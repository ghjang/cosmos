/// <reference path="singleton_holder.ts" />


// for global state
class GlobalState
{
    private selectedEpisodeNo_: number = 0;
    private selectedEpisodeTitle_: string = '';

    private tableOfContentsPageInit_: boolean = false;
    private vocabularyPageInit_: boolean = false;

    get selectedEpisodeNo(): number { return this.selectedEpisodeNo_; }
    set selectedEpisodeNo(no: number) { this.selectedEpisodeNo_ = no; }
    get selectedEpisodeTitle(): string { return this.selectedEpisodeTitle_; }
    set selectedEpisodeTitle(title: string) { this.selectedEpisodeTitle_ = title; }

    get tocPageInitState(): boolean { return this.tableOfContentsPageInit_; }
    set tocPageInitState(state: boolean) { this.tableOfContentsPageInit_ = state; }
    get vocaPageInitState(): boolean { return this.vocabularyPageInit_; }
    set vocaPageInitState(state: boolean) { this.vocabularyPageInit_ = state; }

    get baseUrl(): string { return 'https://ghjang.github.io/cosmos'; }
} // class GlobalState


const g_state: GlobalState = SingletonHolder.getInstance(GlobalState);


class Dictionary
{
    private static dictApiUrlBase_: string
        = "http://api.pearson.com/v2/dictionaries/ldoce5/entries";

    private static createDictApiUrl(word: string, wordClass: string): string
    {
        return `${this.dictApiUrlBase_}?headword=${word}&part_of_speech=${wordClass}&limit=1&apikey=pF2UC6GfDAjsuVwmX6yQ7V6LOM26fGo6&jsonp=?`;
    }

    static loadDefinition(elem: any, word: string, wordClass: string): void
    {
        if ($(elem).text().length > 0) { // if already loaded,
            return;
        }

        if ('adj' == wordClass) {
            wordClass = 'adjective';
        } else if ('adv' == wordClass) {
            wordClass = 'adverb';
        }
        
        $.getJSON(
            this.createDictApiUrl(word, wordClass),
            (data) => {
                try {
                    $(elem).text(data.results[0].senses[0].definition[0]);
                } catch(err) {
                    $(elem).text('No definitions were found.');
                }
            }
        );        
    }
} // class Dictionary


class VocaLoader
{
    static loadWords(episodeNo: number, panelSelector: string): void
    {
        if ($(panelSelector).children().length > 0) { // if already loaded,
            return;
        }

        let wordClass = panelSelector.substring(1, panelSelector.indexOf("-"));
        let fileName = episodeNo + "." + wordClass.toUpperCase() + ".txt";
        $.ajax({
            url: `${g_state.baseUrl}/txt/${fileName}`,
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
                    Dictionary.loadDefinition(
                        $(e.target).find('.wordDef')[0],
                        $(e.target).attr('data-filtertext'),
                        wordClass
                    );
                });
                $('#tabs').enhanceWithin();
            }
        });
    }
} // class VocaLoader


class PageView
{
    static init(): void
    {
        // table of contents page, the front page.
        $(document).on('pagebeforeshow', '#table-of-contents', () => {
            if (g_state.tocPageInitState) {
                return;
            }       
            $(document).on('click', '.next-page-button', function() {
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
                        VocaLoader.loadWords(
                            g_state.selectedEpisodeNo,
                            ui.newPanel.selector
                        );
                    } 
                });
                g_state.vocaPageInitState = true;
            }
            $('#tabs').tabs('option', 'active', 0);     // select the noun tab.
            $('#noun-tab').addClass('ui-btn-active');   // NOTE: the noun tab is not highlighted. --;
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
} // class PageView


// init the page views.
PageView.init();
