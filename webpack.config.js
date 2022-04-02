module.exports = (env, argv) => {
  console.log(env, argv);
  return {
    mode: argv.mode,
    output: {
      filename: 'bundle.js',
    },
  };
};
