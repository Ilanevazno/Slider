import './plugin/components/sliderPlugin';


function importAll(resolve) {
  resolve.keys().forEach(resolve);
}

importAll(require.context('./demo-page', true, /\.js$|\.ts$|\.scss$/));
importAll(require.context('./plugin', true, /\.js$|\.ts$|\.scss$/));
