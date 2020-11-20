migrate('change bar to foo', ({ rename }) => {
  rename('bar.json to foo.json', '**/bar.json', ({ fileName }) => {
    return { fileName: fileName.replace('bar', 'foo') };
  });
});
