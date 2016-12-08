// singleton global state
class GlobalState
{
    private static instance_: GlobalState;

    private constructor() { }

    static getInstance(): GlobalState
    {
        if (!GlobalState.instance_) {
            GlobalState.instance_ = new GlobalState();
        }
        return GlobalState.instance_;
    }

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
} // class GlobalState


class Dictionary
{
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
        
        $.ajax({
            url: `http://api.pearson.com/v2/dictionaries/ldoce5/entries?headword=${word}&part_of_speech=${wordClass}&limit=1&apikey=pF2UC6GfDAjsuVwmX6yQ7V6LOM26fGo6`,
            dataType: "json",
            success: (data, status, jqXHR) => {
                try {
                    $(elem).text(data.results[0].senses[0].definition[0]);
                } catch(err) {
                    $(elem).text('No definitions were found.');
                }
            }
        });        
    }
} // class Dictionary


class VocaLoader
{
    static loadWords(episodeNo: number, panelSelector: string): void
    {
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
            if (GlobalState.getInstance().tocPageInitState) {
                return;
            }       
            $(document).on('click', '.next-page-button', function() {
                let state = GlobalState.getInstance();
                state.selectedEpisodeNo
                    = this.innerText.substring(0, this.innerText.indexOf('.'));
                state.selectedEpisodeTitle = this.innerText;
                $.mobile.changePage('#vocabulary');
            });
            GlobalState.getInstance().tocPageInitState = true;
        });

        // vocabulary page, the second page.
        $(document).on('pagebeforeshow', '#vocabulary', () => {
            let state = GlobalState.getInstance();
            if (state.selectedEpisodeTitle == '') {
                $.mobile.changePage('#table-of-contents');
                return;
            }
            $('#episode-name').text(state.selectedEpisodeTitle);
            if (!state.vocaPageInitState) {
                $('#tabs').tabs({
                    activate: (e, ui) => {
                        VocaLoader.loadWords(
                            GlobalState.getInstance().selectedEpisodeNo,
                            ui.newPanel.selector
                        );
                    } 
                });
                state.vocaPageInitState = true;
            }
            $('#tabs').tabs('option', 'active', 0);     // select the noun tab.
            $('#noun-tab').addClass('ui-btn-active');   // NOTE: the noun tab is not highlighted. --;
            VocaLoader.loadWords(state.selectedEpisodeNo, '#noun-body');
        });
    }
} // class PageView


// init the page views.
PageView.init();
