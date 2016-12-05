import codecs
import nltk

from nltk.corpus import PlaintextCorpusReader

corpus_root = '../text'
cosmos_txt = PlaintextCorpusReader(corpus_root, '.*')


def save_words(words_tag, word_class, id):
    words_filtered = [w[0] for w in words_tag if w[1] == word_class]
    with codecs.open('{0}.{1}.txt'.format(id, word_class), 'w', 'utf-8-sig') as out_file:
        out_file.write('\n'.join(words_filtered))

def normalize(episode_id):
    words = cosmos_txt.words(episode_id)
    words = list(set(words) - set(nltk.corpus.stopwords.words('english')))
    for word_class in ['NOUN', 'VERB', 'ADJ', 'ADV']:
        if 'NOUN' == word_class or 'VERB' == word_class:
            wnlem = nltk.WordNetLemmatizer()
            words = [wnlem.lemmatize(w) for w in words] 
        else:
            pass
        words_fd = nltk.FreqDist(words)
        words_list = [pair[0].lower() for pair in words_fd.most_common()    \
                                            if pair[0].isalpha()]
        words_tag = nltk.pos_tag(words_list, tagset='universal')
        save_words(words_tag, word_class, episode_id)


for id in cosmos_txt.fileids():
    normalize(id)

#nltk.help.upenn_tagset()
