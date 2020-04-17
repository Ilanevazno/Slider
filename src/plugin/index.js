function importAll(resolve) {
  resolve.keys().forEach(resolve);
}

importAll(require.context('./', true, /\.js$|\.ts$|\.scss$/));