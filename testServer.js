const ngrok = require('ngrok');

ngrok.connect(8080, (err, url) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Tests now accessible at: ${url}`);
}
});
