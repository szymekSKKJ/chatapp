//potrzba sprawdzać duże i małe emoji

const ifMessageIncludesEmojiWithSymbols = (messageContent, messageContentElement) => {
    let fromCode;
    if (messageContent.toLowerCase().includes(':d')) {
        fromCode = twemoji.convert.fromCodePoint('1f600');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll(':d', fromCode)}</p>`;
    }
    if (messageContent.includes(':D')) {
        fromCode = twemoji.convert.fromCodePoint('1f600');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll(':D', fromCode)}</p>`;
    }
    if (messageContent.toLowerCase().includes(':p')) {
        fromCode = twemoji.convert.fromCodePoint('1f61b');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll(':p', fromCode)}</p>`;
    }
    if (messageContent.toLowerCase().includes(':)')) {
        fromCode = twemoji.convert.fromCodePoint('1f642');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll(':)', fromCode)}</p>`;
    }
    if (messageContent.toLowerCase().includes(':(')) {
        fromCode = twemoji.convert.fromCodePoint('1f641');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll(':(', fromCode)}</p>`;
    }
    if (messageContent.toLowerCase().includes('(:')) {
        fromCode = twemoji.convert.fromCodePoint('1f643');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll('(:', fromCode)}</p>`;
    }
    if (messageContent.toLowerCase().includes(':|')) {
        fromCode = twemoji.convert.fromCodePoint('1f610');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll(':|', fromCode)}</p>`;
    }
    if (messageContent.toLowerCase().includes(':*')) {
        fromCode = twemoji.convert.fromCodePoint('1f618');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll(':*', fromCode)}</p>`;
    }
    if (messageContent.toLowerCase().includes(':c')) {
        fromCode = twemoji.convert.fromCodePoint('1f61f');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll(':c', fromCode)}</p>`;
    }
    if (messageContent.toLowerCase().includes(':o')) {
        fromCode = twemoji.convert.fromCodePoint('1f632');
        messageContentElement.innerHTML = `<p>${messageContent.replaceAll(':o', fromCode)}</p>`;
    }
    if (messageContent.toLowerCase().includes('^.^')) {
        fromCode = twemoji.convert.fromCodePoint('1f63a');
        messageContentElement.innerHTML = `<p>${messageContent.toLowerCase().replaceAll('^.^', fromCode)}</p>`;
    }
    twemoji.parse(messageContentElement);
}

export default ifMessageIncludesEmojiWithSymbols;