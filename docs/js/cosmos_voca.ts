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


class VocaLoader
{
    static loadWords(episodeNo: number, panelSelector: string): void
    {
        var wordClass = panelSelector.substring(1, panelSelector.indexOf("-"));
        var fileName = episodeNo + "." + wordClass.toUpperCase() + ".txt";
        $.ajax({
            url: "https://ghjang.github.io/cosmos/txt/" + fileName,
            dataType: "text",
            success: function(data, status, jqXHR) {
                var listHtml = '<div data-role="collapsibleset" data-theme="a" data-content-theme="a"'
                                    + ' data-filter="true" data-inset="true" data-input="#searchForCollapsibleSet">';
                var words = data.split('\n');
                words.forEach((item, index) => {
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
    }
} // class VocaLoader


class PageView
{
    static init(): void
    {
        // table of contents page, the front page.
        $(document).on('pagebeforeshow', '#table-of-contents', function(){
            if (GlobalState.getInstance().tocPageInitState) {
                return;
            }       
            $(document).on('click', '.next-page-button', function(){
                let state = GlobalState.getInstance();
                state.selectedEpisodeNo
                    = this.innerText.substring(0, this.innerText.indexOf('.'));
                state.selectedEpisodeTitle = this.innerText;
                $.mobile.changePage('#vocabulary');
            });
            GlobalState.getInstance().tocPageInitState = true;
        });

        // vocabulary page, the second page.
        $(document).on('pagebeforeshow', '#vocabulary', function(){
            let state = GlobalState.getInstance();
            if (state.selectedEpisodeTitle == '') {
                $.mobile.changePage('#table-of-contents');
                return;
            }
            $('#episode-name').text(state.selectedEpisodeTitle);
            if (!state.vocaPageInitState) {
                $('#tabs').tabs({
                    activate: function(e, ui) {
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
